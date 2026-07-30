"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

export function ScrollChoreography() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const parallaxElements = gsap.utils.toArray<HTMLElement>("[data-parallax]");
        const progressLines = gsap.utils.toArray<HTMLElement>("[data-gsap-line]");

        parallaxElements.forEach((element) => {
          const distance = Number(element.dataset.parallax ?? 8);
          const trigger = element.closest("section") ?? element;

          gsap.fromTo(
            element,
            { yPercent: -distance },
            {
              yPercent: distance,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.15,
              },
            },
          );
        });

        progressLines.forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: line.closest("section") ?? line,
                start: "top 72%",
                end: "top 38%",
                scrub: 0.8,
              },
            },
          );
        });
      });
    });

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return null;
}
