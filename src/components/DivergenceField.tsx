"use client";

import { useEffect, useRef } from "react";

import { drivers, gridFor, GRID_PITCH } from "@/lib/divergence";

/**
 * The page's one loud element: two ruled grids describing the same system — what it was
 * estimated to do, and what it actually did — drawn over each other so that the disagreement
 * between them becomes visible.
 *
 * Hand-written WebGL2. No wrapper, no scene graph, no loader: one full-screen quad and one
 * fragment shader is the whole thing, which is both the highest quality-per-byte tier in the
 * domain and the only tier where the output is code nobody else has.
 *
 * Every parameter maps to a real number from `content/cases.ts` — see `lib/divergence.ts`.
 * Nothing here is tuned until it looks nice.
 */

const VERTEX = `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

/**
 * Line grids with analytic anti-aliasing: coverage is derived from the screen-space
 * derivative of the distance field, so the rules stay one hairline wide at any pitch, any
 * angle and any device pixel ratio. Sampling a texture would alias exactly where the moiré
 * lives, which would make the interference an artefact of the renderer instead of the
 * geometry — the one thing this effect must not be.
 */
const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform vec2  u_origin;      // sampling origin, moved by the pointer
uniform float u_pitch;       // grid A period, in device pixels
uniform float u_pitchRatio;  // grid B period / grid A period  <- the case's ratio
uniform float u_angle;       // grid B rotation, radians       <- the case's ratio
uniform float u_weight;      // hairline weight, in device pixels
uniform vec3  u_ink;
uniform vec3  u_ground;
uniform float u_strength;

out vec4 outColor;

// Coverage of one ruling: parallel lines of the given period, measured along direction d.
float ruling(vec2 p, vec2 d, float period, float weight) {
  float t = dot(p, d) / period;
  float dist = abs(fract(t) - 0.5) * period;      // distance to the nearest line, in pixels
  float aa = fwidth(dist) + 0.0001;
  return 1.0 - smoothstep(weight * 0.5 - aa, weight * 0.5 + aa, dist);
}

// A grid is two rulings at right angles — a ruled plate, not a barcode. Two of these overlaid
// at a small difference is what produces a rosette rather than a stripe.
float grid(vec2 p, float angle, float period, float weight) {
  vec2 d = vec2(cos(angle), sin(angle));
  vec2 n = vec2(-d.y, d.x);
  float a = ruling(p, d, period, weight);
  float b = ruling(p, n, period, weight);
  return a + b - a * b;
}

void main() {
  vec2 p = gl_FragCoord.xy - u_origin;

  // Grid A: the estimate. Fixed pitch, fixed axis — the reference the other is read against.
  float a = grid(p, 0.0, u_pitch, u_weight);

  // Grid B: the actual. Its period and its axis both carry the case's ratio.
  float b = grid(p, u_angle, u_pitch * u_pitchRatio, u_weight);

  // Union, not multiply: two overlaid rulings, the way two printed screens overlay. The beat
  // pattern is what emerges where their coverages reinforce and cancel.
  float ink = (a + b - a * b) * u_strength;

  outColor = vec4(mix(u_ground, u_ink, ink), 1.0);
}`;

const WEIGHT = 1.0;
/** How long the field takes to travel between two cases. The transition is the mechanism. */
const TRAVEL_MS = 760;

