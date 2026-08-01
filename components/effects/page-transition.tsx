"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/**
 * Immersive page transition wrapper.
 * Creates a cinematic wipe/morph effect between routes.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.98, filter: "blur(8px) brightness(1.3)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }}
        exit={{ opacity: 0, scale: 1.02, filter: "blur(6px) brightness(0.8)" }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen"
      >
        {/* Neon wipe overlay on enter */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100]"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          style={{
            transformOrigin: "top",
            background: "linear-gradient(180deg, #020510 0%, rgba(98, 217, 255, 0.15) 50%, #020510 100%)",
          }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
