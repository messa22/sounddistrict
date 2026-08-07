"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./concepts.module.css";

const roomAccents = [
  { color: "#507cff", rgb: "80, 124, 255" },
  { color: "#a63a56", rgb: "166, 58, 86" },
  { color: "#f7f4ee", rgb: "247, 244, 238" }
] as const;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function NocturneMotion() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);
  const scrollProgressRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-nocturne-root]");
    if (!root) return;
    const motionRoot = root;

    gsap.registerPlugin(ScrollTrigger);

    const hero = motionRoot.querySelector<HTMLElement>("[data-concept-hero]");
    const heroMedia = hero?.querySelector<HTMLElement>(`.${styles.nocturneMedia}`) ?? null;
    const heroCopy = hero?.querySelector<HTMLElement>(`.${styles.nocturneCopy}`) ?? null;
    const heroHeader = hero?.querySelector<HTMLElement>(`.${styles.nocturneHeader}`) ?? null;
    const heroSceneNav = hero?.querySelector<HTMLElement>(`.${styles.nocturneSceneNav}`) ?? null;
    const heroScrollCue = hero?.querySelector<HTMLElement>(`.${styles.nocturneScrollCue}`) ?? null;
    const portalRings = hero
      ? Array.from(hero.querySelectorAll<HTMLElement>("[data-nocturne-portal] > i"))
      : [];
    const roomsSection = motionRoot.querySelector<HTMLElement>(`#nocturne-rooms`);
    const roomHeadingWords = Array.from(
      motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-heading-word]")
    );
    const roomSignal = motionRoot.querySelector<HTMLElement>("[data-nocturne-room-signal]");
    const roomRail = motionRoot.querySelector<HTMLElement>(`.${styles.nocturneRail}`);
    const roomCards = Array.from(
      motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-room-card]")
    );
    const roomCardParts = roomCards.map((card) => ({
      card,
      shell: card.querySelector<HTMLElement>("[data-nocturne-room-shell]"),
      media: card.querySelector<HTMLElement>("[data-nocturne-room-media]")
    }));
    const roomCurrent = motionRoot.querySelector<HTMLElement>("[data-nocturne-room-current]");
    const roomPrevious = motionRoot.querySelector<HTMLButtonElement>("[data-nocturne-room-previous]");
    const roomNext = motionRoot.querySelector<HTMLButtonElement>("[data-nocturne-room-next]");
    const pricingSection = motionRoot.querySelector<HTMLElement>("[data-nocturne-pricing]");
    const pricingHead = motionRoot.querySelector<HTMLElement>("[data-nocturne-pricing-head]");
    const pricingWords = Array.from(
      motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-pricing-word]")
    );
    const pricingSignal = motionRoot.querySelector<HTMLElement>("[data-nocturne-pricing-signal]");
    const pricingConsole = motionRoot.querySelector<HTMLElement>("[data-nocturne-pricing-console]");
    const pricingTabs = motionRoot.querySelector<HTMLElement>("[data-nocturne-pricing-tabs]");
    const pricingPanel = motionRoot.querySelector<HTMLElement>("[data-nocturne-pricing-panel]");
    const pricingMedia = pricingPanel?.querySelector<HTMLElement>("[data-nocturne-price-media]") ?? null;
    const pricingRows = pricingPanel
      ? Array.from(pricingPanel.querySelectorAll<HTMLElement>("[data-nocturne-price-row]"))
      : [];
    const pricingServices = Array.from(
      motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-service-card]")
    );
    const projectContact = motionRoot.querySelector<HTMLElement>("[data-nocturne-project-contact]");
    const beyondDisclosure = motionRoot.querySelector<HTMLDetailsElement>("[data-nocturne-beyond-disclosure]");
    const beyondHead = motionRoot.querySelector<HTMLElement>(`.${styles.nocturneBeyondHead}`);
    const beyondWords = Array.from(
      motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-beyond-word]")
    );
    const beyondSignal = motionRoot.querySelector<HTMLElement>("[data-nocturne-beyond-signal]");
    const featureCards = Array.from(
      motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-feature-card]")
    );
    const finalCard = motionRoot.querySelector<HTMLElement>("[data-nocturne-final]");
    const endCta = motionRoot.querySelector<HTMLElement>("[data-nocturne-end-cta]");
    const bookingDocks = Array.from(
      motionRoot.querySelectorAll<HTMLElement>("[data-nocturne-booking-dock]")
    );
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mediaMatcher = gsap.matchMedia();

    let prefersReduced = reducedMotion.matches;
    let activeRoomIndex = -1;
    let roomFrame = 0;
    let activeMagnetic: HTMLElement | null = null;
    let roomRevealTimeline: gsap.core.Timeline | null = null;
    let dockPassedHero = false;
    let dockReachedEnding = false;
    let heroIsVisible = true;
    let finalIsVisible = false;
    let alive = true;

    function syncDockInteractivity() {
      const interactive = prefersReduced
        ? !heroIsVisible && !finalIsVisible
        : dockPassedHero && !dockReachedEnding;
      bookingDocks.forEach((dock) => {
        dock.style.pointerEvents = interactive ? "auto" : "none";
        dock.toggleAttribute("inert", !interactive);
      });
    }

    const heroObserver = hero
      ? new IntersectionObserver(
        ([entry]) => {
          heroIsVisible = entry.isIntersecting;
          syncDockInteractivity();
        },
        { threshold: 0.08 }
      )
      : null;
    const finalObserver = finalCard
      ? new IntersectionObserver(
        ([entry]) => {
          finalIsVisible = entry.isIntersecting;
          motionRoot.dataset.nocturneFinalVisible = finalIsVisible ? "true" : "false";
          syncDockInteractivity();
        },
        { threshold: 0.18 }
      )
      : null;

    function setActiveRoom(nextIndex: number) {
      const index = Math.max(0, Math.min(roomCards.length - 1, nextIndex));
      if (index === activeRoomIndex) return;

      activeRoomIndex = index;
      roomCards.forEach((card, cardIndex) => {
        card.dataset.nocturneRoomActive = cardIndex === index ? "true" : "false";
      });

      const accent = roomAccents[index] ?? roomAccents[0];
      motionRoot.style.setProperty("--dock-accent", accent.color);
      motionRoot.style.setProperty("--dock-accent-rgb", accent.rgb);

      if (roomCurrent) {
        gsap.killTweensOf(roomCurrent);
        if (prefersReduced || roomCurrent.textContent === "01" && index === 0) {
          if (prefersReduced) {
            gsap.set(roomCurrent, { clearProps: "transform,opacity,visibility" });
          }
          roomCurrent.textContent = `0${index + 1}`;
        } else {
          gsap.to(roomCurrent, {
            y: -7,
            autoAlpha: 0,
            duration: 0.13,
            ease: "power2.in",
            onComplete: () => {
              roomCurrent.textContent = `0${index + 1}`;
              gsap.fromTo(
                roomCurrent,
                { y: 7, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.24, ease: "power3.out" }
              );
            }
          });
        }
      }

      if (roomPrevious) roomPrevious.disabled = index === 0;
      if (roomNext) roomNext.disabled = index === roomCards.length - 1;
    }

    function updateRoomRail() {
      roomFrame = 0;
      if (!roomRail || roomCards.length === 0) return;

      const maximumScroll = Math.max(1, roomRail.scrollWidth - roomRail.clientWidth);
      const progress = clamp(roomRail.scrollLeft / maximumScroll);
      const railCenter = roomRail.scrollLeft + roomRail.clientWidth / 2;
      const mobile = window.innerWidth <= 800;

      motionRoot.style.setProperty("--nocturne-room-progress", String(progress));

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      roomCardParts.forEach(({ card, shell, media }, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distanceInPixels = cardCenter - railCenter;
        const normalizedDistance = clamp(
          distanceInPixels / Math.max(1, card.offsetWidth * 0.9),
          -1.25,
          1.25
        );
        const absoluteDistance = Math.abs(normalizedDistance);

        if (Math.abs(distanceInPixels) < closestDistance) {
          closestDistance = Math.abs(distanceInPixels);
          closestIndex = index;
        }

        if (!prefersReduced && mobile) {
          card.style.opacity = String(0.54 + (1 - Math.min(absoluteDistance, 1)) * 0.46);
          if (shell) {
            shell.style.transform =
              `translate3d(0, ${(absoluteDistance * 12).toFixed(2)}px, 0) `
              + `scale(${(1 - Math.min(absoluteDistance, 1) * 0.045).toFixed(4)}) `
              + `rotateY(${(normalizedDistance * -3.6).toFixed(2)}deg)`;
          }
          if (media) {
            media.style.transform =
              `translate3d(${(normalizedDistance * -11).toFixed(2)}px, 0, 0)`;
          }
        } else {
          card.style.removeProperty("opacity");
          shell?.style.removeProperty("transform");
          media?.style.removeProperty("transform");
        }
      });

      setActiveRoom(closestIndex);
    }

    function requestRoomRailUpdate() {
      if (roomFrame) return;
      roomFrame = window.requestAnimationFrame(updateRoomRail);
    }

    function moveRoom(direction: number) {
      if (!roomRail || roomCards.length === 0) return;
      const current = activeRoomIndex < 0 ? 0 : activeRoomIndex;
      const nextIndex = Math.max(0, Math.min(roomCards.length - 1, current + direction));
      roomRail.scrollTo({
        left: roomCards[nextIndex].offsetLeft - roomRail.offsetLeft,
        behavior: prefersReduced ? "auto" : "smooth"
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
      activeMagnetic.style.removeProperty("transform");
      activeMagnetic = null;
    }

    function handlePointerMove(event: PointerEvent) {
      if (!finePointer.matches || prefersReduced) return;

      const target = event.target instanceof HTMLElement ? event.target : null;
      const cursorTarget = target?.closest<HTMLElement>("[data-nocturne-cursor-label]");
      const cursor = cursorRef.current;
      const cursorLabel = cursorLabelRef.current;

      if (cursor) {
        cursor.style.transform =
          `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        cursor.dataset.visible = cursorTarget ? "true" : "false";
      }
      if (cursorTarget && cursorLabel) {
        cursorLabel.textContent = cursorTarget.dataset.nocturneCursorLabel ?? "Explore";
      }

      const stage = target?.closest<HTMLElement>("[data-nocturne-pointer-stage]");
      if (stage) {
        const rect = stage.getBoundingClientRect();
        motionRoot.style.setProperty(
          "--nocturne-pointer-x",
          String((event.clientX - rect.left) / rect.width - 0.5)
        );
        motionRoot.style.setProperty(
          "--nocturne-pointer-y",
          String((event.clientY - rect.top) / rect.height - 0.5)
        );
      }

      const magnetic = target?.closest<HTMLElement>("[data-nocturne-magnetic]");
      if (magnetic?.closest("[data-concept-hero]")) {
        resetMagnetic();
        return;
      }
      if (magnetic !== activeMagnetic) resetMagnetic();
      if (magnetic) {
        activeMagnetic = magnetic;
        const rect = magnetic.getBoundingClientRect();
        gsap.set(magnetic, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.08,
          y: (event.clientY - rect.top - rect.height / 2) * 0.12
        });
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
      if (target?.closest("[data-nocturne-room-card]") && roomRevealTimeline) {
        roomRevealTimeline.progress(1).pause();
      }
    }

    function handleBeyondToggle() {
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    function createHeroChoreography(isMobile: boolean) {
      if (!hero) return;

      const eyebrow = heroCopy?.querySelector<HTMLElement>("p") ?? null;
      const headlineFirst = heroCopy?.querySelector<HTMLElement>("h1 > span") ?? null;
      const headlineSecond = heroCopy?.querySelector<HTMLElement>("h1 > em") ?? null;
      const primary = heroCopy?.querySelector<HTMLElement>(`.${styles.nocturnePrimary}`) ?? null;
      const compare = heroCopy?.querySelector<HTMLElement>("a") ?? null;
      const assurance = heroCopy?.querySelector<HTMLElement>("small") ?? null;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: isMobile ? 0.28 : 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            dockPassedHero = self.progress > 0.5;
            syncDockInteractivity();
          }
        }
      });

      if (heroMedia) {
        timeline.fromTo(
          heroMedia,
          {
            "--nocturne-hero-media-y": "0px",
            "--nocturne-hero-media-scale": isMobile ? 1.018 : 1.025
          },
          {
            "--nocturne-hero-media-y": `${isMobile ? 28 : 44}px`,
            "--nocturne-hero-media-scale": isMobile ? 1.09 : 1.12,
            duration: 1
          },
          0
        );
      }
      if (eyebrow) {
        timeline.to(eyebrow, { y: -13, autoAlpha: 0, duration: 0.22 }, 0.06);
      }
      if (headlineFirst) {
        timeline.to(
          headlineFirst,
          { x: isMobile ? -24 : -42, y: -18, autoAlpha: 0, duration: 0.34 },
          0.12
        );
      }
      if (headlineSecond) {
        timeline.to(
          headlineSecond,
          { x: isMobile ? 22 : 36, y: -25, autoAlpha: 0, duration: 0.38 },
          0.16
        );
      }
      if (primary) {
        timeline.to(primary, { y: -18, autoAlpha: 0, scale: 0.97, duration: 0.28 }, 0.23);
      }
      if (compare) {
        timeline.to(compare, { y: -13, autoAlpha: 0, duration: 0.24 }, 0.28);
      }
      if (assurance) {
        timeline.to(assurance, { y: -9, autoAlpha: 0, duration: 0.2 }, 0.31);
      }
      if (heroHeader) {
        timeline.to(heroHeader, { autoAlpha: 0.14, y: -8, duration: 0.38 }, 0.12);
      }
      if (heroSceneNav) {
        timeline.to(heroSceneNav, { autoAlpha: 0.17, y: isMobile ? -7 : 0, duration: 0.36 }, 0.15);
      }
      if (heroScrollCue) {
        timeline.to(heroScrollCue, { autoAlpha: 0, duration: 0.16 }, 0);
      }
      if (portalRings.length > 0) {
        timeline.fromTo(
          portalRings,
          { scale: 0.25, autoAlpha: 0 },
          {
            scale: (index) => 0.92 + index * 0.34,
            autoAlpha: (index) => 0.44 - index * 0.1,
            stagger: 0.045,
            duration: 0.3
          },
          0.24
        );
        timeline.to(
          portalRings,
          {
            scale: (index) => 1.65 + index * 0.42,
            autoAlpha: 0,
            stagger: 0.035,
            duration: 0.42
          },
          0.48
        );
      }
      if (roomsSection) {
        timeline.fromTo(
          roomsSection,
          {
            y: isMobile ? 58 : 78,
            borderRadius: isMobile ? "30px 30px 0 0" : "42px 42px 0 0"
          },
          { y: 0, borderRadius: "18px 18px 0 0", duration: 0.5 },
          0.4
        );
      }
      if (bookingDocks.length > 0) {
        timeline.fromTo(
          bookingDocks,
          {
            "--dock-enter-y": "128%",
            "--dock-enter-opacity": 0
          },
          {
            "--dock-enter-y": "0%",
            "--dock-enter-opacity": 1,
            duration: 0.28
          },
          0.54
        );
      }
    }

    function createRoomChoreography(isMobile: boolean) {
      if (roomsSection && roomHeadingWords.length > 0) {
        gsap.set(roomHeadingWords, {
          yPercent: 118,
          autoAlpha: 0,
          rotation: (index) => index % 2 === 0 ? 1.8 : -1.1,
          transformOrigin: "0 100%"
        });
        if (roomSignal) gsap.set(roomSignal, { scaleX: 0, transformOrigin: "0 50%" });

        const headingTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: roomsSection,
            start: "top 88%",
            end: "top 62%",
            scrub: isMobile ? 0.32 : 0.48
          }
        });
        headingTimeline.to(roomHeadingWords, {
          yPercent: 0,
          autoAlpha: 1,
          rotation: 0,
          stagger: 0.055,
          duration: 0.6,
          ease: "power4.out"
        });
        if (roomSignal) {
          headingTimeline.to(
            roomSignal,
            { scaleX: 1, duration: 0.64, ease: "power3.inOut" },
            0.12
          );
        }
      }

      if (!roomRail || roomCards.length === 0) return;

      const revealLayers = roomCards
        .map((card) => card.querySelector<HTMLElement>("[data-nocturne-room-reveal]"))
        .filter((item): item is HTMLElement => Boolean(item));
      const roomImages = roomCards
        .map((card) => card.querySelector<HTMLElement>("[data-nocturne-room-media] img"))
        .filter((item): item is HTMLElement => Boolean(item));
      const apertures = roomCards
        .map((card) => card.querySelector<HTMLElement>("[data-nocturne-room-aperture]"))
        .filter((item): item is HTMLElement => Boolean(item));
      const metadata = roomCards.flatMap((card) => {
        const container = card.querySelector<HTMLElement>("[data-nocturne-room-meta]");
        return container ? Array.from(container.children) as HTMLElement[] : [];
      });

      gsap.set(revealLayers, {
        clipPath: "inset(47% 0 47% 0 round 20px)"
      });
      gsap.set(roomImages, { scale: 1.14 });
      gsap.set(apertures, { autoAlpha: 1, scaleX: 0.34 });
      gsap.set(metadata, { y: 22, autoAlpha: 0 });

      roomRevealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: roomRail,
          start: "top 90%",
          end: isMobile ? "top 54%" : "top 48%",
          scrub: isMobile ? 0.3 : 0.46
        }
      });
      roomRevealTimeline
        .to(revealLayers, {
          clipPath: "inset(0% 0 0% 0 round 20px)",
          stagger: 0.055,
          duration: 0.68,
          ease: "power4.inOut"
        }, 0)
        .to(roomImages, {
          scale: 1.045,
          stagger: 0.055,
          duration: 0.78,
          ease: "power3.out"
        }, 0.03)
        .to(apertures, {
          scaleX: 1,
          autoAlpha: 0,
          stagger: 0.055,
          duration: 0.4,
          ease: "power2.out"
        }, 0.04)
        .to(metadata, {
          y: 0,
          autoAlpha: 1,
          stagger: 0.027,
          duration: 0.42,
          ease: "power3.out"
        }, 0.28);
    }

    function createBeyondHeading(isMobile: boolean) {
      if (!beyondHead || beyondWords.length === 0) return;

      gsap.set(beyondWords, {
        yPercent: 118,
        autoAlpha: 0,
        rotation: (index) => index === 1 ? -1 : 1,
        transformOrigin: "0 100%"
      });
      if (beyondSignal) gsap.set(beyondSignal, { scaleX: 0, transformOrigin: "0 50%" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: beyondHead,
          start: "top 90%",
          end: "top 62%",
          scrub: isMobile ? 0.32 : 0.48
        }
      });
      if (roomSignal) {
        timeline.to(roomSignal, { scaleX: 0, autoAlpha: 0.2, duration: 0.3 }, 0);
      }
      timeline.to(beyondWords, {
        yPercent: 0,
        autoAlpha: 1,
        rotation: 0,
        stagger: 0.055,
        duration: 0.56,
        ease: "power4.out"
      }, 0.08);
      if (beyondSignal) {
        timeline.to(
          beyondSignal,
          { scaleX: 1, duration: 0.58, ease: "power3.inOut" },
          0.2
        );
      }
    }

    function createPricingChoreography(isMobile: boolean) {
      if (!pricingSection) return;

      if (pricingHead && pricingWords.length > 0) {
        gsap.set(pricingWords, {
          yPercent: 112,
          autoAlpha: 0,
          rotation: (index) => index === 1 ? -1.2 : 1.2,
          transformOrigin: "0 100%"
        });
        if (pricingSignal) gsap.set(pricingSignal, { scaleX: 0, transformOrigin: "0 50%" });

        const headingTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pricingHead,
            start: "top 88%",
            end: "top 62%",
            scrub: isMobile ? 0.32 : 0.48
          }
        });
        headingTimeline.to(pricingWords, {
          yPercent: 0,
          autoAlpha: 1,
          rotation: 0,
          stagger: 0.05,
          duration: 0.58,
          ease: "power4.out"
        });
        if (pricingSignal) {
          headingTimeline.to(
            pricingSignal,
            { scaleX: 1, duration: 0.62, ease: "power3.inOut" },
            0.12
          );
        }
      }

      if (pricingConsole) {
        const priceNumbers = pricingPanel
          ? Array.from(pricingPanel.querySelectorAll<HTMLElement>("[data-nocturne-price-number]"))
          : [];
        const consoleTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pricingConsole,
            start: "top 84%",
            once: true
          }
        });

        consoleTimeline
          .fromTo(
            pricingConsole,
            { y: isMobile ? 28 : 40, autoAlpha: 0, scale: 0.985 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.72, ease: "power4.out" },
            0
          );
        if (pricingTabs) {
          consoleTimeline.fromTo(
            Array.from(pricingTabs.children),
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.065, duration: 0.42, ease: "power3.out" },
            0.12
          );
        }
        if (pricingMedia) {
          const image = pricingMedia.querySelector<HTMLElement>("img");
          consoleTimeline.fromTo(
            pricingMedia,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.78, ease: "power4.inOut" },
            0.18
          );
          if (image) {
            consoleTimeline.fromTo(
              image,
              { scale: 1.15, xPercent: 3 },
              { scale: 1.04, xPercent: 0, duration: 1.02, ease: "power3.out" },
              0.16
            );
          }
        }
        consoleTimeline
          .fromTo(
            priceNumbers,
            { yPercent: 64, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, stagger: 0.045, duration: 0.46, ease: "power4.out" },
            0.36
          )
          .fromTo(
            pricingRows,
            { y: 15, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.055, duration: 0.42, ease: "power3.out" },
            0.38
          );
      }

      pricingServices.forEach((card, index) => {
        const children = Array.from(card.children) as HTMLElement[];
        gsap.fromTo(
          card,
          {
            y: isMobile ? 30 : 44,
            autoAlpha: 0,
            clipPath: index === 0 ? "inset(0 0 100% 0 round 22px)" : "inset(100% 0 0 0 round 22px)"
          },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0 0 0 round 22px)",
            duration: 0.78,
            ease: "power4.inOut",
            scrollTrigger: { trigger: card, start: "top 88%", once: true }
          }
        );
        gsap.fromTo(
          children,
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.055,
            duration: 0.46,
            delay: 0.16,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true }
          }
        );
      });

      if (projectContact) {
        gsap.fromTo(
          projectContact,
          { y: 28, autoAlpha: 0, scale: 0.985 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.68,
            ease: "power4.out",
            scrollTrigger: { trigger: projectContact, start: "top 91%", once: true }
          }
        );
      }
    }

    function createFeatureChoreography(card: HTMLElement, isMobile: boolean) {
      const type = card.dataset.nocturneFeatureCard;
      const shell = card.querySelector<HTMLElement>("[data-nocturne-feature-shell]");
      const media = card.querySelector<HTMLElement>("[data-nocturne-feature-media]");
      const image = media?.querySelector<HTMLElement>("img") ?? null;
      const lines = Array.from(
        card.querySelectorAll<HTMLElement>("[data-nocturne-feature-line]")
      );
      if (!shell) return;

      gsap.set(shell, { y: isMobile ? 28 : 36, scale: 0.975 });
      gsap.set(lines, { yPercent: 118, autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: isMobile ? "top 42%" : "top 48%",
          scrub: isMobile ? 0.38 : 0.58,
          invalidateOnRefresh: true
        }
      });

      timeline.to(shell, {
        y: 0,
        scale: 1,
        duration: 0.42,
        ease: "power3.out"
      }, 0);

      if (type === "doors") {
        const doors = Array.from(
          card.querySelectorAll<HTMLElement>("[data-nocturne-feature-doors] > i")
        );
        if (image) gsap.set(image, { scale: 1.13, xPercent: 2.5 });
        timeline
          .to(doors[0], { xPercent: -104, duration: 0.58, ease: "power3.inOut" }, 0.08)
          .to(doors[1], { xPercent: 104, duration: 0.58, ease: "power3.inOut" }, 0.08);
        if (image) {
          timeline.to(
            image,
            { scale: 1.045, xPercent: 0, yPercent: 1.3, duration: 0.82, ease: "power2.out" },
            0.02
          );
        }
        timeline.to(lines, {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.055,
          duration: 0.4,
          ease: "power4.out"
        }, 0.36);
      }

      if (type === "scan") {
        const scanLine = card.querySelector<HTMLElement>("[data-nocturne-feature-scan] > i");
        if (media) gsap.set(media, { clipPath: "inset(0 100% 0 0)" });
        if (image) gsap.set(image, { scale: 1.12, xPercent: -2.2 });
        if (scanLine) gsap.set(scanLine, { x: 0, autoAlpha: 0 });
        if (media) {
          timeline.to(
            media,
            { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.inOut" },
            0.05
          );
        }
        if (scanLine) {
          timeline
            .to(scanLine, { autoAlpha: 1, duration: 0.08 }, 0.05)
            .to(
              scanLine,
              {
                x: () => card.clientWidth,
                duration: 0.72,
                ease: "power3.inOut"
              },
              0.05
            )
            .to(scanLine, { autoAlpha: 0, duration: 0.1 }, 0.69);
        }
        if (image) {
          timeline.to(
            image,
            { scale: 1.045, xPercent: 0, yPercent: 1.5, duration: 0.84, ease: "power2.out" },
            0.02
          );
        }
        timeline.to(lines, {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.055,
          duration: 0.4,
          ease: "power4.out"
        }, 0.45);
      }

      if (type === "strips") {
        const strips = Array.from(
          card.querySelectorAll<HTMLElement>("[data-nocturne-collage-strip]")
        );
        const stripImages = strips
          .map((strip) => strip.querySelector<HTMLElement>("img"))
          .filter((item): item is HTMLElement => Boolean(item));
        const light = card.querySelector<HTMLElement>("[data-nocturne-feature-light]");

        gsap.set(strips, {
          yPercent: (index) => index === 1 ? -18 : 18,
          autoAlpha: 0.16
        });
        gsap.set(stripImages, { scale: 1.12 });
        if (light) gsap.set(light, { xPercent: -135, autoAlpha: 0 });

        timeline
          .to(strips, {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.07,
            duration: 0.58,
            ease: "power4.out"
          }, 0.04)
          .to(stripImages, {
            scale: 1.045,
            stagger: 0.07,
            duration: 0.72,
            ease: "power3.out"
          }, 0.04);
        if (light) {
          timeline
            .to(light, { autoAlpha: 0.72, duration: 0.08 }, 0.24)
            .to(light, { xPercent: 135, duration: 0.52, ease: "power2.inOut" }, 0.24)
            .to(light, { autoAlpha: 0, duration: 0.09 }, 0.68);
        }
        timeline.to(lines, {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.045,
          duration: 0.38,
          ease: "power4.out"
        }, 0.35);
      }
    }

    function createEndingChoreography(isMobile: boolean) {
      if (!finalCard || !endCta) return;

      gsap.set(endCta, { y: isMobile ? 34 : 46, autoAlpha: 0, scale: 0.96 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: finalCard,
          start: "top 78%",
          end: "top 42%",
          scrub: isMobile ? 0.34 : 0.5,
          onUpdate: (self) => {
            dockReachedEnding = self.progress > 0.08;
            syncDockInteractivity();
          }
        }
      });

      timeline.fromTo(
        bookingDocks,
        {
          "--dock-exit-y": "0%",
          "--dock-exit-opacity": 0
        },
        {
          "--dock-exit-y": "128%",
          "--dock-exit-opacity": 1,
          duration: 0.38,
          ease: "power3.in"
        },
        0
      );
      timeline.to(endCta, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.48,
        ease: "power4.out"
      }, 0.24);
    }

    mediaMatcher.add(
      {
        isMobile: "(max-width: 800px)",
        isDesktop: "(min-width: 801px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      },
      (context) => {
        const conditions = context.conditions as {
          isMobile?: boolean;
          isDesktop?: boolean;
          reduceMotion?: boolean;
        };
        const isMobile = Boolean(conditions.isMobile);
        prefersReduced = Boolean(conditions.reduceMotion);
        roomRevealTimeline = null;
        activeRoomIndex = -1;
        dockPassedHero = false;
        dockReachedEnding = false;

        if (prefersReduced) {
          motionRoot.dataset.nocturneMotion = "reduced";
          if (cursorRef.current) cursorRef.current.dataset.visible = "false";
          resetMagnetic();
          motionRoot.style.setProperty("--nocturne-pointer-x", "0");
          motionRoot.style.setProperty("--nocturne-pointer-y", "0");
          updateRoomRail();
          syncDockInteractivity();
          return;
        }

        motionRoot.dataset.nocturneMotion = "cinematic";
        createHeroChoreography(isMobile);
        createRoomChoreography(isMobile);
        createPricingChoreography(isMobile);
        createBeyondHeading(isMobile);
        featureCards.forEach((card) => createFeatureChoreography(card, isMobile));
        createEndingChoreography(isMobile);

        if (scrollProgressRef.current) {
          gsap.set(scrollProgressRef.current, { scaleX: 0, transformOrigin: "0 50%" });
          gsap.to(scrollProgressRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              start: 0,
              end: "max",
              scrub: 0.16
            }
          });
        }

        updateRoomRail();
        syncDockInteractivity();

        return () => {
          roomRevealTimeline = null;
          bookingDocks.forEach((dock) => {
            dock.removeAttribute("inert");
            dock.style.removeProperty("pointer-events");
          });
        };
      }
    );

    roomRail?.addEventListener("scroll", requestRoomRailUpdate, { passive: true });
    roomPrevious?.addEventListener("click", showPreviousRoom);
    roomNext?.addEventListener("click", showNextRoom);
    beyondDisclosure?.addEventListener("toggle", handleBeyondToggle);
    motionRoot.addEventListener("pointermove", handlePointerMove);
    motionRoot.addEventListener("pointerout", handlePointerOut);
    motionRoot.addEventListener("focusin", handleFocusIn);
    window.addEventListener("resize", requestRoomRailUpdate, { passive: true });
    if (hero && heroObserver) heroObserver.observe(hero);
    if (finalCard && finalObserver) finalObserver.observe(finalCard);

    updateRoomRail();
    document.fonts.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      roomRail?.removeEventListener("scroll", requestRoomRailUpdate);
      roomPrevious?.removeEventListener("click", showPreviousRoom);
      roomNext?.removeEventListener("click", showNextRoom);
      beyondDisclosure?.removeEventListener("toggle", handleBeyondToggle);
      motionRoot.removeEventListener("pointermove", handlePointerMove);
      motionRoot.removeEventListener("pointerout", handlePointerOut);
      motionRoot.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("resize", requestRoomRailUpdate);
      heroObserver?.disconnect();
      finalObserver?.disconnect();
      if (roomFrame) window.cancelAnimationFrame(roomFrame);
      resetMagnetic();
      if (roomCurrent) {
        gsap.killTweensOf(roomCurrent);
        gsap.set(roomCurrent, { clearProps: "transform,opacity,visibility" });
      }
      mediaMatcher.revert();
      delete motionRoot.dataset.nocturneMotion;
      delete motionRoot.dataset.nocturneFinalVisible;
      roomCardParts.forEach(({ card, shell, media }) => {
        delete card.dataset.nocturneRoomActive;
        card.style.removeProperty("opacity");
        shell?.style.removeProperty("transform");
        media?.style.removeProperty("transform");
      });
      bookingDocks.forEach((dock) => {
        dock.removeAttribute("inert");
        dock.style.removeProperty("pointer-events");
      });
      motionRoot.style.removeProperty("--nocturne-pointer-x");
      motionRoot.style.removeProperty("--nocturne-pointer-y");
      motionRoot.style.removeProperty("--nocturne-room-progress");
      motionRoot.style.removeProperty("--dock-accent");
      motionRoot.style.removeProperty("--dock-accent-rgb");
      if (scrollProgressRef.current) scrollProgressRef.current.style.removeProperty("transform");
    };
  }, []);

  return (
    <>
      <div className={styles.nocturneScrollProgress} aria-hidden="true">
        <i ref={scrollProgressRef} />
      </div>
      <div className={styles.nocturneCursor} ref={cursorRef} aria-hidden="true">
        <span ref={cursorLabelRef}>Explore</span>
      </div>
    </>
  );
}
