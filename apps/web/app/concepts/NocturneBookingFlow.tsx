"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ROOMS, TIME_SLOTS, getRoom, type RoomId } from "@sounddistrict/booking-core";
import {
  calculateNocturnePrice,
  calculateNocturneStandardPrice,
  getNocturneOffer,
  getNocturneOffers,
  type NocturneBookingOffer,
  type NocturneOfferId
} from "./NocturneBookingData";
import styles from "./concepts.module.css";

const steps = ["Session", "Moment", "Details"] as const;

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

function nextDates() {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
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
  });
}

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
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const dateOptions = useMemo(nextDates, []);
  const room = roomId ? getRoom(roomId) : null;
  const offers = roomId ? getNocturneOffers(roomId) : [];
  const offer = roomId && offerId ? getNocturneOffer(roomId, offerId) : null;
  const selectedDate = useMemo(
    () => dateOptions.find((item) => item.value === date) ?? laterDate(date),
    [date, dateOptions]
  );
  const quotedPrice = offer ? calculateNocturnePrice(offer, duration) : undefined;
  const standardPrice = offer ? calculateNocturneStandardPrice(offer, duration) : undefined;
  const saving = quotedPrice !== undefined && standardPrice !== undefined
    ? Math.max(0, standardPrice - quotedPrice)
    : 0;
  const availableTimeSlots = useMemo(() => TIME_SLOTS.filter((slot) => {
    const [hours, minutes] = slot.split(":").map(Number);
    return hours * 60 + minutes + duration * 60 <= 24 * 60;
  }), [duration]);

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
    setTime("");
    setAttempted(false);
  }

  function chooseOffer(nextOffer: NocturneBookingOffer) {
    setOfferId(nextOffer.id);
    setDuration(nextOffer.defaultDuration);
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

        <div className={styles.nocturneBookingContext}>
          <div className={styles.nocturneBookingThumb}>
            {roomId ? (
              <Image src={`${basePath}/${districtImages[roomId]}`} alt="" fill sizes="72px" />
            ) : (
              <span aria-hidden="true">SD</span>
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
                        const itemPrice = calculateNocturnePrice(item, item.defaultDuration);
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
                          onClick={() => { setDuration(hours); setTime(""); }}
                          key={hours}
                        >
                          <strong>{hours}h</strong>
                          <small>{formatPrice(calculateNocturnePrice(offer, hours))}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {attempted && (!roomId || !offer) && <p className={styles.nocturneBookingError} role="alert">Choose a district and session plan.</p>}
              </div>
            )}

            {step === 1 && (
              <div>
                <p className={styles.nocturneBookingEyebrow}>02 · Preferred moment</p>
                <h2 tabIndex={-1} data-booking-heading>Choose a date and time.</h2>
                <p className={styles.nocturneBookingIntro}>We personally confirm availability after receiving your request.</p>

                <fieldset data-booking-row>
                  <legend>Date</legend>
                  <div className={styles.nocturneBookingDates}>
                    {dateOptions.map((item) => (
                      <button
                        type="button"
                        data-selected={date === item.value}
                        aria-pressed={date === item.value}
                        aria-label={item.fullLabel}
                        onClick={() => setDate(item.value)}
                        key={item.value}
                      >
                        <small>{item.weekday}</small><strong>{item.day}</strong><span>{item.month}</span>
                      </button>
                    ))}
                  </div>
                  <label className={styles.nocturneBookingCustomDate}>
                    <span>Later date</span>
                    <input
                      type="date"
                      min={dateOptions[0]?.value}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      data-booking-invalid={attempted && !date ? "true" : undefined}
                    />
                  </label>
                </fieldset>

                <fieldset data-booking-row>
                  <legend>Start time</legend>
                  <div className={styles.nocturneBookingTimes}>
                    {availableTimeSlots.map((slot) => (
                      <button
                        type="button"
                        data-selected={time === slot}
                        aria-pressed={time === slot}
                        onClick={() => setTime(slot)}
                        data-booking-invalid={attempted && !time ? "true" : undefined}
                        key={slot}
                      >
                        <strong>{slot}</strong>
                        <small>until {sessionEnd(slot, duration)}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
                {attempted && (!date || !time) && <p className={styles.nocturneBookingError} role="alert">Choose a preferred date and start time.</p>}
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
                  <strong>One transparent final step</strong>
                  <p>The website prepares your complete request. Send the pre-filled email so the team can confirm availability and final pricing.</p>
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
                {step === 0 ? `Choose a moment · ${currentPrice}` : step === 1 ? "Your details" : `Continue in email · ${currentPrice}`}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}
