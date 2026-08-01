"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./concepts.module.css";

const districtRates = [
  {
    id: "blue",
    bookingId: "blue",
    number: "01",
    shortName: "Blue",
    name: "Blue District",
    image: "room-blue-editorial.webp",
    eyebrow: "Modern music studio",
    hourly: "€30",
    hourlyLabel: "Studio only",
    producer: "€50 / hour",
    packages: [
      { label: "5h + 1h free", price: "€150 total", detail: "6 hours of studio time" },
      { label: "8h + 2h free", price: "€240 total", detail: "10 hours of studio time" }
    ],
    note: "Free-hour packages apply to studio-only bookings."
  },
  {
    id: "red",
    bookingId: "red",
    number: "02",
    shortName: "Red",
    name: "Red District",
    image: "room-red-editorial.webp",
    eyebrow: "Warm recording studio",
    hourly: "€25",
    hourlyLabel: "Studio only",
    producer: "€45 / hour",
    packages: [
      { label: "5h + 1h free", price: "€125 total", detail: "6 hours of studio time" },
      { label: "8h + 2h free", price: "€200 total", detail: "10 hours of studio time" }
    ],
    note: "Free-hour packages apply to studio-only bookings."
  },
  {
    id: "white",
    bookingId: "infinity",
    number: "03",
    shortName: "White",
    name: "White District",
    image: "room-infinity-editorial.webp",
    eyebrow: "Infinite photo studio",
    hourly: "€50",
    hourlyLabel: "Opening month",
    standardHourly: "€60 standard",
    packages: [
      { label: "3-hour package", price: "€120", detail: "Opening month", standard: "€150 package · €180 hourly value" },
      { label: "5-hour package", price: "€200", detail: "Opening month", standard: "€250 package · €300 hourly value" }
    ],
    note: "Opening prices are personally confirmed with your request."
  }
] as const;

