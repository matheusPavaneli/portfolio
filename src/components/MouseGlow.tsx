"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SIZE = 400;
const OPACITY = 0.15;

export function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div
        className="absolute rounded-full bg-accent transition-opacity duration-300 dark:opacity-[0.12] opacity-[0.08]"
        style={{
          width: SIZE,
          height: SIZE,
          left: pos.x - SIZE / 2,
          top: pos.y - SIZE / 2,
          filter: "blur(80px)",
        }}
        aria-hidden
      />
    </motion.div>
  );
}
