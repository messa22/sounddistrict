"use client";

import { useEffect } from "react";

export function ConceptStickyController() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-concept-hero]");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => document.body.classList.toggle("past-hero", !entry.isIntersecting),
      { threshold: 0.08 }
    );

    observer.observe(hero);
    return () => {
      observer.disconnect();
      document.body.classList.remove("past-hero");
    };
  }, []);

  return null;
}
