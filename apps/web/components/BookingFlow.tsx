"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ADD_ONS,
  ROOMS,
  TIME_SLOTS,
  getRoom,
  type RoomId
} from "@sounddistrict/booking-core";

const steps = ["Sessie", "Details", "Controle"];

const editorialImages: Record<RoomId, string> = {
  blue: "room-blue-editorial.webp",
  red: "room-red-editorial.webp",
  infinity: "room-infinity-editorial.webp"
};

function upcomingDates() {
  return Array.from({ length: 10 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      weekday: new Intl.DateTimeFormat("nl-BE", { weekday: "short" }).format(date),
      day: date.getDate(),
      month: new Intl.DateTimeFormat("nl-BE", { month: "short" }).format(date),
      fullLabel: new Intl.DateTimeFormat("nl-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date)
    };
  });
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function naturalList(items: string[]) {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} en ${items.at(-1)}`;
}

function dateDetails(value: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return {
    value,
    weekday: new Intl.DateTimeFormat("nl-BE", { weekday: "short" }).format(parsed),
    day: parsed.getDate(),
    month: new Intl.DateTimeFormat("nl-BE", { month: "short" }).format(parsed),
    fullLabel: new Intl.DateTimeFormat("nl-BE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(parsed)
  };
}

export function BookingFlow() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const titleId = useId();
  const nameErrorId = useId();
  const emailErrorId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(2);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [roomChooserOpen, setRoomChooserOpen] = useState(true);
  const [sessionAttempted, setSessionAttempted] = useState(false);
  const [detailsAttempted, setDetailsAttempted] = useState(false);
  const [termsAttempted, setTermsAttempted] = useState(false);

  const dateOptions = useMemo(upcomingDates, []);
  const room = getRoom(roomId ?? "red");
  const selectedDate = useMemo(
    () => dateOptions.find((item) => item.value === date) ?? dateDetails(date),
    [date, dateOptions]
  );
  const nameInvalid = detailsAttempted && name.trim().length < 2;
  const emailInvalid = (detailsAttempted || Boolean(email)) && !validEmail(email);
  const missingSessionFields = [
    !roomId ? "een room" : "",
    !date ? "een datum" : "",
    !time ? "een startuur" : ""
  ].filter(Boolean);

  useEffect(() => {
    function handleBookingClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const trigger = target.closest<HTMLElement>("[data-booking]");
      if (!trigger) return;

      event.preventDefault();
      const returnFocusSelector = trigger.dataset.bookingReturnFocus;
      returnFocusRef.current = returnFocusSelector
        ? document.querySelector<HTMLElement>(returnFocusSelector) ?? trigger
        : trigger;
      const requestedRoom = trigger.dataset.booking as RoomId | "open" | undefined;
      const requestedRoomId = requestedRoom && ROOMS.some((item) => item.id === requestedRoom)
        ? requestedRoom as RoomId
        : null;
      setRoomId(requestedRoomId);
      setRoomChooserOpen(!requestedRoomId);
      setDate("");
      setTime("");
      setDuration(2);
      setAddOnIds([]);
      setName("");
      setEmail("");
      setPhone("");
      setNote("");
      setTermsAccepted(false);
      setSessionAttempted(false);
      setDetailsAttempted(false);
      setTermsAttempted(false);
      setStep(0);
      setOpen(true);
    }

    document.addEventListener("click", handleBookingClick);
    return () => document.removeEventListener("click", handleBookingClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const rootStyle = document.documentElement.style;
    const previousViewportHeight = rootStyle.getPropertyValue("--booking-viewport-height");
    const previousViewportTop = rootStyle.getPropertyValue("--booking-viewport-top");
    const visualViewport = window.visualViewport;

    function updateViewport() {
      const height = visualViewport?.height ?? window.innerHeight;
      const top = visualViewport?.offsetTop ?? 0;
      rootStyle.setProperty("--booking-viewport-height", `${Math.round(height)}px`);
      rootStyle.setProperty("--booking-viewport-top", `${Math.round(top)}px`);
    }

    document.body.style.overflow = "hidden";
    updateViewport();
    window.setTimeout(() => closeRef.current?.focus(), 20);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeBooking();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex='-1'])"
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

    document.addEventListener("keydown", onKeyDown);
    visualViewport?.addEventListener("resize", updateViewport);
    visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousViewportHeight) rootStyle.setProperty("--booking-viewport-height", previousViewportHeight);
      else rootStyle.removeProperty("--booking-viewport-height");
      if (previousViewportTop) rootStyle.setProperty("--booking-viewport-top", previousViewportTop);
      else rootStyle.removeProperty("--booking-viewport-top");
      document.removeEventListener("keydown", onKeyDown);
      visualViewport?.removeEventListener("resize", updateViewport);
      visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [open]);

  function closeBooking() {
    setOpen(false);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }

  function toggleAddOn(id: string) {
    setAddOnIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function canContinue() {
    if (step === 0) return Boolean(roomId && date && time && duration);
    if (step === 1) return name.trim().length >= 2 && validEmail(email);
    if (step === 2) return termsAccepted;
    return false;
  }

  function buildEmailRequest() {
    if (!roomId || !selectedDate) return null;
    const extras = addOnIds.length
      ? ADD_ONS.filter((item) => addOnIds.includes(item.id)).map((item) => item.name).join(", ")
      : "Geen extra support gekozen";
    const subject = `Boekingsaanvraag ${room.name} — ${selectedDate.fullLabel}`;
    const body = [
      "Hallo SoundDistrict,",
      "",
      "Ik wil graag deze sessie aanvragen:",
      `Room: ${room.name}`,
      `Voorkeursmoment: ${selectedDate.fullLabel} om ${time}`,
      `Duur: ${duration} uur`,
      `Extra support: ${extras}`,
      "",
      `Naam: ${name.trim()}`,
      `E-mail: ${email.trim()}`,
      `Telefoon: ${phone.trim() || "Niet opgegeven"}`,
      `Project: ${note.trim() || "Geen extra informatie"}`,
      "",
      "Graag ontvang ik een bevestiging van beschikbaarheid en prijs.",
      ""
    ].join("\n");

    return `mailto:team@sounddistrict.be?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function openEmailRequest() {
    const emailRequest = buildEmailRequest();
    if (!emailRequest) return;
    goToStep(3);
    window.setTimeout(() => {
      window.location.href = emailRequest;
    }, 0);
  }

  function retryEmailRequest() {
    const emailRequest = buildEmailRequest();
    if (emailRequest) window.location.href = emailRequest;
  }

  function goToStep(nextStep: number) {
    setStep(nextStep);
    window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-step-heading]")?.focus();
    }, 0);
  }

  function continueBooking() {
    if (step === 0 && !canContinue()) {
      setSessionAttempted(true);
      window.setTimeout(() => {
        const missingField = dialogRef.current?.querySelector<HTMLElement>("[data-booking-missing='true']");
        const focusTarget = missingField?.querySelector<HTMLElement>("button, input");
        missingField?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "center"
        });
        focusTarget?.focus({ preventScroll: true });
      }, 0);
      return;
    }

    if (step === 1 && !canContinue()) {
      setDetailsAttempted(true);
      window.setTimeout(() => {
        dialogRef.current?.querySelector<HTMLElement>("[data-booking-invalid='true']")?.focus();
      }, 0);
      return;
    }

    if (step === 2 && !canContinue()) {
      setTermsAttempted(true);
      window.setTimeout(() => {
        dialogRef.current?.querySelector<HTMLInputElement>(".terms-check input")?.focus();
      }, 0);
      return;
    }

    setSessionAttempted(false);
    setDetailsAttempted(false);
    setTermsAttempted(false);
    if (step === 2) openEmailRequest();
    else goToStep(step + 1);
  }

  return (
    <>
      <button className="mobile-booking-cta" type="button" data-booking="open">
        Kies room &amp; moment <span aria-hidden="true">↗</span>
      </button>

      {open && (
        <div className="booking-overlay">
          <section className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
            <header className="booking-topbar">
              <div>
                <span>SoundDistrict · Antwerp</span>
                <strong id={titleId}>Vraag je sessie aan</strong>
              </div>
              <button ref={closeRef} type="button" onClick={closeBooking} aria-label="Sluit boekingsaanvraag">Sluiten <span aria-hidden="true">×</span></button>
            </header>

            <div className="booking-layout">
              <aside className="booking-art" aria-hidden="true">
                <Image src={`${basePath}/${editorialImages[room.id]}`} alt="" fill sizes="38vw" />
                <div><span>{roomId ? room.name : "SoundDistrict"}</span><small>Stadswaag 20 · Antwerpen</small></div>
              </aside>

              <div className="booking-interface">
                {step < 3 && (
                  <ol className="booking-progress" aria-label={`Stap ${step + 1} van ${steps.length}`}>
                    {steps.map((label, index) => (
                      <li className={index <= step ? "active" : ""} aria-current={index === step ? "step" : undefined} key={label}>
                        <span>0{index + 1}</span>{label}
                      </li>
                    ))}
                  </ol>
                )}

                <div className="booking-scroll" aria-live="polite">
                  {step === 0 && (
                    <div className="booking-step">
                      <p className="booking-eyebrow">Stap 1 · Jouw sessie</p>
                      <h2 tabIndex={-1} data-step-heading>Kies je room en moment.</h2>
                      <p className="booking-intro">Kies een room en voorkeursmoment. We bevestigen de beschikbaarheid persoonlijk.</p>
                      {sessionAttempted && missingSessionFields.length > 0 && (
                        <p className="booking-error-summary" role="alert">
                          Kies nog {naturalList(missingSessionFields)}.
                        </p>
                      )}

                      <fieldset data-booking-missing={sessionAttempted && !roomId ? "true" : undefined}>
                        <legend>Room</legend>
                        {roomId && !roomChooserOpen ? (
                          <div className="booking-room-selected">
                            <span className="booking-room-thumb" style={{ backgroundImage: `url(${basePath}/${editorialImages[roomId]})` }} />
                            <span><small>Gekozen room</small><strong>{room.name}</strong></span>
                            <button type="button" onClick={() => setRoomChooserOpen(true)}>Wijzig</button>
                          </div>
                        ) : (
                          <div className="booking-room-grid">
                            {ROOMS.map((item) => (
                              <button
                                type="button"
                                className={roomId === item.id ? "selected" : ""}
                                aria-pressed={roomId === item.id}
                                onClick={() => {
                                  setRoomId(item.id);
                                  setRoomChooserOpen(false);
                                }}
                                key={item.id}
                              >
                                <span className="booking-room-thumb" style={{ backgroundImage: `url(${basePath}/${editorialImages[item.id]})` }} />
                                <span><strong>{item.name}</strong><small>{item.features[0]}</small></span>
                                <i aria-hidden="true">{roomId === item.id ? "✓" : ""}</i>
                              </button>
                            ))}
                          </div>
                        )}
                      </fieldset>

                      <fieldset data-booking-missing={sessionAttempted && !date ? "true" : undefined}>
                        <legend>Voorkeursdatum</legend>
                        <div className="date-options">
                          {dateOptions.map((item) => (
                            <button
                              type="button"
                              className={date === item.value ? "selected" : ""}
                              aria-pressed={date === item.value}
                              onClick={() => setDate(item.value)}
                              key={item.value}
                              aria-label={item.fullLabel}
                            >
                              <small>{item.weekday}</small><strong>{item.day}</strong><span>{item.month}</span>
                            </button>
                          ))}
                        </div>
                        <label className="custom-date">
                          <span>Of kies een latere datum</span>
                          <input
                            type="date"
                            min={dateOptions[0]?.value}
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                          />
                        </label>
                      </fieldset>

                      <div className="moment-grid">
                        <fieldset data-booking-missing={sessionAttempted && !time ? "true" : undefined}>
                          <legend>Startuur</legend>
                          <div className="choice-grid times">
                            {TIME_SLOTS.map((slot) => (
                              <button type="button" className={time === slot ? "selected" : ""} aria-pressed={time === slot} onClick={() => setTime(slot)} key={slot}>{slot}</button>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset>
                          <legend>Duur</legend>
                          <div className="choice-grid duration">
                            {[1, 2, 3, 4].map((hours) => (
                              <button type="button" className={duration === hours ? "selected" : ""} aria-pressed={duration === hours} onClick={() => setDuration(hours)} key={hours}>{hours}u</button>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="booking-step">
                      <p className="booking-eyebrow">Stap 2 · Details</p>
                      <h2 tabIndex={-1} data-step-heading>Vertel ons wat je komt maken.</h2>
                      <div className="form-grid">
                        <label className="field-label">
                          Volledige naam *
                          <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            required
                            aria-invalid={nameInvalid}
                            aria-describedby={nameInvalid ? nameErrorId : undefined}
                            data-booking-invalid={nameInvalid ? "true" : undefined}
                          />
                          {nameInvalid && <span className="field-error" id={nameErrorId} role="alert">Vul minstens 2 tekens in.</span>}
                        </label>
                        <label className="field-label">
                          E-mail *
                          <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            autoComplete="email"
                            required
                            aria-invalid={emailInvalid}
                            aria-describedby={emailInvalid ? emailErrorId : undefined}
                            data-booking-invalid={emailInvalid ? "true" : undefined}
                          />
                          {emailInvalid && <span className="field-error" id={emailErrorId} role="alert">Vul een geldig e-mailadres in.</span>}
                        </label>
                        <label className="field-label full">Telefoon <span>optioneel</span><input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" /></label>
                        <label className="field-label full">Over je sessie <span>optioneel</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Wat wil je opnemen of maken?" maxLength={500} rows={4} /></label>
                      </div>

                      <details className="extras-disclosure">
                        <summary>Extra support toevoegen <span>{addOnIds.length ? `${addOnIds.length} gekozen` : "Optioneel"}</span></summary>
                        <div className="addon-list">
                          {ADD_ONS.map((addOn) => (
                            <button type="button" className={addOnIds.includes(addOn.id) ? "selected" : ""} aria-pressed={addOnIds.includes(addOn.id)} onClick={() => toggleAddOn(addOn.id)} key={addOn.id}>
                              <i aria-hidden="true">{addOnIds.includes(addOn.id) ? "✓" : "+"}</i>
                              <span><strong>{addOn.name}</strong><small>{addOn.description}</small></span>
                            </button>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="booking-step review-step">
                      <p className="booking-eyebrow">Stap 3 · Controle</p>
                      <h2 tabIndex={-1} data-step-heading>Klaar om aan te vragen.</h2>
                      <div className="booking-summary">
                        <div><span>Room</span><strong>{room.name}</strong><button type="button" onClick={() => goToStep(0)}>Wijzig</button></div>
                        <div><span>Moment</span><strong>{selectedDate?.fullLabel} · {time} · {duration} uur</strong><button type="button" onClick={() => goToStep(0)}>Wijzig</button></div>
                        <div><span>Support</span><strong>{addOnIds.length ? ADD_ONS.filter((item) => addOnIds.includes(item.id)).map((item) => item.name).join(", ") : "Geen extra support"}</strong><button type="button" onClick={() => goToStep(1)}>Wijzig</button></div>
                        <div><span>Contact</span><strong>{name} · {email}</strong><button type="button" onClick={() => goToStep(1)}>Wijzig</button></div>
                      </div>
                      <div className="booking-truth">
                        <strong>Wat gebeurt hierna?</strong>
                        <p>Je aanvraag is pas verstuurd nadat jij de ingevulde e-mail verzendt. Daarna bevestigt het team beschikbaarheid en prijs.</p>
                      </div>
                      <label className="terms-check">
                        <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
                        <span>
                          Ik ga akkoord dat mijn gegevens worden gebruikt om deze boekingsaanvraag te beantwoorden.{" "}
                          <a href={`${basePath}/privacy/`} target="_blank" rel="noreferrer">Lees de privacy-info.</a>
                        </span>
                      </label>
                      {termsAttempted && !termsAccepted && <p className="terms-error" role="alert">Vink dit aan om je aanvraag voor te bereiden.</p>}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="booking-success" role="status">
                      <span className="success-index">Aanvraag voorbereid</span>
                      <h2 tabIndex={-1} data-step-heading>Rond af in je e-mailapp.</h2>
                      <p>Als je e-mailapp opende, hoef je de aanvraag alleen nog te versturen. Niets gebeurd? Probeer opnieuw of mail rechtstreeks naar <a href="mailto:team@sounddistrict.be">team@sounddistrict.be</a>.</p>
                      <div className="success-card"><span>{room.name}</span><span>{selectedDate?.fullLabel} · {time}</span><span>{duration} uur</span></div>
                      <div className="success-actions">
                        <button type="button" className="button button-dark" onClick={retryEmailRequest}>Open e-mail opnieuw</button>
                        <button type="button" className="quiet-action" onClick={closeBooking}>Terug naar de website</button>
                      </div>
                    </div>
                  )}
                </div>

                {step < 3 && (
                  <footer className="booking-footer">
                    <div>
                      <span>{step === 0 ? "Voorkeursmoment" : "Jouw sessie"}</span>
                      <strong>{roomId ? room.name : "Kies een room"}{date && time ? ` · ${selectedDate?.day} ${selectedDate?.month} · ${time}` : ""}</strong>
                    </div>
                    <div>
                      {step > 0 && <button className="back-button" type="button" onClick={() => goToStep(step - 1)}>Terug</button>}
                      <button
                        className="next-button"
                        type="button"
                        onClick={continueBooking}
                      >
                        {step === 0 ? "Naar je gegevens" : step === 1 ? "Controleer je aanvraag" : "Open ingevulde e-mail"} <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </footer>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
