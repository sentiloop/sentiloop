"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ParallaxTiltProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  gyroscope?: boolean;
  glare?: boolean;
}

export function ParallaxTilt({
  children,
  className,
  intensity = 12,
  gyroscope = false,
  glare = false,
}: ParallaxTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return;

    let tiltX = 0;
    let tiltY = 0;
    let isHovering = false;

    function updateTransform(rx: number, ry: number) {
      el!.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;

      if (glare && glareRef.current) {
        const glareX = 50 + ry * 2;
        const glareY = 50 - rx * 2;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15), transparent 60%)`;
        glareRef.current.style.opacity = "1";
      }
    }

    function resetTransform() {
      el!.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      if (glare && glareRef.current) {
        glareRef.current.style.opacity = "0";
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!isHovering) return;
      const rect = el!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      tiltX = (0.5 - y) * intensity;
      tiltY = (x - 0.5) * intensity;
      updateTransform(tiltX, tiltY);
    }

    function onMouseEnter() {
      isHovering = true;
      el!.style.transition = "transform 0.1s ease-out";
    }

    function onMouseLeave() {
      isHovering = false;
      el!.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      resetTransform();
    }

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);

    // Gyroscope support
    let gyroCleanup: (() => void) | undefined;

    if (gyroscope && "DeviceOrientationEvent" in window) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (isHovering) return; // desktop mouse takes priority
        const beta = e.beta ?? 0; // -180 to 180 (front/back)
        const gamma = e.gamma ?? 0; // -90 to 90 (left/right)

        tiltX = Math.max(-intensity, Math.min(intensity, (beta - 45) * 0.3));
        tiltY = Math.max(-intensity, Math.min(intensity, gamma * 0.3));
        updateTransform(tiltX, tiltY);
      };

      const requestPermission = async () => {
        // iOS 13+ requires permission
        const DOE = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        };
        if (typeof DOE.requestPermission === "function") {
          try {
            const permission = await DOE.requestPermission();
            if (permission === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          } catch {
            // Permission denied, gracefully ignore
          }
        } else {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      };

      requestPermission();

      gyroCleanup = () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      gyroCleanup?.();
    };
  }, [reduced, intensity, gyroscope, glare]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
