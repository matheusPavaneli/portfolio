"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { profile } from "@/data/profile";

const W = 320;
const H = 200;
const SCALE = 2;
const PLAYER_W = 24;
const PLAYER_H = 16;
const BUG_W = 16;
const BUG_H = 12;
const BULLET_SPEED = -8;
const BUG_SPEED_Y = 4;
const DROP_SPEED = 2;

const SKILLS_POOL: string[] = [
  ...profile.skills.frontend,
  ...profile.skills.backend,
  ...profile.skills.databases.slice(0, 4),
  ...profile.skills.devops.slice(0, 4),
].slice(0, 24);

function getThemeColors() {
  if (typeof document === "undefined")
    return { bg: "#0a0a0a", fg: "#fafaf9", accent: "#00ff88", muted: "#444" };
  const s = getComputedStyle(document.documentElement);
  return {
    bg: s.getPropertyValue("--surface").trim() || "#0a0a0a",
    fg: s.getPropertyValue("--fg").trim() || "#fafaf9",
    accent: s.getPropertyValue("--color-accent").trim() || "#00ff88",
    muted: s.getPropertyValue("--fg-muted").trim() || "#666",
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
  const keysRef = useRef<{ left: boolean; right: boolean; fire: boolean }>({
    left: false,
    right: false,
    fire: false,
  });
  const scoreLivesRef = useRef({ score: 0, lives: 3 });

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

  useEffect(() => {
    if (!mounted || gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = () => {
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
          if (next <= 0) setGameState("gameover");
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
        e.preventDefault();
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

  if (!mounted) return null;

  return (
    <section
      id="minigame"
      className="relative py-20 xs:py-24 sm:py-28 md:py-40 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 border-t border-fg-muted/10 bg-surface-elevated/30 pattern-grid-opacity overflow-hidden"
    >
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto pl-0 md:pl-[clamp(3.5rem,14vw,9rem)] min-w-0">
        <motion.div
          className="relative rounded-2xl border border-fg-muted/10 bg-surface p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)] min-w-0 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-accent/40" aria-hidden />
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10 min-w-0">
            <div className="shrink-0 lg:min-w-[200px]">
              <div className="w-8 h-px bg-accent mb-4" aria-hidden />
              <p className="font-mono text-xs text-accent uppercase tracking-wider mb-2">
                {t("minigame.label")}
              </p>
              <h2 className="font-display text-2xl xs:text-3xl font-bold text-fg mb-3">
                {t("minigame.title")}
              </h2>
              <p className="text-fg-muted text-sm max-w-md mb-4 leading-relaxed">
                {t("minigame.subtitle")}
              </p>
              <p className="text-fg-muted/90 text-xs font-mono border-l-2 border-accent/30 pl-3">
                {t("minigame.controls")}
              </p>
            </div>
            <div className="min-w-0 flex-1 flex flex-col items-start w-full max-w-full">
              <div
                className="relative rounded-xl overflow-hidden border border-fg-muted/15 bg-black w-full max-w-[640px] shadow-inner ring-1 ring-fg-muted/10"
                style={{
                  aspectRatio: `${W} / ${H}`,
                  imageRendering: "pixelated",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.06]"
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
                />
              </div>
              <div className="mt-4 w-full min-w-0 flex flex-wrap items-center gap-3 py-3 px-4 rounded-lg bg-surface-elevated/50 border border-fg-muted/10">
                {gameState === "idle" && (
                  <button
                    type="button"
                    onClick={startGame}
                    className="text-sm font-mono px-5 py-2.5 rounded-lg bg-accent text-on-accent hover:bg-accent-dim transition-colors"
                  >
                    {t("minigame.start")}
                  </button>
                )}
                {gameState === "playing" && (
                  <span className="text-sm font-mono text-fg-muted">
                    {t("minigame.score")}: <span className="text-fg font-medium">{score}</span>
                  </span>
                )}
                {gameState === "gameover" && (
                  <>
                    <span className="text-sm font-mono text-fg-muted">
                      {t("minigame.gameover")} — {t("minigame.score")}: <span className="text-fg font-medium">{score}</span>
                    </span>
                    <button
                      type="button"
                      onClick={startGame}
                      className="text-sm font-mono px-4 py-2 rounded-lg border border-accent/50 text-accent hover:bg-accent/10 transition-colors"
                    >
                      {t("minigame.retry")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