export function NocturnePricing({ basePath }: { basePath: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previousIndexRef = useRef(0);
  const hasMountedRef = useRef(false);
  const active = districtRates[activeIndex];

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      previousIndexRef.current = activeIndex;
      return;
    }

    const direction = activeIndex >= previousIndexRef.current ? 1 : -1;
    previousIndexRef.current = activeIndex;
    const media = panel.querySelector<HTMLElement>("[data-nocturne-price-media]");
    const image = media?.querySelector<HTMLElement>("img") ?? null;
    const scan = panel.querySelector<HTMLElement>("[data-nocturne-price-scan]");
    const numbers = Array.from(panel.querySelectorAll<HTMLElement>("[data-nocturne-price-number]"));
    const rows = Array.from(panel.querySelectorAll<HTMLElement>("[data-nocturne-price-row]"));
    const cta = panel.querySelector<HTMLElement>("[data-nocturne-pricing-cta]");

    const context = gsap.context(() => {
      const timeline = gsap.timeline();
      timeline.fromTo(
        panel,
        { x: 16 * direction, autoAlpha: 0.68 },
        { x: 0, autoAlpha: 1, duration: 0.44, ease: "power3.out" },
        0
      );
      if (media) {
        timeline.fromTo(
          media,
          { clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
          { clipPath: "inset(0 0 0 0)", duration: 0.62, ease: "power4.inOut" },
          0
        );
      }
      if (image) {
        timeline.fromTo(
          image,
          { scale: 1.13, xPercent: direction * 2.5 },
          { scale: 1.04, xPercent: 0, duration: 0.78, ease: "power3.out" },
          0
        );
      }
      if (scan) {
        timeline.fromTo(
          scan,
          { xPercent: direction > 0 ? -120 : 120, autoAlpha: 0 },
          { xPercent: direction > 0 ? 120 : -120, autoAlpha: 0.85, duration: 0.58, ease: "power2.inOut" },
          0.03
        ).to(scan, { autoAlpha: 0, duration: 0.12 }, 0.55);
      }
      timeline.fromTo(
        numbers,
        { yPercent: 65, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, stagger: 0.045, duration: 0.42, ease: "power4.out" },
        0.18
      ).fromTo(
        rows,
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.055, duration: 0.4, ease: "power3.out" },
        0.24
      );
      if (cta) {
        timeline.fromTo(
          cta,
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.36, ease: "power3.out" },
          0.43
        );
      }
    }, panel);

    return () => context.revert();
  }, [activeIndex]);

  function selectDistrict(index: number, moveFocus = false) {
    setActiveIndex(index);
    if (moveFocus) tabRefs.current[index]?.focus();
  }

  function handleTabKeys(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + direction + districtRates.length) % districtRates.length;
    selectDistrict(next, true);
  }

  return (
    <section className={styles.nocturnePricing} id="nocturne-pricing" data-nocturne-pricing>
      <div className={styles.nocturnePricingHead} data-nocturne-pricing-head>
        <div>
          <p>Rates · Opening offers</p>
          <h2 aria-label="Choose your session.">
            <span aria-hidden="true" data-nocturne-pricing-word>Choose</span>
            <span aria-hidden="true" data-nocturne-pricing-word>your</span>
            <span aria-hidden="true" data-nocturne-pricing-word>session.</span>
          </h2>
        </div>
        <div className={styles.nocturnePricingIntro}>
          <p>Clear hourly rates. Better value when you stay longer.</p>
          <i data-nocturne-pricing-signal aria-hidden="true" />
        </div>
      </div>

      <div className={styles.nocturneRateConsole} data-nocturne-pricing-console>
        <div
          className={styles.nocturneRateTabs}
          role="tablist"
          aria-label="District pricing"
          data-nocturne-pricing-tabs
          onKeyDown={handleTabKeys}
        >
          {districtRates.map((district, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="nocturne-rate-panel"
              id={`nocturne-rate-tab-${district.id}`}
              tabIndex={index === activeIndex ? 0 : -1}
              data-active={index === activeIndex ? "true" : "false"}
              onClick={() => selectDistrict(index)}
              ref={(element) => { tabRefs.current[index] = element; }}
              key={district.id}
            >
              <span>{district.number}</span>
              <strong>{district.shortName}</strong>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>

        <article
          className={styles.nocturneRatePanel}
          id="nocturne-rate-panel"
          role="tabpanel"
          aria-labelledby={`nocturne-rate-tab-${active.id}`}
          data-district={active.id}
          data-nocturne-pricing-panel
          ref={panelRef}
        >
          <div className={styles.nocturneRateMedia} data-nocturne-price-media>
            <Image
              src={`${basePath}/${active.image}`}
              alt={`${active.name} interior`}
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
            />
            <span className={styles.nocturneRateMediaLabel}>
              <b>{active.number}</b>
              <strong>{active.name}</strong>
              <small>Antwerp</small>
            </span>
            <i className={styles.nocturneRateScan} data-nocturne-price-scan aria-hidden="true" />
          </div>

          <div className={styles.nocturneRateBody}>
            <header>
              <div>
                <p>{active.eyebrow}</p>
                <h3>{active.name}</h3>
              </div>
              {active.id === "white" && <span className={styles.nocturnePromoPill}>Opening month</span>}
            </header>

            <div className={styles.nocturneRateLead} data-nocturne-price-row>
              <span>{active.hourlyLabel}</span>
              <div>
                <strong data-nocturne-price-number>{active.hourly}</strong>
                <small>/ hour</small>
              </div>
              {"standardHourly" in active && <del>{active.standardHourly}</del>}
            </div>

            {"producer" in active && (
              <div className={styles.nocturneProducerRate} data-nocturne-price-row>
                <span>With producer</span>
                <strong data-nocturne-price-number>{active.producer}</strong>
              </div>
            )}

            <div className={styles.nocturnePackageList}>
              {active.packages.map((item) => (
                <div className={styles.nocturnePackageRow} data-nocturne-price-row key={item.label}>
                  <div><strong>{item.label}</strong><small>{item.detail}</small></div>
                  <div><b data-nocturne-price-number>{item.price}</b>{"standard" in item && <small>{item.standard}</small>}</div>
                </div>
              ))}
            </div>

            <p className={styles.nocturneRateNote} data-nocturne-price-row>{active.note}</p>
            <button
              className={styles.nocturneRateCta}
              type="button"
              data-booking={active.bookingId}
              data-nocturne-pricing-cta
              data-nocturne-magnetic
            >
              Book {active.name} <b aria-hidden="true">↗</b>
            </button>
          </div>
        </article>
      </div>

      <div className={styles.nocturnePricingServices} data-nocturne-pricing-services>
        <article data-nocturne-service-card>
          <header><span>Opening offer</span><small>Music finishing</small></header>
          <h3>Mix &amp; mastering</h3>
          <div><strong data-nocturne-price-number>€150</strong><del>€200</del></div>
          <a href="mailto:team@sounddistrict.be?subject=Mix%20%26%20mastering%20request" data-nocturne-pricing-cta>
            Request mix &amp; mastering <b aria-hidden="true">↗</b>
          </a>
        </article>
        <article data-nocturne-service-card>
          <header><span>Custom quote</span><small>Built around your project</small></header>
          <h3>Production</h3>
          <p>Production pricing is discussed per project.</p>
          <a href="mailto:team@sounddistrict.be?subject=Production%20inquiry" data-nocturne-pricing-cta>
            Discuss your production <b aria-hidden="true">↗</b>
          </a>
        </article>
      </div>

      <a
        className={styles.nocturneProjectContact}
        href="mailto:team@sounddistrict.be?subject=Larger%20project%20inquiry"
        data-nocturne-project-contact
      >
        <span>Planning a two-day shoot, a multi-day session or a larger project?</span>
        <strong>Contact us for a tailored quote</strong>
        <b aria-hidden="true">↗</b>
      </a>
    </section>
  );
}
