"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { profile } from "@/data/profile";

const W = 320;
const H = 200;
const PLAYER_W = 24;
const PLAYER_H = 16;
const BUG_W = 16;
const BUG_H = 12;
const BULLET_SPEED = -8;
const BUG_SPEED_Y = 4;
const DROP_SPEED = 2;
const TOUCH_BTN_MIN_SIZE = 44;

const SKILLS_POOL: string[] = [
  ...profile.skills.frontend,
  ...profile.skills.backend,
  ...profile.skills.databases.slice(0, 4),
  ...profile.skills.devops.slice(0, 4),
].slice(0, 24);

function getThemeColors() {
  if (typeof document === "undefined")
    return { bg: "#0a0a0a", fg: "#fafaf9", accent: "#d4a853", muted: "#666" };
  const s = getComputedStyle(document.documentElement);
  const raw = (key: string, fallback: string) => {
    const val = s.getPropertyValue(key).trim();
    return val ? `rgb(${val})` : fallback;
  };
  return {
    bg:     raw("--surface",       "#0a0a0a"),
    fg:     raw("--fg",            "#fafaf9"),
    accent: raw("--color-accent",  "#d4a853"),
    muted:  raw("--fg-muted",      "#666"),
  };
}

type Bullet = { x: number; y: number };
type Bug = { x: number; y: number; alive: boolean };
type Drop = { x: number; y: number; word: string };