type Props = {
  /** Index into `drivers`. */
  active: number;
  /** Rendered under the canvas and left visible if WebGL never starts. */
  children: React.ReactNode;
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Resolve a design token to the exact bytes the browser would paint.
 *
 * Not by parsing: the tokens are `oklch()`, and Chromium's computed value for `color` keeps
 * them in `oklch()` rather than converting to `rgb()`, so reading three numbers out of the
 * string yields the lightness, the chroma and the hue where red, green and blue were
 * expected. Painting one pixel and reading it back asks the browser to do the conversion it
 * is already doing for every other element on the page, which is also the only way these
 * stay identical when the token changes.
 */
function makeTokenReader(): (name: string) => [number, number, number] {
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;width:0;height:0;opacity:0;pointer-events:none";
  document.body.appendChild(probe);

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  return (name: string): [number, number, number] => {
    probe.style.color = `var(${name})`;
    const computed = getComputedStyle(probe).color;
    if (!ctx) return [0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = computed;
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
  };
}


export function DivergenceField({ active, children }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const element = holder.current;
    if (!canvas || !element) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    // No WebGL2: the CSS grids underneath are already correct and stay visible.
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("could not create a shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader) ?? "unknown";
        gl.deleteShader(shader);
        throw new Error(`shader failed to compile: ${log}`);
      }
      return shader;
    };

    let program: WebGLProgram | null = null;
    try {
      const vertex = compile(gl.VERTEX_SHADER, VERTEX);
      const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
      program = gl.createProgram();
      if (!program) throw new Error("could not create a program");
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`program failed to link: ${gl.getProgramInfoLog(program) ?? "unknown"}`);
      }
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    } catch (error) {
      // Never swallowed: the fallback is a design decision, not a hidden failure.
      console.warn("divergence field: falling back to the CSS grids —", error);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const attribute = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program as WebGLProgram, name);
    const u = {
      resolution: uniform("u_resolution"),
      origin: uniform("u_origin"),
      pitch: uniform("u_pitch"),
      pitchRatio: uniform("u_pitchRatio"),
      angle: uniform("u_angle"),
      weight: uniform("u_weight"),
      ink: uniform("u_ink"),
      ground: uniform("u_ground"),
      strength: uniform("u_strength"),
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const first = drivers[0];
    const start = gridFor(first ? first.ratio : 1);

    const state = {
      dpr: 1,
      width: 0,
      height: 0,
      pitchRatio: start.pitch,
      angle: start.angle,
      fromPitch: start.pitch,
      fromAngle: start.angle,
      toPitch: start.pitch,
      toAngle: start.angle,
      travelStart: 0,
      travelling: false,
      pointer: { x: 0.5, y: 0.5 },
      origin: { x: 0, y: 0 },
      index: activeRef.current,
      visible: false,
      raf: 0,
      lost: false,
    };

    const readToken = makeTokenReader();

    function palette() {
      gl!.uniform3fv(u.ink, readToken("--color-edge"));
      gl!.uniform3fv(u.ground, readToken("--color-surface"));
    }

    function resize() {
      const rect = element!.getBoundingClientRect();
      // Clamped: a 3× device ratio buys nothing on a hairline grid and costs 2.25× the fill.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (width === state.width && height === state.height && dpr === state.dpr) return;
      state.dpr = dpr;
      state.width = width;
      state.height = height;
      canvas!.width = width;
      canvas!.height = height;
      gl!.viewport(0, 0, width, height);
      gl!.uniform2f(u.resolution, width, height);
    }

    function draw(now: number) {
      if (state.lost) return;

      if (state.travelling) {
        const t = Math.min(1, (now - state.travelStart) / TRAVEL_MS);
        const eased = easeInOutCubic(t);
        state.pitchRatio = state.fromPitch + (state.toPitch - state.fromPitch) * eased;
        state.angle = state.fromAngle + (state.toAngle - state.fromAngle) * eased;
        if (t >= 1) state.travelling = false;
      }

      // The pointer moves where the beat bands fall. It is the one continuous input, and it
      // is why this is a surface being read rather than a picture being shown.
      const targetX = state.pointer.x * state.width;
      const targetY = state.pointer.y * state.height;
      state.origin.x += (targetX - state.origin.x) * 0.08;
      state.origin.y += (targetY - state.origin.y) * 0.08;

      gl!.uniform2f(u.origin, state.origin.x, state.origin.y);
      gl!.uniform1f(u.pitch, GRID_PITCH * state.dpr);
      gl!.uniform1f(u.pitchRatio, state.pitchRatio);
      gl!.uniform1f(u.angle, (state.angle * Math.PI) / 180);
      gl!.uniform1f(u.weight, WEIGHT * state.dpr);
      gl!.uniform1f(u.strength, 1);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function frame(now: number) {
      state.raf = requestAnimationFrame(frame);
      const settled =
        !state.travelling &&
        Math.abs(state.pointer.x * state.width - state.origin.x) < 0.5 &&
        Math.abs(state.pointer.y * state.height - state.origin.y) < 0.5;
      // No idle loop: once the field has arrived and the pointer has stopped, it stops too.
      if (settled) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
        return;
      }
      draw(now);
    }

    function kick() {
      if (!state.visible || state.raf !== 0 || state.lost) return;
      state.raf = requestAnimationFrame(frame);
    }

    function goTo(index: number, animate: boolean) {
      const driver = drivers[index];
      if (!driver) return;
      const target = gridFor(driver.ratio);
      if (animate && !reduced.matches) {
        state.fromPitch = state.pitchRatio;
        state.fromAngle = state.angle;
        state.toPitch = target.pitch;
        state.toAngle = target.angle;
        state.travelStart = performance.now();
        state.travelling = true;
        kick();
      } else {
        // Reduced motion still changes the field: which case is selected is content.
        state.travelling = false;
        state.pitchRatio = target.pitch;
        state.angle = target.angle;
        state.origin.x = state.pointer.x * state.width;
        state.origin.y = state.pointer.y * state.height;
        draw(performance.now());
      }
    }

    const onPointer = (event: PointerEvent) => {
      if (reduced.matches) return;
      const rect = element!.getBoundingClientRect();
      state.pointer.x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      state.pointer.y = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      kick();
    };

    const onLost = (event: Event) => {
      event.preventDefault();
      state.lost = true;
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = 0;
      element.dataset.live = "false";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          state.visible = entry.isIntersecting;
          if (entry.isIntersecting) kick();
          else if (state.raf) {
            cancelAnimationFrame(state.raf);
            state.raf = 0;
          }
        }
      },
      { rootMargin: "120px" },
    );

    const onVisibility = () => {
      if (document.hidden && state.raf) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else kick();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });

    const onTheme = () => {
      palette();
      draw(performance.now());
    };
    const themeObserver = new MutationObserver(onTheme);

    resize();
    palette();
    state.pointer = { x: 0.5, y: 0.6 };
    state.origin.x = state.pointer.x * state.width;
    state.origin.y = state.pointer.y * state.height;
    goTo(activeRef.current, false);
    element.dataset.live = "true";

    observer.observe(element);
    resizeObserver.observe(element);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    element.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);

    const onExternal = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      if (!detail) return;
      state.index = detail.index;
      goTo(detail.index, true);
    };
    element.addEventListener("divergence:select", onExternal);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      element.removeEventListener("pointermove", onPointer);
      element.removeEventListener("divergence:select", onExternal);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (state.raf) cancelAnimationFrame(state.raf);
      gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      element.dataset.live = "false";
    };
  }, []);

  // Selection is driven from the server-rendered controls through a DOM event, so the
  // controls stay usable before this component hydrates.
  useEffect(() => {
    holder.current?.dispatchEvent(
      new CustomEvent("divergence:select", { detail: { index: active } }),
    );
  }, [active]);

  return (
    <div
      ref={holder}
      data-live="false"
      className="u-field relative isolate h-full w-full overflow-hidden"
    >
      {/* Drawn in HTML, correct without JavaScript, and hidden the moment the shader is live. */}
      <div aria-hidden className="u-field-fallback absolute inset-0">
        {children}
      </div>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
    </div>
  );
}
