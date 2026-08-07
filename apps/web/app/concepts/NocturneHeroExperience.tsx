"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./concepts.module.css";

const scenes = [
  {
    id: "blue",
    name: "Blue",
    fullName: "Blue District",
    image: "room-blue-editorial.webp",
    eyebrow: "Recording · Production · Engineering"
  },
  {
    id: "red",
    name: "Red",
    fullName: "Red District",
    image: "room-red-editorial.webp",
    eyebrow: "Recording · Production · Engineering"
  },
  {
    id: "infinity",
    name: "White",
    fullName: "White District",
    image: "room-infinity-editorial.webp",
    eyebrow: "Visuals · Shoots · Content"
  }
] as const;

export function NocturneHeroExperience({ basePath }: { basePath: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualSelection, setManualSelection] = useState(false);
  const [inView, setInView] = useState(true);
  const [hasStartedScrolling, setHasStartedScrolling] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeScene = scenes[activeIndex];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function updateScrollState() {
      const next = window.scrollY > 24;
      setHasStartedScrolling((current) => current === next ? current : next);
    }

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function updateMotionPreference() {
      setPrefersReducedMotion(preference.matches);
    }

    updateMotionPreference();
    preference.addEventListener("change", updateMotionPreference);
    return () => preference.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (
      manualSelection
      || !inView
      || hasStartedScrolling
      || prefersReducedMotion
    ) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % scenes.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [hasStartedScrolling, inView, manualSelection, prefersReducedMotion]);

  function selectScene(index: number) {
    setManualSelection(true);
    setActiveIndex(index);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const start = touchStartRef.current;
    if (start === null) return;
    const distanceX = event.changedTouches[0].clientX - start.x;
    const distanceY = event.changedTouches[0].clientY - start.y;
    touchStartRef.current = null;
    if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY) * 1.2) return;
    const direction = distanceX < 0 ? 1 : -1;
    selectScene((activeIndex + direction + scenes.length) % scenes.length);
  }

  return (
    <section
      className={styles.nocturneHero}
      id="nocturne-home"
      data-concept-hero
      data-nocturne-pointer-stage
      data-nocturne-scene={activeScene.id}
      ref={sectionRef}
      onTouchStart={(event) => {
        touchStartRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.nocturneMedia} aria-hidden="true">
        {scenes.map((scene, index) => (
          <Image
            className={`${styles.nocturneFrame} ${index === activeIndex ? styles.nocturneFrameActive : ""}`}
            src={`${basePath}/${scene.image}`}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            key={scene.id}
          />
        ))}
      </div>
      <div className={styles.nocturneShade} />
      <div className={styles.nocturneLightLeak} aria-hidden="true" />
      <div className={styles.nocturneGrain} aria-hidden="true" />

      <header className={styles.nocturneHeader}>
        <span className={styles.wordmark}>Sound District</span>
        <nav aria-label="Nocturne navigation">
          <a href="#nocturne-rooms">Choose a district</a>
          <a href="#nocturne-beyond">Beyond</a>
        </nav>
        <button type="button" data-booking={activeScene.id} data-nocturne-magnetic>
          Book a space <span>↗</span>
        </button>
      </header>

      <div className={styles.nocturneSceneNav} aria-label="Choose a district">
        {scenes.map((scene, index) => (
          <button
            type="button"
            className={index === activeIndex ? styles.nocturneSceneActive : ""}
            aria-pressed={index === activeIndex}
            onClick={() => selectScene(index)}
            key={scene.id}
          >
            <span>0{index + 1}</span>
            <strong><span>{scene.name}</span><small>District</small></strong>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={styles.nocturneCopy}>
        <p>{activeScene.eyebrow}</p>
        <h1><span>Build around what</span><em>You make</em></h1>
        <button
          className={styles.nocturnePrimary}
          type="button"
          data-booking={activeScene.id}
          data-nocturne-magnetic
          aria-label={`Book ${activeScene.fullName}`}
        >
          Book your district <span>↗</span>
        </button>
        <a href="#nocturne-rooms">Compare districts <span>↓</span></a>
        <small>Open 24/7 · Request in ±2 minutes · Personal confirmation</small>
      </div>

      <div className={styles.nocturneScrollCue} aria-hidden="true">
        <span>Scroll to explore</span><i />
      </div>
      <div className={styles.nocturnePortal} data-nocturne-portal aria-hidden="true">
        <i /><i /><i />
      </div>
    </section>
  );
}