export function Minigame() {
  const { t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const keysRef = useRef<{ left: boolean; right: boolean; fire: boolean }>({
    left: false,
    right: false,
    fire: false,
  });
  const scoreLivesRef = useRef({ score: 0, lives: 3 });

  const gameStateRef = useRef<"idle" | "playing" | "gameover">("idle");

  const stateRef = useRef({
    playerX: W / 2 - PLAYER_W / 2,
    bullets: [] as Bullet[],
    bugs: [] as Bug[],
    drops: [] as Drop[],
    bugDir: 1,
    bugTick: 0,
    fireCooldown: 0,
    dropSpawnTick: 0,
  });

  const spawnBugs = useCallback(() => {
    const bugs: Bug[] = [];
    const rows = 3;
    const cols = 8;
    const startX = (W - cols * (BUG_W + 8)) / 2 + BUG_W / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bugs.push({
          x: startX + c * (BUG_W + 8),
          y: 24 + r * (BUG_H + 6),
          alive: true,
        });
      }
    }
    stateRef.current.bugs = bugs;
  }, []);

  const startGame = useCallback(() => {
    gameStateRef.current = "playing";
    setGameState("playing");
    setScore(0);
    setLives(3);
    scoreLivesRef.current = { score: 0, lives: 3 };
    stateRef.current = {
      playerX: W / 2 - PLAYER_W / 2,
      bullets: [],
      bugs: [],
      drops: [],
      bugDir: 1,
      bugTick: 0,
      fireCooldown: 0,
      dropSpawnTick: 0,
    };
    spawnBugs();
  }, [spawnBugs]);

  useEffect(() => setMounted(true), []);

  // Pause RAF when tab is hidden
  useEffect(() => {
    const onVisibilityChange = () => {
      pausedRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Scale canvas to devicePixelRatio for sharp rendering
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [mounted]);

  // Idle screen animation
  useEffect(() => {
    if (!mounted || gameState !== "idle") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Re-apply DPR scale after context re-acquire
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let frame = 0;

    const drawIdle = () => {
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(drawIdle);
        return;
      }
      const colors = getThemeColors();
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, W, H);

      const py = H - PLAYER_H - 8;
      const px = W / 2 - PLAYER_W / 2;

      // Player ship centered
      ctx.fillStyle = colors.fg;
      ctx.beginPath();
      ctx.moveTo(px + PLAYER_W / 2, py + PLAYER_H);
      ctx.lineTo(px, py + PLAYER_H - 12);
      ctx.lineTo(px + PLAYER_W / 2, py + 4);
      ctx.lineTo(px + PLAYER_W, py + PLAYER_H - 12);
      ctx.closePath();
      ctx.fill();

      // Engine glow
      const glowAlpha = 0.3 + 0.3 * Math.sin(frame * 0.08);
      ctx.fillStyle = colors.accent.replace("rgb(", "rgba(").replace(")", `, ${glowAlpha})`);
      ctx.beginPath();
      ctx.arc(px + PLAYER_W / 2, py + PLAYER_H + 3, 4, 0, Math.PI * 2);
      ctx.fill();

      // Bug formation (static decorative)
      ctx.fillStyle = colors.accent.replace("rgb(", "rgba(").replace(")", ", 0.25)");
      const rows = 2, cols = 6;
      const startX = (W - cols * (BUG_W + 10)) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = startX + c * (BUG_W + 10);
          const by = 30 + r * (BUG_H + 8);
          ctx.fillRect(bx, by, BUG_W, BUG_H);
        }
      }

      // Blinking "PRESS START"
      const blink = Math.floor(frame / 30) % 2 === 0;
      if (blink) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = colors.accent;
        ctx.textAlign = "center";
        ctx.fillText("PRESS START", W / 2, H / 2 + 10);
        ctx.textAlign = "left";
      }

      frame++;
      rafRef.current = requestAnimationFrame(drawIdle);
    };

    rafRef.current = requestAnimationFrame(drawIdle);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, gameState]);

  useEffect(() => {
    if (!mounted || gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Re-apply DPR scale after context re-acquire
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();

    const loop = () => {
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 16, 3);
      lastTime = now;

      const state = stateRef.current;
      const keys = keysRef.current;

      // Player movement
      const speed = 4 * dt;
      if (keys.left) state.playerX = Math.max(0, state.playerX - speed);
      if (keys.right) state.playerX = Math.min(W - PLAYER_W, state.playerX + speed);

      // Fire
      if (state.fireCooldown > 0) state.fireCooldown--;
      if (keys.fire && state.fireCooldown <= 0) {
        state.bullets.push({
          x: state.playerX + PLAYER_W / 2 - 2,
          y: H - PLAYER_H - 4,
        });
        state.fireCooldown = 12;
      }

      // Bullets
      state.bullets = state.bullets.filter((b) => {
        b.y += BULLET_SPEED * dt;
        if (b.y < -4) return false;
        return true;
      });

      // Bugs move
      state.bugTick += dt * 0.5;
      if (state.bugTick >= 1) {
        state.bugTick = 0;
        const alive = state.bugs.filter((b) => b.alive);
        let hitEdge = false;
        for (const b of alive) {
          b.x += 6 * state.bugDir;
          if (b.x <= 0 || b.x >= W - BUG_W) hitEdge = true;
        }
        if (hitEdge) {
          state.bugDir *= -1;
          for (const b of alive) b.y += BUG_SPEED_Y;
        }
      }

      // Collision: bullet vs bug
      for (const bullet of state.bullets) {
        for (const bug of state.bugs) {
          if (!bug.alive) continue;
          if (
            bullet.x + 4 > bug.x &&
            bullet.x < bug.x + BUG_W &&
            bullet.y < bug.y + BUG_H &&
            bullet.y + 4 > bug.y
          ) {
            bug.alive = false;
            state.bullets = state.bullets.filter((b) => b !== bullet);
            setScore((s) => {
              scoreLivesRef.current.score = s + 100;
              return s + 100;
            });
            if (Math.random() < 0.35) {
              state.drops.push({
                x: bug.x + BUG_W / 2 - 28,
                y: bug.y,
                word: SKILLS_POOL[Math.floor(Math.random() * SKILLS_POOL.length)],
              });
            }
            break;
          }
        }
      }

      // Drops fall
      for (const d of state.drops) {
        d.y += DROP_SPEED * dt;
      }
      state.drops = state.drops.filter((d) => d.y < H + 20);

      // Collect drops (player)
      const px = state.playerX;
      const py = H - PLAYER_H;
      state.drops = state.drops.filter((d) => {
        if (d.y + 14 > py && d.y < py + PLAYER_H && d.x + 56 > px && d.x < px + PLAYER_W) {
          setScore((s) => {
            scoreLivesRef.current.score = s + 50;
            return s + 50;
          });
          return false;
        }
        return true;
      });

      // Bug reached bottom = lose life
      const reachedBottom = state.bugs.some((b) => b.alive && b.y + BUG_H >= py - 2);
      if (reachedBottom) {
        setLives((l) => {
          const next = l - 1;
          scoreLivesRef.current.lives = next;
          if (next <= 0) {
            gameStateRef.current = "gameover";
            setGameState("gameover");
          }
          return next;
        });
        state.bugs.forEach((b) => (b.alive = false));
      }

      // All bugs dead = next wave
      if (state.bugs.every((b) => !b.alive)) {
        spawnBugs();
        setScore((s) => {
          scoreLivesRef.current.score = s + 200;
          return s + 200;
        });
      }

      // Draw
      const colors = getThemeColors();
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.font = "10px monospace";
      ctx.fillStyle = colors.muted;
      ctx.fillText(`SCORE ${scoreLivesRef.current.score}`, 8, 12);
      ctx.fillText(`LIVES ${scoreLivesRef.current.lives}`, W - 56, 12);

      for (const d of state.drops) {
        const label = d.word.length > 10 ? d.word.slice(0, 9) + "…" : d.word;
        ctx.fillStyle = colors.accent;
        ctx.fillRect(d.x, d.y, 56, 14);
        ctx.fillStyle = colors.bg;
        ctx.font = "8px monospace";
        ctx.fillText(label, d.x + 4, d.y + 10);
      }
      ctx.font = "10px monospace";

      for (const bug of state.bugs) {
        if (!bug.alive) continue;
        ctx.fillStyle = colors.accent;
        ctx.fillRect(bug.x, bug.y, BUG_W, BUG_H);
        ctx.fillStyle = colors.bg;
        ctx.fillRect(bug.x + 4, bug.y + 2, 8, 8);
        ctx.fillRect(bug.x + 2, bug.y + 6, 4, 4);
        ctx.fillRect(bug.x + BUG_W - 6, bug.y + 6, 4, 4);
      }

      for (const b of state.bullets) {
        ctx.fillStyle = colors.fg;
        ctx.fillRect(b.x, b.y, 4, 8);
      }

      ctx.fillStyle = colors.fg;
      ctx.beginPath();
      ctx.moveTo(state.playerX + PLAYER_W / 2, py + PLAYER_H);
      ctx.lineTo(state.playerX, py + PLAYER_H - 12);
      ctx.lineTo(state.playerX + PLAYER_W / 2, py + 4);
      ctx.lineTo(state.playerX + PLAYER_W, py + PLAYER_H - 12);
      ctx.closePath();
      ctx.fill();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, gameState, spawnBugs]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = true;
      if (e.code === "Space") {
        if (gameStateRef.current === "playing") e.preventDefault();
        keysRef.current.fire = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = false;
      if (e.code === "Space") keysRef.current.fire = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Touch handlers for the canvas (swipe to move + tap to fire)
  const touchStartXRef = useRef<number | null>(null);

  function handleCanvasTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
    if (gameStateRef.current !== "playing") return;
    e.preventDefault();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    keysRef.current.fire = true;
  }

  function handleCanvasTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    if (gameStateRef.current !== "playing") return;
    e.preventDefault();
    const touch = e.touches[0];
    if (touchStartXRef.current === null) return;
    const deltaX = touch.clientX - touchStartXRef.current;
    keysRef.current.left = deltaX < -4;
    keysRef.current.right = deltaX > 4;
    touchStartXRef.current = touch.clientX;
  }

  function handleCanvasTouchEnd(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    keysRef.current.left = false;
    keysRef.current.right = false;
    keysRef.current.fire = false;
    touchStartXRef.current = null;
  }

  if (!mounted) return null;

  return (
    <section
      id="minigame"
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-fg-muted/10 bg-surface-elevated/20 overflow-hidden"
    >
      <div className="max-w-5xl 2xl:max-w-6xl">
        {/* Section marker */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-sans text-[11px] tracking-[0.4em] text-accent uppercase">
            {t("minigame.label")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
        </motion.div>

        <motion.div
          className="relative border border-fg-muted/10 bg-surface min-w-0 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Top accent rule */}
          <div className="absolute top-0 left-0 right-0 h-px bg-accent/40" aria-hidden />

          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12 p-7 md:p-9 min-w-0">

            {/* Left: info */}
            <div className="shrink-0 lg:min-w-[220px]">
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light text-fg mb-3 leading-tight">
                {t("minigame.title")}
              </h2>
              <p className="font-sans text-xs text-fg-muted max-w-xs mb-5 leading-[1.85]">
                {t("minigame.subtitle")}
              </p>
              <p className="font-sans text-[11px] tracking-[0.15em] text-fg-muted/60 border-l border-accent/25 pl-3 hidden sm:block">
                {t("minigame.controls")}
              </p>
            </div>

            {/* Right: game */}
            <div className="min-w-0 flex-1 flex flex-col items-start w-full max-w-full">
              <div
                className="relative overflow-hidden border border-fg-muted/12 bg-black w-full max-w-[640px]"
                style={{ aspectRatio: `${W} / ${H}`, imageRendering: "pixelated" }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.05]"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                  }}
                  aria-hidden
                />
                <canvas
                  ref={canvasRef}
                  width={W}
                  height={H}
                  className="block w-full h-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                  onTouchStart={handleCanvasTouchStart}
                  onTouchMove={handleCanvasTouchMove}
                  onTouchEnd={handleCanvasTouchEnd}
                />
              </div>

              {/* Controls bar */}
              <div className="mt-4 w-full max-w-[640px] flex flex-wrap items-center gap-3 py-3 px-4 border border-fg-muted/10 bg-surface-elevated/40">
                {gameState === "idle" && (
                  <button
                    type="button"
                    onClick={startGame}
                    className="font-sans text-[10px] tracking-[0.3em] uppercase px-5 py-2.5 bg-accent text-on-accent hover:bg-accent-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    style={{ minHeight: TOUCH_BTN_MIN_SIZE }}
                  >
                    {t("minigame.start")}
                  </button>
                )}
                {gameState === "playing" && (
                  <span className="font-sans text-xs text-fg-muted">
                    {t("minigame.score")}:{" "}
                    <span className="text-fg">{score}</span>
                  </span>
                )}
                {gameState === "gameover" && (
                  <>
                    <span className="font-sans text-xs text-fg-muted">
                      {t("minigame.gameover")} — {t("minigame.score")}:{" "}
                      <span className="text-fg">{score}</span>
                    </span>
                    <button
                      type="button"
                      onClick={startGame}
                      className="font-sans text-[10px] tracking-[0.3em] uppercase px-4 py-2 border border-accent/40 text-accent hover:bg-accent/8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      style={{ minHeight: TOUCH_BTN_MIN_SIZE }}
                    >
                      {t("minigame.retry")}
                    </button>
                  </>
                )}
              </div>

              {/* On-screen touch controls — visible on touch devices during gameplay */}
              {gameState === "playing" && (
                <div
                  className="mt-3 w-full max-w-[640px] flex items-center justify-between gap-2 sm:hidden"
                  aria-label="Touch controls"
                >
                  <button
                    type="button"
                    aria-label="Move left"
                    className="flex-1 flex items-center justify-center bg-fg-muted/10 border border-fg-muted/15 text-fg font-sans text-lg select-none active:bg-accent/20 transition-colors"
                    style={{ minHeight: TOUCH_BTN_MIN_SIZE }}
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current.left = true; }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current.left = false; }}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Fire"
                    className="flex-1 flex items-center justify-center bg-accent/20 border border-accent/30 text-accent font-sans text-xs tracking-widest uppercase select-none active:bg-accent/40 transition-colors"
                    style={{ minHeight: TOUCH_BTN_MIN_SIZE }}
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current.fire = true; }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current.fire = false; }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Move right"
                    className="flex-1 flex items-center justify-center bg-fg-muted/10 border border-fg-muted/15 text-fg font-sans text-lg select-none active:bg-accent/20 transition-colors"
                    style={{ minHeight: TOUCH_BTN_MIN_SIZE }}
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current.right = true; }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current.right = false; }}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
