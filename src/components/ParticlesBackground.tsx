"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import type { ISourceOptions } from "@tsparticles/engine";

const Particles = dynamic(
  () => import("@tsparticles/react").then((mod) => mod.Particles),
  { ssr: false }
);

const ACCENT_LIGHT = "#059669";
const ACCENT_DARK = "#00ff88";

export function ParticlesBackground() {
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const accentColor = resolvedTheme === "dark" ? ACCENT_DARK : ACCENT_LIGHT;

  useEffect(() => {
    let cancelled = false;
    import("@tsparticles/react").then(({ initParticlesEngine }) => {
      import("@tsparticles/slim").then(({ loadSlim }) => {
        initParticlesEngine(async (engine) => {
          await loadSlim(engine);
        }).then(() => {
          if (!cancelled) setReady(true);
        });
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const options: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
      },
      modes: {
        grab: {
          distance: 140,
          links: { opacity: 0.4 },
        },
      },
    },
    particles: {
      color: { value: accentColor },
      links: {
        color: accentColor,
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
      number: {
        density: {
          enable: true,
          width: 1200,
          height: 800,
        },
        value: 60,
      },
      opacity: { value: { min: 0.1, max: 0.4 } },
      shape: { type: "circle" },
      size: { value: { min: 0.5, max: 2 } },
    },
    detectRetina: true,
  };

  if (!ready) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Particles
        key={resolvedTheme ?? "light"}
        id="tsparticles-hero"
        options={options}
        className="absolute inset-0"
      />
    </div>
  );
}
