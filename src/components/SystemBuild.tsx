"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  EDGES,
  FINAL,
  NODES,
  REQUIREMENTS,
  VIEWBOX,
  pathD,
  stateOf,
  tapState,
  type ElementState,
  type Layout,
  type NodeId,
} from "@/lib/architecture";
import type { Messages } from "@/i18n";

const STEP_MS = 2800;
const LEAD_MS = 500;

type Labelled = Exclude<NodeId, "apiB" | "apiC">;

function settle(state: ElementState): ElementState {
  if (state === "added") return "visible";
  if (state === "removed") return "hidden";
  return state;
}

function Diagram({
  layout,
  step,
  live,
  t,
}: {
  layout: Layout;
  step: number;
  live: boolean;
  t: Messages;
}) {
  const view = VIEWBOX[layout];
  const labels: Record<Labelled, string> = t.build.nodes;
  const shown = (state: ElementState) => (live ? state : settle(state));
  const arrow = `build-arrow-${layout}`;

  return (
    <svg
      viewBox={`0 0 ${view.w} ${view.h}`}
      className={`build-svg build-${layout}`}
      aria-hidden
      focusable="false"
    >
      <defs>
        <marker
          id={arrow}
          viewBox="0 0 8 8"
          refX="8"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="context-stroke" />
        </marker>
      </defs>

      {EDGES.map((edge) => (
        <path
          key={edge.id}
          d={pathD(edge.path[layout])}
          pathLength={edge.async ? undefined : 1}
          markerEnd={`url(#${arrow})`}
          className="build-edge"
          data-async={edge.async ? "" : undefined}
          data-state={shown(stateOf(edge, step))}
        />
      ))}

      {[...NODES].sort((a, b) => Number(Boolean(b.stacked)) - Number(Boolean(a.stacked))).map((node) => {
        const b = node.at[layout];
        return (
          <g key={node.id} className="build-node" data-state={shown(stateOf(node, step))}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6} />
            {node.id === "apiB" || node.id === "apiC" ? null : (
              <text x={b.x + b.w / 2} y={b.y + b.h / 2} textAnchor="middle" dominantBaseline="central">
                {labels[node.id]}
              </text>
            )}
            {node.stacked || node.id === "telemetry" ? null : (
              <circle
                className="build-tap"
                cx={b.x + b.w - 7}
                cy={b.y + 7}
                r={3}
                data-state={shown(tapState(node, step))}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Requirement({ t, index }: { t: Messages; index: number }) {
  const id = REQUIREMENTS[index];
  if (!id) return null;
  const copy = t.build.steps[id];
  return (
    <>
      <p className="label m-0 tabular-nums text-text-muted">
        {index + 1} {t.build.of} {FINAL}
      </p>
      <h3 className="m-0 mt-2 text-h2">{copy.need}</h3>
      <dl className="m-0 mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="label pt-1 text-text-muted">{t.build.adds}</dt>
        <dd className="m-0 text-body">{copy.adds}</dd>
        <dt className="label pt-1 text-text-muted">{t.build.costs}</dt>
        <dd className="build-cost m-0 text-body">{copy.costs}</dd>
      </dl>
    </>
  );
}

type Run = "idle" | "playing" | "paused";

export function SystemBuild({ t }: { t: Messages }) {
  const [live, setLive] = useState(false);
  const [step, setStep] = useState<number>(FINAL);
  const [run, setRun] = useState<Run>("idle");
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const feedRef = useRef<HTMLOListElement>(null);
  const shownRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (reduced.matches) {
        setLive(false);
        setStep(FINAL);
        setRun("idle");
        return;
      }
      setLive(true);
      setStep(1);
      setRun("idle");
    };
    apply();
    reduced.addEventListener("change", apply);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const seen = Boolean(entry?.isIntersecting);
        setInView(seen);
        if (seen) setRun((current) => (current === "idle" ? "playing" : current));
      },
      { threshold: 0.35 },
    );
    observer.observe(section);

    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      reduced.removeEventListener("change", apply);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!live || run !== "playing" || !inView || !tabVisible || step >= FINAL) return;
    const timer = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? LEAD_MS : STEP_MS);
    return () => window.clearTimeout(timer);
  }, [live, run, inView, tabVisible, step]);

  useLayoutEffect(() => {
    const feed = feedRef.current;
    const previous = shownRef.current;
    shownRef.current = step;
    if (!feed || !live || step <= previous) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const last = feed.lastElementChild as HTMLElement | null;
    if (!last) return;
    const gap = Number.parseFloat(getComputedStyle(feed).rowGap) || 0;
    feed.animate(
      [{ transform: `translateY(${last.offsetHeight + gap}px)` }, { transform: "translateY(0)" }],
      { duration: 360, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
    );
    last.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: "ease-out" });
  }, [step, live]);

  const done = live && step >= FINAL;

  const toggle = useCallback(() => {
    if (done) {
      setStep(0);
      setRun("playing");
    } else setRun(run === "paused" ? "playing" : "paused");
  }, [done, run]);

  const control = done ? t.build.replay : run === "paused" ? t.build.play : t.build.pause;

  return (
    <section
      ref={sectionRef}
      id="build"
      className="build px-4 py-16 md:px-8 md:py-24"
      data-live={live ? "" : undefined}
    >
      <div className="mx-auto max-w-shell">
        <div className="flex min-h-11 items-center justify-between gap-6 border-b border-line pb-3">
          <p className="label m-0 text-text-muted">{t.build.eyebrow}</p>
          {live ? (
            <div className="flex shrink-0 items-center gap-4">
              <p className="label m-0 tabular-nums text-text-muted" aria-hidden>
                {step} {t.build.of} {FINAL}
              </p>
              <button
                type="button"
                onClick={toggle}
                className="control label inline-flex h-11 items-center rounded-sm px-4 text-text-muted"
              >
                {control}
              </button>
            </div>
          ) : null}
        </div>

        <h2 className="measure-tight m-0 mt-8 text-h1 text-text">{t.build.title}</h2>
        <p className="measure m-0 mt-4 text-body-lg text-text-muted">{t.build.lede}</p>

        <div className="build-body mt-12">
          <figure className="build-stage m-0 rounded-md border border-line bg-surface">
            <Diagram layout="wide" step={step} live={live} t={t} />
            <Diagram layout="tall" step={step} live={live} t={t} />
            <figcaption className="sr-only">{t.build.figureLabel}</figcaption>
          </figure>

          <ol className={`build-steps m-0 list-none p-0 ${live ? "sr-only" : ""}`}>
            {REQUIREMENTS.map((id, index) => (
              <li key={id} className="build-step">
                <Requirement t={t} index={index} />
              </li>
            ))}
          </ol>

          {live ? (
            <div className="build-feed-window" aria-hidden>
              <ol ref={feedRef} className="build-feed m-0 list-none p-0">
                {REQUIREMENTS.slice(0, step).map((id, index) => (
                  <li key={id} className="build-step" data-current={index + 1 === step ? "" : undefined}>
                    <Requirement t={t} index={index} />
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
