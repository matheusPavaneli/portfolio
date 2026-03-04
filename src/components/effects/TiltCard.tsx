"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const PERSPECTIVE = 1200;
const MAX_TILT = 8;
const SPRING = { stiffness: 300, damping: 25 };

type Props = {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
};

/**
 * Card com tilt 3D suave baseado na posição do mouse — sensação de profundidade rara na web.
 */
export function TiltCard({
  children,
  className = "",
  intensity = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, SPRING);
  const ySpring = useSpring(y, SPRING);

  const rotateX = useTransform(
    ySpring,
    [-0.5, 0.5],
    [MAX_TILT * intensity, -MAX_TILT * intensity]
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    [-MAX_TILT * intensity, MAX_TILT * intensity]
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);
    x.set(normX);
    y.set(normY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: PERSPECTIVE,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: SPRING.stiffness, damping: SPRING.damping }}
    >
      {children}
    </motion.div>
  );
}
