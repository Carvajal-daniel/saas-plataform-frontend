"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

const baseTransition = {
  duration: 0.55,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

export const container: Variants = {
  hidden: {},

  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.08,
    },
  },
};

export const iconPop: Variants = {
  hidden: {
    scale: 0.85,
    opacity: 0,
  },

  show: {
    scale: 1,
    opacity: 1,
    transition: baseTransition,
  },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  style?: CSSProperties;
  id?: string;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  style,
  id,
}: RevealProps) {
  return (
    <motion.div
      id={id}
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={{
        ...baseTransition,
        delay,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}