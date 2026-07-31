"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import styles from "@/components/login/login-experience.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

interface AuthPanelProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Shared glassmorphism panel for all auth pages.
 * Reuses the cinematic login-experience.module.css styling system.
 */
export function AuthPanel({ icon, eyebrow, title, description, children, footer }: AuthPanelProps) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className={styles.panelWrap}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.92, filter: "blur(14px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
      transition={{ duration: reducedMotion ? 0.1 : 0.85, ease }}
    >
      <div className={styles.panelGlow} aria-hidden="true" />
      <div className={styles.panel}>
        <div className={styles.panelChrome} aria-hidden="true">
          <span />
          <span>SL-01 / SECURE GATE</span>
          <span />
        </div>
        <div className={styles.panelBody}>
          <div className={styles.iconWell}>{icon}</div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id="auth-title">{title}</h1>
          <p className={styles.description}>{description}</p>
          {children}
          {footer && <div className={styles.trustRow}>{footer}</div>}
        </div>
      </div>
    </motion.div>
  );
}
