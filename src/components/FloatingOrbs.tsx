"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 120, x: "10%", y: "20%", delay: 0, duration: 8 },
  { size: 80, x: "85%", y: "60%", delay: 2, duration: 10 },
  { size: 60, x: "70%", y: "15%", delay: 1, duration: 7 },
  { size: 100, x: "20%", y: "75%", delay: 3, duration: 9 },
  { size: 50, x: "90%", y: "85%", delay: 0.5, duration: 6 },
];

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-accent/5 dark:bg-accent/10"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            filter: "blur(40px)",
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
