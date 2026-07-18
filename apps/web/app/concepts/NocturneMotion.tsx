"use client";

import { useEffect, useRef } from "react";
import styles from "./concepts.module.css";

export function NocturneMotion() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-nocturne-root]");
    if (!root) return;
    const motionRoot = root;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const revealItems = Array.from(motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-reveal]"));
    const parallaxItems = Array.from(motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-parallax]"));
    const finalScene = motionRoot.querySelector<HTMLElement>("[data-nocturne-final]");
    const roomRail = motionRoot.querySelector<HTMLElement>(`[class*="${styles.nocturneRail}"]`);
    const roomCards = roomRail ? Array.from(roomRail.querySelectorAll<HTMLElement>("article")) : [];
    const roomCurrent = motionRoot.querySelector<HTMLElement>("[data-nocturne-room-current]");
    const roomPrevious = motionRoot.querySelector<HTMLButtonElement>("[data-nocturne-room-previous]");
    const roomNext = motionRoot.querySelector<HTMLButtonElement>("[data-nocturne-room-next]");
    let frame = 0;
    let roomFrame = 0;
    let activeRoomIndex = 0;
    let activeMagnetic: HTMLElement | null = null;

    if (!reduceMotion) {
      motionRoot.dataset.nocturneMotion = "ready";
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.nocturneVisible = "true";
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    if (!reduceMotion) {
      revealItems.forEach((item) => revealObserver.observe(item));
    }

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
      motionRoot.style.setProperty("--nocturne-scroll-progress", String(Math.min(1, window.scrollY / maxScroll)));

      if (reduceMotion) return;
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / (window.innerHeight + rect.height);
        const range = window.innerWidth <= 800 ? 22 : 42;
        item.style.setProperty("--nocturne-parallax", `${Math.max(-1, Math.min(1, centerOffset)) * range}px`);
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
        card.dataset.nocturneRoomActive = index === activeRoomIndex ? "true" : "false";
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

    window.addEventListener("scroll", requestScrollMotion, { passive: true });
    window.addEventListener("resize", requestScrollMotion, { passive: true });
    roomRail?.addEventListener("scroll", requestRoomRailUpdate, { passive: true });
    roomPrevious?.addEventListener("click", showPreviousRoom);
    roomNext?.addEventListener("click", showNextRoom);
    motionRoot.addEventListener("pointermove", handlePointerMove);
    motionRoot.addEventListener("pointerout", handlePointerOut);
    updateScrollMotion();
    updateRoomRail();

    return () => {
      window.removeEventListener("scroll", requestScrollMotion);
      window.removeEventListener("resize", requestScrollMotion);
      roomRail?.removeEventListener("scroll", requestRoomRailUpdate);
      roomPrevious?.removeEventListener("click", showPreviousRoom);
      roomNext?.removeEventListener("click", showNextRoom);
      motionRoot.removeEventListener("pointermove", handlePointerMove);
      motionRoot.removeEventListener("pointerout", handlePointerOut);
      revealObserver.disconnect();
      finalObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (roomFrame) window.cancelAnimationFrame(roomFrame);
      resetMagnetic();
      delete motionRoot.dataset.nocturneMotion;
      delete motionRoot.dataset.nocturneFinalVisible;
      motionRoot.style.removeProperty("--nocturne-scroll-progress");
      motionRoot.style.removeProperty("--nocturne-pointer-x");
      motionRoot.style.removeProperty("--nocturne-pointer-y");
    };
  }, []);

  return (
    <>
      <div className={styles.nocturneScrollProgress} aria-hidden="true"><i /></div>
      <div className={styles.nocturneCursor} ref={cursorRef} aria-hidden="true">
        <span ref={cursorLabelRef}>Explore</span>
      </div>
    </>
  );
}
