"use client";

import { useEffect } from "react";

export function MotionEnhancer() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    root.classList.add("motion-ready");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const heroObserver = hero
      ? new IntersectionObserver(
          ([entry]) => document.body.classList.toggle("past-hero", !entry.isIntersecting),
          { threshold: 0.05 }
        )
      : null;

    if (hero && heroObserver) heroObserver.observe(hero);

    return () => {
      root.classList.remove("motion-ready");
      document.body.classList.remove("past-hero");
      revealObserver.disconnect();
      heroObserver?.disconnect();
    };
  }, []);

  return null;
}
