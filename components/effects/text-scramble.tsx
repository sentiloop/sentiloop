"use client";

import { useEffect, useRef, useState, createElement } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#";

interface TextScrambleProps {
  text: string;
  className?: string;
  tag?: "h2" | "h3" | "p" | "span";
  delay?: number;
}

export function TextScramble({
  text,
  className,
  tag = "span",
  delay = 0,
}: TextScrambleProps) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const [triggered, setTriggered] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    if (reducedRef.current) {
      setDisplay(text);
      return;
    }

    let animId = 0;
    let frame = 0;
    const totalChars = text.length;
    const duration = Math.max(totalChars * 30, 800);
    const framesTotal = Math.ceil(duration / 16);

    const timeoutId = window.setTimeout(() => {
      function animate() {
        frame++;
        const progress = frame / framesTotal;

        let result = "";
        for (let i = 0; i < totalChars; i++) {
          const charProgress = i / totalChars;
          if (progress > charProgress + 0.3) {
            result += text[i];
          } else if (progress > charProgress - 0.1) {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        setDisplay(result);

        if (frame < framesTotal) {
          animId = requestAnimationFrame(animate);
        } else {
          setDisplay(text);
        }
      }

      animId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(animId);
    };
  }, [triggered, text, delay]);

  return createElement(
    tag,
    { ref, className, "aria-label": text },
    display
  );
}
