"use client";

import { useEffect, useRef } from "react";
import styles from "./concepts.module.css";

export function NocturneMotion() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);
  const scrollProgressRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-nocturne-root]");
    if (!root) return;
    const motionRoot = root;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionPreference.matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const revealItems = Array.from(motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-reveal]"));
    const parallaxItems = Array.from(motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-parallax]"));
    const parallaxActive = new Set<HTMLElement>();
    const finalScene = motionRoot.querySelector<HTMLElement>("[data-nocturne-final]");
    const hero = motionRoot.querySelector<HTMLElement>("[data-concept-hero]");
    const heroMedia = hero?.querySelector<HTMLElement>(`.${styles.nocturneMedia}`) ?? null;
    const heroCopy = hero?.querySelector<HTMLElement>(`.${styles.nocturneCopy}`) ?? null;
    const heroHeader = hero?.querySelector<HTMLElement>(`.${styles.nocturneHeader}`) ?? null;
    const heroSceneNav = hero?.querySelector<HTMLElement>(`.${styles.nocturneSceneNav}`) ?? null;
    const heroScrollCue = hero?.querySelector<HTMLElement>(`.${styles.nocturneScrollCue}`) ?? null;
    const roomRail = motionRoot.querySelector<HTMLElement>(`[class*="${styles.nocturneRail}"]`);
    const roomCards = roomRail ? Array.from(roomRail.querySelectorAll<HTMLElement>("article")) : [];
    const roomCurrent = motionRoot.querySelector<HTMLElement>("[data-nocturne-room-current]");
    const roomPrevious = motionRoot.querySelector<HTMLButtonElement>("[data-nocturne-room-previous]");
    const roomNext = motionRoot.querySelector<HTMLButtonElement>("[data-nocturne-room-next]");
    let frame = 0;
    let roomFrame = 0;
    let activeRoomIndex = 0;
    let activeMagnetic: HTMLElement | null = null;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.nocturneVisible = "true";
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
    );

    const parallaxObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            parallaxActive.add(item);
            item.dataset.nocturneParallaxActive = "true";
          } else {
            parallaxActive.delete(item);
            delete item.dataset.nocturneParallaxActive;
          }
        });
        requestScrollMotion();
      },
      { rootMargin: "140px 0px", threshold: 0 }
    );

    function resetHeroMotion() {
      if (heroMedia) {
        heroMedia.style.removeProperty("--nocturne-hero-media-y");
        heroMedia.style.removeProperty("--nocturne-hero-media-scale");
      }
      if (heroCopy) {
        heroCopy.style.transform = "";
        heroCopy.style.opacity = "";
      }
      if (heroHeader) heroHeader.style.opacity = "";
      if (heroSceneNav) heroSceneNav.style.opacity = "";
      if (heroScrollCue) heroScrollCue.style.opacity = "";
    }

    function enableMotion() {
      motionRoot.dataset.nocturneMotion = "ready";
      revealItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight * 0.88) {
          item.dataset.nocturneVisible = "true";
        } else {
          revealObserver.observe(item);
        }
      });
      parallaxItems.forEach((item) => parallaxObserver.observe(item));
      requestScrollMotion();
    }

    function disableMotion() {
      delete motionRoot.dataset.nocturneMotion;
      revealObserver.disconnect();
      parallaxObserver.disconnect();
      parallaxActive.clear();
      parallaxItems.forEach((item) => {
        delete item.dataset.nocturneParallaxActive;
        item.style.removeProperty("--nocturne-parallax");
      });
      resetHeroMotion();
    }

    function handleMotionPreference(event: MediaQueryListEvent) {
      reduceMotion = event.matches;
      if (reduceMotion) {
        disableMotion();
      } else {
        enableMotion();
      }
      updateRoomRail();
      requestScrollMotion();
    }

    if (!reduceMotion) enableMotion();

    const finalObserver = finalScene
      ? new IntersectionObserver(
        ([entry]) => {
          motionRoot.dataset.nocturneFinalVisible = entry.isIntersecting ? "true" : "false";
        },
        { threshold: 0.15 }
      )
      : null;

    if (finalScene && finalObserver) finalObserver.observe(finalScene);

    function updateScrollMotion() {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, window.scrollY / maxScroll);
      const heroRect = hero?.getBoundingClientRect() ?? null;
      const mobile = window.innerWidth <= 800;
      const parallaxMeasurements = reduceMotion
        ? []
        : Array.from(parallaxActive, (item) => {
          const rect = item.getBoundingClientRect();
          const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2)
            / (window.innerHeight + rect.height);
          const range = item.dataset.nocturneParallax === "feature"
            ? (mobile ? 18 : 48)
            : (mobile ? 14 : 34);
          return {
            item,
            offset: Math.max(-1, Math.min(1, centerOffset)) * range
          };
        });

      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.transform = `scaleX(${scrollProgress})`;
      }

      if (reduceMotion) return;

      if (heroRect) {
        const exitDistance = Math.max(1, Math.min(heroRect.height, window.innerHeight) * 0.72);
        const exit = Math.max(0, Math.min(1, -heroRect.top / exitDistance));
        const interfaceOpacity = Math.max(0.08, 1 - exit * 1.04);

        if (heroMedia) {
          heroMedia.style.setProperty("--nocturne-hero-media-y", `${(exit * 18).toFixed(2)}px`);
          heroMedia.style.setProperty("--nocturne-hero-media-scale", (1.025 + exit * 0.025).toFixed(4));
        }
        if (heroCopy) {
          heroCopy.style.transform = `translate3d(0, ${(-exit * 28).toFixed(2)}px, 0)`;
          heroCopy.style.opacity = String(Math.max(0.12, 1 - exit * 0.92));
        }
        if (heroHeader) heroHeader.style.opacity = String(interfaceOpacity);
        if (heroSceneNav) heroSceneNav.style.opacity = String(interfaceOpacity);
        if (heroScrollCue) heroScrollCue.style.opacity = String(Math.max(0, 1 - exit * 1.8));
      }

      parallaxMeasurements.forEach(({ item, offset }) => {
        item.style.setProperty("--nocturne-parallax", `${offset.toFixed(2)}px`);
      });
    }

    function requestScrollMotion() {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollMotion);
    }

    function updateRoomRail() {
      roomFrame = 0;
      if (!roomRail || !roomCards.length) return;

      const railCenter = roomRail.scrollLeft + roomRail.clientWidth / 2;
      activeRoomIndex = roomCards.reduce((closest, card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const closestCard = roomCards[closest];
        const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
        return Math.abs(cardCenter - railCenter) < Math.abs(closestCenter - railCenter) ? index : closest;
      }, 0);

      roomCards.forEach((card, index) => {
        const active = index === activeRoomIndex;
        card.dataset.nocturneRoomActive = active ? "true" : "false";
      });
      if (roomCurrent) roomCurrent.textContent = `0${activeRoomIndex + 1}`;
      motionRoot.style.setProperty("--nocturne-room-progress", String((activeRoomIndex + 1) / roomCards.length));
      if (roomPrevious) roomPrevious.disabled = activeRoomIndex === 0;
      if (roomNext) roomNext.disabled = activeRoomIndex === roomCards.length - 1;
    }

    function requestRoomRailUpdate() {
      if (roomFrame) return;
      roomFrame = window.requestAnimationFrame(updateRoomRail);
    }

    function moveRoom(direction: number) {
      if (!roomRail || !roomCards.length) return;
      const nextIndex = Math.max(0, Math.min(roomCards.length - 1, activeRoomIndex + direction));
      roomRail.scrollTo({
        left: roomCards[nextIndex].offsetLeft,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    }

    function showPreviousRoom() {
      moveRoom(-1);
    }

    function showNextRoom() {
      moveRoom(1);
    }

    function resetMagnetic() {
      if (!activeMagnetic) return;
      activeMagnetic.style.transform = "";
      activeMagnetic = null;
    }

    function handlePointerMove(event: PointerEvent) {
      if (!finePointer || reduceMotion) return;

      const target = event.target instanceof HTMLElement ? event.target : null;
      const cursorTarget = target?.closest<HTMLElement>("[data-nocturne-cursor-label]");
      const cursor = cursorRef.current;
      const cursorLabel = cursorLabelRef.current;

      if (cursor) {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        cursor.dataset.visible = cursorTarget ? "true" : "false";
      }
      if (cursorTarget && cursorLabel) {
        cursorLabel.textContent = cursorTarget.dataset.nocturneCursorLabel ?? "Explore";
      }

      const stage = target?.closest<HTMLElement>("[data-nocturne-pointer-stage]");
      if (stage) {
        const rect = stage.getBoundingClientRect();
        motionRoot.style.setProperty("--nocturne-pointer-x", String((event.clientX - rect.left) / rect.width - 0.5));
        motionRoot.style.setProperty("--nocturne-pointer-y", String((event.clientY - rect.top) / rect.height - 0.5));
      }

      const magnetic = target?.closest<HTMLElement>("[data-nocturne-magnetic]");
      if (magnetic !== activeMagnetic) resetMagnetic();
      if (magnetic) {
        activeMagnetic = magnetic;
        const rect = magnetic.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
        magnetic.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }

    function handlePointerOut(event: PointerEvent) {
      if (!(event.relatedTarget instanceof Node) || !motionRoot.contains(event.relatedTarget)) {
        if (cursorRef.current) cursorRef.current.dataset.visible = "false";
        motionRoot.style.setProperty("--nocturne-pointer-x", "0");
        motionRoot.style.setProperty("--nocturne-pointer-y", "0");
        resetMagnetic();
      }
    }

    function handleFocusIn(event: FocusEvent) {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const revealItem = target?.closest<HTMLElement>("[data-nocturne-reveal]");
      if (revealItem) revealItem.dataset.nocturneVisible = "true";
    }

    window.addEventListener("scroll", requestScrollMotion, { passive: true });
    window.addEventListener("resize", requestScrollMotion, { passive: true });
    motionPreference.addEventListener("change", handleMotionPreference);
    roomRail?.addEventListener("scroll", requestRoomRailUpdate, { passive: true });
    roomPrevious?.addEventListener("click", showPreviousRoom);
    roomNext?.addEventListener("click", showNextRoom);
    motionRoot.addEventListener("pointermove", handlePointerMove);
    motionRoot.addEventListener("pointerout", handlePointerOut);
    motionRoot.addEventListener("focusin", handleFocusIn);
    updateScrollMotion();
    updateRoomRail();

    return () => {
      window.removeEventListener("scroll", requestScrollMotion);
      window.removeEventListener("resize", requestScrollMotion);
      motionPreference.removeEventListener("change", handleMotionPreference);
      roomRail?.removeEventListener("scroll", requestRoomRailUpdate);
      roomPrevious?.removeEventListener("click", showPreviousRoom);
      roomNext?.removeEventListener("click", showNextRoom);
      motionRoot.removeEventListener("pointermove", handlePointerMove);
      motionRoot.removeEventListener("pointerout", handlePointerOut);
      motionRoot.removeEventListener("focusin", handleFocusIn);
      revealObserver.disconnect();
      parallaxObserver.disconnect();
      finalObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (roomFrame) window.cancelAnimationFrame(roomFrame);
      resetMagnetic();
      resetHeroMotion();
      delete motionRoot.dataset.nocturneMotion;
      delete motionRoot.dataset.nocturneFinalVisible;
      parallaxItems.forEach((item) => {
        delete item.dataset.nocturneParallaxActive;
        item.style.removeProperty("--nocturne-parallax");
      });
      if (scrollProgressRef.current) scrollProgressRef.current.style.transform = "";
      motionRoot.style.removeProperty("--nocturne-pointer-x");
      motionRoot.style.removeProperty("--nocturne-pointer-y");
    };
  }, []);

  return (
    <>
      <div className={styles.nocturneScrollProgress} aria-hidden="true"><i ref={scrollProgressRef} /></div>
      <div className={styles.nocturneCursor} ref={cursorRef} aria-hidden="true">
        <span ref={cursorLabelRef}>Explore</span>
      </div>
    </>
  );
}
