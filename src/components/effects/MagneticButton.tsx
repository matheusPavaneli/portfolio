"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const STIFFNESS = 200;
const DAMPING = 20;
const MAX_OFFSET = 12;

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
    as?: "a" | "button";
    href?: string;
  };

/**
 * Botão/link que segue suavemente o cursor (efeito magnético) — raro e refinado.
 * Só aplica em viewports com hover (evita jank em touch).
 */
export function MagneticButton({
  children,
  className = "",
  as: Component = "a",
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: STIFFNESS, damping: DAMPING };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-MAX_OFFSET, MAX_OFFSET], [3, -3]);
  const rotateY = useTransform(xSpring, [-MAX_OFFSET, MAX_OFFSET], [-3, 3]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, deltaX)));
    y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, deltaY)));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="inline-block"
      style={{
        x: xSpring,
        y: ySpring,
        rotateX,
        rotateY,
        transformPerspective: 600,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        className={`cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
        {...rest}
      >
        {children}
      </Component>
    </motion.div>
  );
}
