"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.05,
      syncTouch: false,
    });

    const update = (time: number) => lenis.raf(time * 1000);
    const onAnchorClick = (event: MouseEvent) => {
      const origin = event.target;
      if (!(origin instanceof Element)) return;

      const link = origin.closest<HTMLAnchorElement>("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#" || link.target === "_blank") return;

      const destination = document.querySelector<HTMLElement>(hash);
      if (!destination) return;

      event.preventDefault();
      lenis.scrollTo(destination, { offset: -24 });
      window.history.replaceState(null, "", hash);
    };
    const onVisibilityChange = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };

    lenis.on("scroll", ScrollTrigger.update);
    document.addEventListener("click", onAnchorClick);
    document.addEventListener("visibilitychange", onVisibilityChange);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(1000, 16);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
