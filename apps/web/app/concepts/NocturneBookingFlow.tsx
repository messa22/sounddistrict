"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ROOMS, getRoom, type RoomId } from "@sounddistrict/booking-core";
import {
  calculateNocturnePrice,
  calculateNocturneStandardPrice,
  getNocturneOffer,
  getNocturneOffers,
  type NocturneBookingOffer,
  type NocturneOfferId
} from "./NocturneBookingData";
import {
  getDemoAvailableTimes,
  getDemoCalendarMonth
} from "./NocturneAvailabilityDemo";
import styles from "./concepts.module.css";

const steps = ["Session", "Agenda", "Details"] as const;
const timeGroups = [
  { label: "Night", range: "00–05", from: 0, to: 6 },
  { label: "Morning", range: "06–11", from: 6, to: 12 },
  { label: "Afternoon", range: "12–17", from: 12, to: 18 },
  { label: "Evening", range: "18–23", from: 18, to: 24 }
] as const;

const districtImages: Record<RoomId, string> = {
  blue: "room-blue-editorial.webp",
  red: "room-red-editorial.webp",
  infinity: "room-infinity-editorial.webp"
};

const districtLabels: Record<RoomId, string> = {
  blue: "Blue",
  red: "Red",
  infinity: "White"
};

function laterDate(value: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return {
    value,
    weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date),
    day: date.getDate(),
    month: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date),
    fullLabel: new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date)
  };
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

function sessionEnd(time: string, duration: number) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const total = hours * 60 + minutes + duration * 60;
  const endHours = Math.floor(total / 60) % 24;
  const suffix = total >= 24 * 60 ? " next day" : "";
  return `${String(endHours).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}${suffix}`;
}

