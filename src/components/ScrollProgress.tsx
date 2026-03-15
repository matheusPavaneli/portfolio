"use client";

import { useScroll, useSpring, useTransform, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-accent z-[60] origin-left pointer-events-none"
      style={{ scaleX, opacity }}
      aria-hidden
    />
  );
}
