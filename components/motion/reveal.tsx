"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type RevealPreset = "fade" | "scale" | "tilt" | "visual";

const revealVariants: Record<RevealPreset, Variants> = {
  fade: {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  scale: {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  tilt: {
    hidden: { opacity: 0, y: 32, rotate: 1.25, scale: 0.975 },
    visible: { opacity: 1, y: 0, rotate: 0, scale: 1 },
  },
  visual: {
    hidden: { opacity: 0, scale: 1.045, clipPath: "inset(8% 6% 8% 6% round 20px)" },
    visible: { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.2,
  preset = "fade",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  preset?: RevealPreset;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={revealVariants[preset]}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ duration: preset === "visual" ? 1.05 : 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function MaskReveal({
  children,
  className,
  innerClassName,
  delay = 0,
  amount = 0.4,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  amount?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className={innerClassName}
        initial={reducedMotion ? false : { y: "105%", rotate: 1.5, opacity: 0 }}
        whileInView={{ y: 0, rotate: 0, opacity: 1 }}
        viewport={{ once: true, amount }}
        transition={{ duration: 0.95, delay, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function VisualReveal({
  children,
  className,
  delay = 0,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  return (
    <Reveal className={className} delay={delay} amount={amount} preset="visual">
      {children}
    </Reveal>
  );
}

export function Stagger({
  children,
  className,
  amount = 0.12,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  stagger?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reducedMotion ? 0 : stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  preset = "fade",
}: {
  children: ReactNode;
  className?: string;
  preset?: RevealPreset;
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants[preset]}
      transition={{ duration: preset === "visual" ? 0.95 : 0.78, ease }}
    >
      {children}
    </motion.div>
  );
}