export function NocturneBookingFlow({ basePath }: { basePath: string }) {
  const titleId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const previousStepRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [offerId, setOfferId] = useState<NocturneOfferId | null>(null);
  const [duration, setDuration] = useState(2);
  const [monthOffset, setMonthOffset] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const room = roomId ? getRoom(roomId) : null;
  const offers = roomId ? getNocturneOffers(roomId) : [];
  const offer = roomId && offerId ? getNocturneOffer(roomId, offerId) : null;
  const selectedDate = useMemo(() => laterDate(date), [date]);
  const calendarMonth = useMemo(() => getDemoCalendarMonth(monthOffset), [monthOffset]);
  const calendarAvailability = useMemo(() => new Map(
    calendarMonth.days.flatMap((item) => item && roomId && !item.isPast
      ? [[item.value, getDemoAvailableTimes(roomId, item.value, duration).length] as const]
      : [])
  ), [calendarMonth, duration, roomId]);
  const availableTimeSlots = useMemo(
    () => roomId && date ? getDemoAvailableTimes(roomId, date, duration) : [],
    [date, duration, roomId]
  );
  const quotedPrice = offer ? calculateNocturnePrice(offer, duration) : undefined;
  const standardPrice = offer ? calculateNocturneStandardPrice(offer, duration) : undefined;
  const saving = quotedPrice !== undefined && standardPrice !== undefined
    ? Math.max(0, standardPrice - quotedPrice)
    : 0;
  const valueUpgrade = roomId && roomId !== "infinity" && offer?.id === "studio-hourly"
    ? duration === 5
      ? getNocturneOffer(roomId, "six-hour")
      : duration === 7 || duration === 8
        ? getNocturneOffer(roomId, "ten-hour")
        : null
    : null;
  const valueUpgradePrice = valueUpgrade
    ? calculateNocturnePrice(valueUpgrade, valueUpgrade.defaultDuration)
    : undefined;
  const valueUpgradeDifference = valueUpgradePrice !== undefined && quotedPrice !== undefined
    ? Math.max(0, valueUpgradePrice - quotedPrice)
    : 0;

  useEffect(() => {
    function handleBookingClick(event: MouseEvent) {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const trigger = target?.closest<HTMLElement>("[data-booking]");
      if (!trigger) return;

      event.preventDefault();
      returnFocusRef.current = trigger;
      const requestedRoom = trigger.dataset.booking;
      const nextRoomId = ROOMS.some((item) => item.id === requestedRoom)
        ? requestedRoom as RoomId
        : null;
      const requestedOffer = trigger.dataset.bookingOffer;
      const matchingOffer = nextRoomId && requestedOffer
        ? getNocturneOffers(nextRoomId).find((item) => item.id === requestedOffer)
        : undefined;
      const nextOffer = nextRoomId
        ? matchingOffer ?? getNocturneOffers(nextRoomId)[0]
        : null;

      setRoomId(nextRoomId);
      setOfferId(nextOffer?.id ?? null);
      setDuration(nextOffer?.defaultDuration ?? 2);
      setMonthOffset(0);
      setDate("");
      setTime("");
      setName("");
      setEmail("");
      setPhone("");
      setNote("");
      setTermsAccepted(false);
      setAttempted(false);
      const nextStep = matchingOffer ? 1 : 0;
      previousStepRef.current = nextStep;
      setStep(nextStep);
      setOpen(true);
    }

    document.addEventListener("click", handleBookingClick);
    return () => document.removeEventListener("click", handleBookingClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("nocturne-booking-active");
    const previousOverflow = document.body.style.overflow;
    const rootStyle = document.documentElement.style;
    const previousViewportHeight = rootStyle.getPropertyValue("--booking-viewport-height");
    const previousViewportTop = rootStyle.getPropertyValue("--booking-viewport-top");
    const viewport = window.visualViewport;
    const root = document.querySelector<HTMLElement>("[data-nocturne-root]");
    const backgroundNodes = root && overlayRef.current
      ? Array.from(root.children).filter((element): element is HTMLElement => (
        element instanceof HTMLElement && element !== overlayRef.current
      ))
      : [];
    const previousInert = backgroundNodes.map((element) => element.inert);

    function updateViewport() {
      rootStyle.setProperty("--booking-viewport-height", `${Math.round(viewport?.height ?? window.innerHeight)}px`);
      rootStyle.setProperty("--booking-viewport-top", `${Math.round(viewport?.offsetTop ?? 0)}px`);
    }

    function handleKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeBooking();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.body.style.overflow = "hidden";
    backgroundNodes.forEach((element) => { element.inert = true; });
    updateViewport();
    window.setTimeout(() => closeRef.current?.focus(), 30);
    document.addEventListener("keydown", handleKeys);
    viewport?.addEventListener("resize", updateViewport);
    viewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);

    return () => {
      document.body.classList.remove("nocturne-booking-active");
      document.body.style.overflow = previousOverflow;
      backgroundNodes.forEach((element, index) => { element.inert = previousInert[index]; });
      if (previousViewportHeight) rootStyle.setProperty("--booking-viewport-height", previousViewportHeight);
      else rootStyle.removeProperty("--booking-viewport-height");
      if (previousViewportTop) rootStyle.setProperty("--booking-viewport-top", previousViewportTop);
      else rootStyle.removeProperty("--booking-viewport-top");
      document.removeEventListener("keydown", handleKeys);
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !overlayRef.current || !panelRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { yPercent: 102 },
        { yPercent: 0, duration: 0.58, ease: "power4.out" }
      );
    }, overlayRef);
    return () => context.revert();
  }, [open]);

  useLayoutEffect(() => {
    const element = stepRef.current;
    if (!open || !element || step === previousStepRef.current) return;
    const direction = step > previousStepRef.current ? 1 : -1;
    previousStepRef.current = step;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { x: direction * 18, y: 8, autoAlpha: 0 },
        { x: 0, y: 0, autoAlpha: 1, duration: 0.36, ease: "power3.out" }
      );
      gsap.fromTo(
        Array.from(element.querySelectorAll<HTMLElement>("[data-booking-row]")),
        { y: 13, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.035, duration: 0.32, ease: "power3.out" }
      );
    }, element);
    return () => context.revert();
  }, [open, step]);

  function finishClose() {
    setOpen(false);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }

  function closeBooking() {
    if (!overlayRef.current || !panelRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    gsap.to(panelRef.current, { yPercent: 102, duration: 0.34, ease: "power3.in" });
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.25,
      delay: 0.08,
      ease: "power2.in",
      onComplete: finishClose
    });
  }

  function chooseRoom(nextRoomId: RoomId) {
    const nextOffer = getNocturneOffers(nextRoomId)[0];
    setRoomId(nextRoomId);
    setOfferId(nextOffer.id);
    setDuration(nextOffer.defaultDuration);
    setDate("");
    setTime("");
    setAttempted(false);
  }

  function chooseOffer(nextOffer: NocturneBookingOffer) {
    setOfferId(nextOffer.id);
    setDuration(nextOffer.defaultDuration);
    setDate("");
    setTime("");
    setAttempted(false);
  }

  function chooseDuration(hours: number) {
    if (!offer) return;
    setDuration(hours);
    setDate("");
    setTime("");
    setAttempted(false);
  }

  function moveCalendarMonth(direction: -1 | 1) {
    setMonthOffset((current) => Math.min(5, Math.max(0, current + direction)));
    setDate("");
    setTime("");
    setAttempted(false);
  }

  function chooseCalendarDate(nextDate: string) {
    setDate(nextDate);
    setTime("");
    setAttempted(false);
  }

  function goToStep(nextStep: number) {
    setAttempted(false);
    setStep(nextStep);
    window.setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 0 });
      panelRef.current?.querySelector<HTMLElement>("[data-booking-heading]")?.focus();
    }, 30);
  }

  function canContinue() {
    if (step === 0) return Boolean(roomId && offer);
    if (step === 1) return Boolean(date && time);
    if (step === 2) return name.trim().length >= 2 && validEmail(email) && termsAccepted;
    return false;
  }

  function continueBooking() {
    if (!canContinue()) {
      setAttempted(true);
      window.setTimeout(() => {
        panelRef.current?.querySelector<HTMLElement>("[data-booking-invalid='true']")?.focus();
      }, 0);
      return;
    }
    if (step < 2) goToStep(step + 1);
    else openEmailRequest();
  }

  function buildEmailRequest() {
    if (!room || !offer || !selectedDate || !time || quotedPrice === undefined) return null;
    const body = [
      "Hi Sound District,",
      "",
      "I would like to request this session:",
      `District: ${room.name}`,
      `Session: ${offer.name}`,
      `Duration: ${duration} ${duration === 1 ? "hour" : "hours"}`,
      `Preferred date: ${selectedDate.fullLabel}`,
      `Preferred time: ${time}–${sessionEnd(time, duration)}`,
      `Estimated price: ${formatPrice(quotedPrice)}`,
      offer.promoLabel ? `Offer: ${offer.promoLabel}` : "",
      saving > 0 ? `Saving shown: ${formatPrice(saving)}` : "",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Phone: ${phone.trim() || "Not provided"}`,
      `Project: ${note.trim() || "No additional information"}`,
      "",
      "Demo note: this preferred time was selected from sample availability; live calendar availability has not been checked.",
      "Please confirm availability and final pricing."
    ].filter(Boolean).join("\n");
    const subject = `Session request · ${room.name} · ${offer.name}`;
    return `mailto:team@sounddistrict.be?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function openEmailRequest() {
    const request = buildEmailRequest();
    if (!request) return;
    setStep(3);
    window.setTimeout(() => { window.location.href = request; }, 0);
  }

  if (!open) return null;

  const currentPrice = quotedPrice === undefined ? "Choose a session" : formatPrice(quotedPrice);
  const durationLabel = `${duration} ${duration === 1 ? "hour" : "hours"}`;

  return (
    <div
      className={styles.nocturneBookingOverlay}
      data-district={roomId ?? "open"}
      ref={overlayRef}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeBooking();
      }}
    >
      <section
        className={styles.nocturneBookingSheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
      >
        <header className={styles.nocturneBookingTopbar}>
          <div>
            <i aria-hidden="true" />
            <span>Sound District</span>
            <strong id={titleId}>Book your session</strong>
          </div>
          <button type="button" onClick={closeBooking} ref={closeRef} aria-label="Close booking">
            Close <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className={styles.nocturneBookingProgress} aria-label={step < 3 ? `Step ${step + 1} of 3` : "Request prepared"}>
          <span>{step < 3 ? `0${step + 1} / 03 · ${steps[step]}` : "Request prepared"}</span>
          <div aria-hidden="true"><i style={{ transform: `scaleX(${step < 3 ? (step + 1) / 3 : 1})` }} /></div>
          {step < 3 && <ol>{steps.map((label, index) => <li data-active={index <= step} key={label}>{label}</li>)}</ol>}
        </div>

        <div className={styles.nocturneBookingContext} data-logo={!roomId ? "true" : "false"}>
          <div className={`${styles.nocturneBookingThumb} ${!roomId ? styles.nocturneBookingLogoThumb : ""}`}>
            {roomId ? (
              <Image src={`${basePath}/${districtImages[roomId]}`} alt="" fill sizes="72px" />
            ) : (
              <Image
                src={`${basePath}/sounddistrict-logo-hq.png`}
                alt="Sound District Antwerp"
                fill
                sizes="112px"
              />
            )}
          </div>
          <div>
            <span>{room ? room.name : "Choose your district"}</span>
            <strong>{offer ? `${offer.name} · ${durationLabel}` : "Your rate stays with you"}</strong>
            {selectedDate && time && <small>{selectedDate.weekday} {selectedDate.day} {selectedDate.month} · {time}–{sessionEnd(time, duration)}</small>}
          </div>
          <div>
            {saving > 0 && <del>{standardPrice !== undefined ? formatPrice(standardPrice) : ""}</del>}
            <strong>{currentPrice}</strong>
            {offer?.promoLabel && <small>{offer.promoLabel}</small>}
          </div>
        </div>

        <div className={styles.nocturneBookingScroll} ref={scrollRef}>
          <div className={styles.nocturneBookingStep} ref={stepRef}>
            {step === 0 && (
              <div>
                <p className={styles.nocturneBookingEyebrow}>01 · Build your session</p>
                <h2 tabIndex={-1} data-booking-heading>Choose the right setup.</h2>
                <p className={styles.nocturneBookingIntro}>District, rate and duration stay connected all the way through your request.</p>

                <fieldset data-booking-row>
                  <legend>District</legend>
                  <div className={styles.nocturneBookingDistricts}>
                    {ROOMS.map((item) => (
                      <button
                        type="button"
                        data-selected={roomId === item.id}
                        aria-pressed={roomId === item.id}
                        onClick={() => chooseRoom(item.id)}
                        key={item.id}
                      >
                        <span><Image src={`${basePath}/${districtImages[item.id]}`} alt="" fill sizes="96px" /></span>
                        <strong>{districtLabels[item.id]}</strong>
                        <small>District</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {roomId && (
                  <fieldset data-booking-row>
                    <legend>Session plan</legend>
                    <div className={styles.nocturneBookingOffers}>
                      {offers.map((item) => {
                        const itemPrice = item.pricePerHour
                          ?? calculateNocturnePrice(item, item.defaultDuration);
                        return (
                          <button
                            type="button"
                            data-selected={offer?.id === item.id}
                            aria-pressed={offer?.id === item.id}
                            onClick={() => chooseOffer(item)}
                            key={item.id}
                          >
                            <span><strong>{item.name}</strong><small>{item.description}</small></span>
                            <span>
                              {item.badge && <em>{item.badge}</em>}
                              {item.promoLabel && <em>{item.promoLabel}</em>}
                              <b>{formatPrice(itemPrice)}{item.pricePerHour ? " / hour" : ""}</b>
                              {item.standardPrice !== undefined && <del>{formatPrice(item.standardPrice)}{item.pricePerHour ? " / hour" : ""}</del>}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {offer?.durationOptions && (
                  <fieldset data-booking-row>
                    <legend>Duration</legend>
                    <div className={styles.nocturneBookingDurations}>
                      {offer.durationOptions.map((hours) => (
                        <button
                          type="button"
                          data-selected={duration === hours}
                          aria-pressed={duration === hours}
                          onClick={() => chooseDuration(hours)}
                          key={hours}
                        >
                          <strong>{hours}h</strong>
                          <small>{formatPrice(calculateNocturnePrice(offer, hours))}</small>
                          {offer.durationPrices?.[hours] !== undefined && <em>Package rate</em>}
                        </button>
                      ))}
                    </div>
                    {valueUpgrade && valueUpgradePrice !== undefined && (
                      <button
                        className={styles.nocturneBookingUpgrade}
                        type="button"
                        onClick={() => chooseOffer(valueUpgrade)}
                      >
                        <span>
                          <small>{valueUpgradeDifference === 0 ? "Better value · same total" : `Better value · ${formatPrice(valueUpgradeDifference)} more`}</small>
                          <strong>Get {valueUpgrade.defaultDuration} hours instead</strong>
                          <em>{valueUpgrade.defaultDuration === 6 ? "5 hours + 1 hour free" : "8 hours + 2 hours free"}</em>
                        </span>
                        <b>{formatPrice(valueUpgradePrice)}<i aria-hidden="true">→</i></b>
                      </button>
                    )}
                  </fieldset>
                )}

                {attempted && (!roomId || !offer) && <p className={styles.nocturneBookingError} role="alert">Choose a district and session plan.</p>}
              </div>
            )}

            {step === 1 && (
              <div>
                <p className={styles.nocturneBookingEyebrow}>02 · Agenda example</p>
                <h2 tabIndex={-1} data-booking-heading>Preview the availability agenda.</h2>
                <p className={styles.nocturneBookingIntro}>The agenda filters sample openings to times where your complete {durationLabel} session fits.</p>

                <aside className={styles.nocturneBookingDemoNotice} data-booking-row>
                  <span>Demo agenda</span>
                  <div>
                    <strong>Sample openings only</strong>
                    <p>Google Calendar is not connected yet. These times are an interactive example and no slot is being held.</p>
                  </div>
                </aside>

                <fieldset data-booking-row>
                  <legend>Choose a day</legend>
                  <div className={styles.nocturneBookingCalendar}>
                    <header>
                      <button type="button" onClick={() => moveCalendarMonth(-1)} disabled={monthOffset === 0} aria-label="Previous month">←</button>
                      <div><small>Open 24/7</small><strong>{calendarMonth.label}</strong></div>
                      <button type="button" onClick={() => moveCalendarMonth(1)} disabled={monthOffset === 5} aria-label="Next month">→</button>
                    </header>
                    <div className={styles.nocturneBookingWeekdays} aria-hidden="true">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => <span key={label}>{label}</span>)}
                    </div>
                    <div className={styles.nocturneBookingMonthGrid}>
                      {calendarMonth.days.map((item, index) => {
                        if (!item) return <i aria-hidden="true" key={`empty-${index}`} />;
                        const sampleCount = calendarAvailability.get(item.value) ?? 0;
                        const unavailable = item.isPast || sampleCount === 0;
                        return (
                          <button
                            type="button"
                            disabled={unavailable}
                            data-selected={date === item.value}
                            aria-pressed={date === item.value}
                            aria-label={`${item.fullLabel}. ${item.isPast ? "Past date" : sampleCount ? `${sampleCount} sample start times` : "No sample opening"}`}
                            onClick={() => chooseCalendarDate(item.value)}
                            data-booking-invalid={attempted && !date && !unavailable ? "true" : undefined}
                            key={item.value}
                          >
                            <strong>{item.day}</strong>
                            {!item.isPast && <small>{sampleCount ? `${sampleCount} slots` : "No sample"}</small>}
                            {sampleCount > 0 && <span aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                    <footer><span><i /> Sample opening</span><span><i /> Selected</span><span>Dimmed · unavailable in demo</span></footer>
                  </div>
                </fieldset>

                {selectedDate ? (
                  <fieldset data-booking-row>
                    <legend>Sample start times</legend>
                    <div className={styles.nocturneBookingAvailabilityHead}>
                      <span><i aria-hidden="true" /> {availableTimeSlots.length} sample openings</span>
                      <strong>{selectedDate.fullLabel}</strong>
                      <small>{durationLabel} session · Starts every hour · Open 24/7</small>
                    </div>
                    <div className={styles.nocturneBookingTimeGroups}>
                      {timeGroups.map((group) => {
                        const groupSlots = availableTimeSlots.filter((slot) => {
                          const hour = Number(slot.slice(0, 2));
                          return hour >= group.from && hour < group.to;
                        });
                        if (!groupSlots.length) return null;
                        return (
                          <section key={group.label}>
                            <header><strong>{group.label}</strong><small>{group.range}</small></header>
                            <div>
                              {groupSlots.map((slot) => (
                                <button
                                  type="button"
                                  data-selected={time === slot}
                                  aria-pressed={time === slot}
                                  aria-label={`${slot} until ${sessionEnd(slot, duration)}. Suggested in demo.`}
                                  onClick={() => setTime(slot)}
                                  data-booking-invalid={attempted && !time ? "true" : undefined}
                                  key={slot}
                                >
                                  <strong>{slot}</strong>
                                  <small>to {sessionEnd(slot, duration)}</small>
                                </button>
                              ))}
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : (
                  <div className={styles.nocturneBookingAgendaPrompt} data-booking-row>
                    <span aria-hidden="true">↓</span>
                    <strong>Select a day to see sample start times</strong>
                    <small>Only suggestions that fit the full session will appear.</small>
                  </div>
                )}
                {attempted && (!date || !time) && <p className={styles.nocturneBookingError} role="alert">Choose a sample day and preferred start time.</p>}
              </div>
            )}

            {step === 2 && (
              <div>
                <p className={styles.nocturneBookingEyebrow}>03 · Your details</p>
                <h2 tabIndex={-1} data-booking-heading>Tell us what you’re making.</h2>
                <p className={styles.nocturneBookingIntro}>Your selected district, plan and estimated price are already included.</p>

                <div className={styles.nocturneBookingForm} data-booking-row>
                  <label>
                    Full name *
                    <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" data-booking-invalid={attempted && name.trim().length < 2 ? "true" : undefined} />
                    {attempted && name.trim().length < 2 && <small>Enter at least 2 characters.</small>}
                  </label>
                  <label>
                    Email *
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" data-booking-invalid={attempted && !validEmail(email) ? "true" : undefined} />
                    {attempted && !validEmail(email) && <small>Enter a valid email address.</small>}
                  </label>
                  <label>
                    Phone <span>optional</span>
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" />
                  </label>
                  <label className={styles.nocturneBookingProject}>
                    About your session <span>optional</span>
                    <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} maxLength={600} placeholder="What would you like to record, produce or shoot?" />
                  </label>
                </div>

                <div className={styles.nocturneBookingReview} data-booking-row>
                  <span>Selected session</span>
                  <strong>{room?.name} · {offer?.name}</strong>
                  <small>{selectedDate?.fullLabel} · {time}–{sessionEnd(time, duration)} · {currentPrice}</small>
                  {saving > 0 && <em>You save {formatPrice(saving)}</em>}
                </div>

                <div className={styles.nocturneBookingTruth} data-booking-row>
                  <strong>Demo timing · personal confirmation</strong>
                  <p>This preferred time comes from sample availability and is not being held. The live version will check the district’s Google Calendar before booking.</p>
                </div>

                <label className={styles.nocturneBookingTerms} data-booking-row>
                  <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} data-booking-invalid={attempted && !termsAccepted ? "true" : undefined} />
                  <span>I agree that my details may be used to respond to this request. <a href={`${basePath}/privacy/`} target="_blank" rel="noreferrer">Privacy information</a>.</span>
                </label>
                {attempted && !termsAccepted && <p className={styles.nocturneBookingError} role="alert">Accept the privacy information to continue.</p>}
              </div>
            )}

            {step === 3 && (
              <div className={styles.nocturneBookingPrepared}>
                <p className={styles.nocturneBookingEyebrow}>Request prepared</p>
                <h2 tabIndex={-1} data-booking-heading>One last tap in your email app.</h2>
                <p>Your full session and price are already filled in. Send the email so Sound District receives your request.</p>
                <div><strong>{room?.name}</strong><span>{offer?.name} · {durationLabel}</span><span>{selectedDate?.fullLabel} · {time}</span><b>{currentPrice}</b></div>
                <button type="button" onClick={openEmailRequest}>Open email again <span aria-hidden="true">↗</span></button>
                <button type="button" onClick={closeBooking}>Back to the website</button>
              </div>
            )}
          </div>
        </div>

        {step < 3 && (
          <footer className={styles.nocturneBookingFooter}>
            <div>
              <span>{offer?.promoLabel ?? (saving > 0 ? `Save ${formatPrice(saving)}` : "Estimated total")}</span>
              <strong>{currentPrice}</strong>
            </div>
            <div>
              {step > 0 && <button type="button" onClick={() => goToStep(step - 1)}>Back</button>}
              <button type="button" onClick={continueBooking}>
                {step === 0
                  ? `View sample agenda · ${currentPrice}`
                  : step === 1
                    ? !date
                      ? "Choose a sample day"
                      : !time
                        ? "Choose a sample time"
                        : `Use preferred time · ${time}`
                    : `Continue in email · ${currentPrice}`}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}
