"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./concepts.module.css";

const scenes = [
  {
    id: "blue",
    name: "Blue",
    fullName: "Blue Room",
    image: "room-blue-editorial.webp",
    eyebrow: "Vocals · Production · Writing"
  },
  {
    id: "red",
    name: "Red",
    fullName: "Red Room",
    image: "room-red-editorial.webp",
    eyebrow: "Recording · Listening · Direction"
  },
  {
    id: "infinity",
    name: "Infinity",
    fullName: "Infinity Room",
    image: "room-infinity-editorial.webp",
    eyebrow: "Visuals · Performance · Content"
  }
] as const;

export function NocturneHeroExperience({ basePath }: { basePath: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualSelection, setManualSelection] = useState(false);
  const [inView, setInView] = useState(true);
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
    if (
      manualSelection
      || !inView
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % scenes.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [inView, manualSelection]);

  function selectScene(index: number) {
    setManualSelection(true);
    setActiveIndex(index);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const start = touchStartRef.current;
    if (start === null) return;
    const distance = event.changedTouches[0].clientX - start;
    touchStartRef.current = null;
    if (Math.abs(distance) < 45) return;
    const direction = distance < 0 ? 1 : -1;
    selectScene((activeIndex + direction + scenes.length) % scenes.length);
  }

  return (
    <section
      className={styles.nocturneHero}
      data-concept-hero
      data-nocturne-pointer-stage
      ref={sectionRef}
      onTouchStart={(event) => { touchStartRef.current = event.touches[0].clientX; }}
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
        <nav aria-label="Nocturne navigatie">
          <a href="#nocturne-rooms">Rooms</a>
          <a href="#nocturne-services">Services</a>
          <a href="#nocturne-process">Werkwijze</a>
          <a href="#nocturne-visit">Visit</a>
        </nav>
        <button type="button" data-booking={activeScene.id} data-nocturne-magnetic>
          Plan <span>↗</span>
        </button>
      </header>

      <div className={styles.nocturneSceneNav} aria-label="Kies een hero-scène">
        {scenes.map((scene, index) => (
          <button
            type="button"
            className={index === activeIndex ? styles.nocturneSceneActive : ""}
            aria-pressed={index === activeIndex}
            onClick={() => selectScene(index)}
            key={scene.id}
          >
            <span>0{index + 1}</span>
            <strong>{scene.name}</strong>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={styles.nocturneCopy}>
        <p key={`${activeScene.id}-eyebrow`}>{activeScene.eyebrow} · Antwerpen</p>
        <h1><span>Maak iets dat</span><em>blijft hangen.</em></h1>
        <span className={styles.nocturneIntro}>Recording, productie en visuals in drie private rooms.</span>
        <button
          className={styles.nocturnePrimary}
          type="button"
          data-booking={activeScene.id}
          data-nocturne-magnetic
        >
          Plan in {activeScene.fullName} <span>↗</span>
        </button>
        <a href="#nocturne-rooms">Vergelijk de rooms <span>↓</span></a>
        <small>Aanvraag in ±2 minuten · persoonlijke bevestiging</small>
      </div>

      <div className={styles.nocturneScrollCue} aria-hidden="true">
        <span>Scroll to explore</span><i />
      </div>
    </section>
  );
}
