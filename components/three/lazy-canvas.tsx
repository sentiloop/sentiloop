"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * LazyCanvas — Only mounts the Three.js Canvas when the container
 * enters the viewport (with margin). Unmounts when far offscreen.
 * This prevents multiple heavy WebGL contexts from running simultaneously.
 */
export function LazyCanvas({
  children,
  className,
  rootMargin = "200px 0px",
  fallbackClass = "",
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  fallbackClass?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? children : <div className={`absolute inset-0 ${fallbackClass}`} />}
    </div>
  );
}
