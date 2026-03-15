"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SIZE = 480;

export function MouseGlow() {
  const [mounted, setMounted] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handler = (e: MouseEvent) => {
      const el = glowRef.current;
      if (!el) return;
      el.style.left = `${e.clientX - SIZE / 2}px`;
      el.style.top  = `${e.clientY - SIZE / 2}px`;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 hidden md:block overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div
        ref={glowRef}
        className="absolute rounded-full bg-accent dark:opacity-[0.07] opacity-[0.05] transition-opacity duration-300"
        style={{
          width: SIZE,
          height: SIZE,
          filter: "blur(100px)",
          willChange: "left, top",
        }}
        aria-hidden
      />
    </motion.div>
  );
}
