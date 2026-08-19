"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { createElement } from "react";

export type SoundType = "hover" | "click" | "success" | "error" | "transition";

/**
 * Play a sound effect. Currently a no-op stub for future audio integration.
 */
export function playSound(type: SoundType): void {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Sound] ${type}`);
  }
}

interface SoundContextValue {
  play: (type: SoundType) => void;
  enabled: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  play: playSound,
  enabled: false,
  toggle: () => {},
});

/**
 * Provides sound context to the app. Currently architecture-only.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  const play = useCallback(
    (type: SoundType) => {
      if (enabled) {
        playSound(type);
      }
    },
    [enabled]
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  return createElement(
    SoundContext.Provider,
    { value: { play, enabled, toggle } },
    children
  );
}

/**
 * Hook to access sound utilities within SoundProvider.
 */
export function useSounds(): SoundContextValue {
  return useContext(SoundContext);
}
