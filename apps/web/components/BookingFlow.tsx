"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADD_ONS,
  ROOMS,
  TIME_SLOTS,
  buildBookingReference,
  calculateQuote,
  formatCurrency,
  getRoom,
  type RoomId,
  type StoredBooking
} from "@sounddistrict/booking-core";

const steps = ["Room", "Moment", "Extra's", "Gegevens", "Check"];

function upcomingDates() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return {
      value: `${year}-${month}-${day}`,
      weekday: new Intl.DateTimeFormat("nl-BE", { weekday: "short" }).format(date),
      day: date.getDate(),
      month: new Intl.DateTimeFormat("nl-BE", { month: "short" }).format(date)
    };
  });
}

export function BookingFlow() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [roomId, setRoomId] = useState<RoomId>("blue");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(2);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const dateOptions = useMemo(upcomingDates, []);

  const total = useMemo(() => calculateQuote(roomId, duration, addOnIds), [roomId, duration, addOnIds]);
  const room = getRoom(roomId);

  useEffect(() => {
    function handleBookingClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const trigger = target.closest<HTMLElement>("[data-booking]");
      if (!trigger) return;
      event.preventDefault();
      const requestedRoom = trigger.dataset.booking as RoomId | undefined;
      if (requestedRoom && ROOMS.some((item) => item.id === requestedRoom)) setRoomId(requestedRoom);
      setOpen(true);
      setStep(0);
    }

    document.addEventListener("click", handleBookingClick);
    return () => document.removeEventListener("click", handleBookingClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function toggleAddOn(id: string) {
    setAddOnIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function canContinue() {
    if (step === 0) return Boolean(roomId);
    if (step === 1) return Boolean(date && time && duration);
    if (step === 3) return name.trim().length > 1 && email.includes("@");
    return true;
  }

  function confirmBooking() {
    const bookingReference = buildBookingReference();
    const booking: StoredBooking = {
      roomId,
      date,
      time,
      duration,
      addOnIds,
      name,
      email,
      phone,
      note,
      reference: bookingReference,
      total,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    const previous = JSON.parse(localStorage.getItem("sounddistrict-bookings") ?? "[]") as StoredBooking[];
    localStorage.setItem("sounddistrict-bookings", JSON.stringify([booking, ...previous]));
    setReference(bookingReference);
    setStep(5);
  }

  function resetAndClose() {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setDate("");
      setTime("");
      setDuration(2);
      setAddOnIds([]);
      setName("");
      setEmail("");
      setPhone("");
      setNote("");
      setReference("");
    }, 250);
  }

  return (
    <>
      <button className="mobile-booking-cta" type="button" data-booking="blue" data-release="pages-2">Boek nu <span>↗</span></button>
      {open && (
        <div className="booking-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) resetAndClose();
        }}>
          <section className="booking-panel" role="dialog" aria-modal="true" aria-label="Boek je SoundDistrict sessie">
            <header className="booking-header">
              <div>
                <span>SoundDistrict Antwerp</span>
                <strong>{step === 5 ? "Booking ready" : "Book your session"}</strong>
              </div>
              <button type="button" onClick={resetAndClose} aria-label="Sluit boekingsvenster">×</button>
            </header>

            {step < 5 && (
              <div className="booking-progress" aria-label={`Stap ${step + 1} van ${steps.length}`}>
                {steps.map((label, index) => (
                  <div className={index <= step ? "active" : ""} key={label}>
                    <span>{index < step ? "✓" : index + 1}</span><small>{label}</small>
                  </div>
                ))}
              </div>
            )}

            <div className="booking-body">
              {step === 0 && (
                <div className="booking-step">
                  <p className="booking-eyebrow">Stap 1 · Kies je space</p>
                  <h2>Welke room past bij je sessie?</h2>
                  <div className="booking-room-list">
                    {ROOMS.map((item) => (
                      <button
                        type="button"
                        className={item.id === roomId ? "selected" : ""}
                        onClick={() => setRoomId(item.id)}
                        key={item.id}
                      >
                        <span className="booking-room-image" style={{ backgroundImage: `url(${basePath}/${item.image})` }} />
                        <span><small>{item.eyebrow}</small><strong>{item.name}</strong><em>{formatCurrency(item.pricePerHour)}/uur</em></span>
                        <i>{item.id === roomId ? "✓" : ""}</i>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="booking-step">
                  <p className="booking-eyebrow">Stap 2 · Kies je moment</p>
                  <h2>Wanneer wil je komen maken?</h2>
                  <fieldset>
                    <legend>Datum</legend>
                    <div className="date-options">
                      {dateOptions.map((item) => (
                        <button type="button" className={date === item.value ? "selected" : ""} onClick={() => setDate(item.value)} key={item.value} aria-label={`${item.weekday} ${item.day} ${item.month}`}>
                          <small>{item.weekday}</small><strong>{item.day}</strong><span>{item.month}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>Startuur</legend>
                    <div className="choice-grid times">
                      {TIME_SLOTS.map((slot) => <button type="button" className={time === slot ? "selected" : ""} onClick={() => setTime(slot)} key={slot}>{slot}</button>)}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>Duur</legend>
                    <div className="choice-grid duration">
                      {[1, 2, 3, 4].map((hours) => <button type="button" className={duration === hours ? "selected" : ""} onClick={() => setDuration(hours)} key={hours}>{hours} uur</button>)}
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 2 && (
                <div className="booking-step">
                  <p className="booking-eyebrow">Stap 3 · Extra support</p>
                  <h2>Make the session complete.</h2>
                  <p className="booking-intro">Optioneel. Je kunt deze ook later nog bespreken met het team.</p>
                  <div className="addon-list">
                    {ADD_ONS.map((addOn) => (
                      <button type="button" className={addOnIds.includes(addOn.id) ? "selected" : ""} onClick={() => toggleAddOn(addOn.id)} key={addOn.id}>
                        <i>{addOnIds.includes(addOn.id) ? "✓" : "+"}</i>
                        <span><strong>{addOn.name}</strong><small>{addOn.description}</small></span>
                        <em>+ {formatCurrency(addOn.price)}</em>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="booking-step">
                  <p className="booking-eyebrow">Stap 4 · Jouw gegevens</p>
                  <h2>Wie mogen we verwachten?</h2>
                  <div className="form-grid">
                    <label className="field-label">Naam *<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Je volledige naam" autoComplete="name" /></label>
                    <label className="field-label">E-mail *<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="naam@email.be" type="email" autoComplete="email" /></label>
                    <label className="field-label">Telefoon<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+32 ..." type="tel" autoComplete="tel" /></label>
                    <label className="field-label full">Iets dat we moeten weten?<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Vertel kort wat je wilt opnemen of maken." rows={3} /></label>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="booking-step review-step">
                  <p className="booking-eyebrow">Stap 5 · Check & confirm</p>
                  <h2>Alles klaar voor je sessie.</h2>
                  <div className="booking-summary">
                    <div><span>Room</span><strong>{room.name}</strong><button type="button" onClick={() => setStep(0)}>Wijzig</button></div>
                    <div><span>Moment</span><strong>{date} · {time} · {duration} uur</strong><button type="button" onClick={() => setStep(1)}>Wijzig</button></div>
                    <div><span>Extra&apos;s</span><strong>{addOnIds.length ? ADD_ONS.filter((item) => addOnIds.includes(item.id)).map((item) => item.name).join(", ") : "Geen"}</strong><button type="button" onClick={() => setStep(2)}>Wijzig</button></div>
                    <div><span>Contact</span><strong>{name} · {email}</strong><button type="button" onClick={() => setStep(3)}>Wijzig</button></div>
                  </div>
                  <div className="total-row"><span>Totaal indicatie<small>Definitief na bevestiging door het team</small></span><strong>{formatCurrency(total)}</strong></div>
                </div>
              )}

              {step === 5 && (
                <div className="booking-success">
                  <div className="success-mark">✓</div>
                  <p>Booking request ready</p>
                  <h2>See you in the district.</h2>
                  <span>Referentie</span><strong>{reference}</strong>
                  <div className="success-card"><span>{room.name}</span><span>{date} · {time}</span><span>{duration} uur · {formatCurrency(total)}</span></div>
                  <p className="prototype-note">Deze prototypeboeking is lokaal opgeslagen. Koppel de productieversie aan de agenda- en betaalbackend voor live bevestiging.</p>
                  <button type="button" className="button" onClick={resetAndClose}>Terug naar de website</button>
                </div>
              )}
            </div>

            {step < 5 && (
              <footer className="booking-footer">
                <div><span>Indicatief totaal</span><strong>{formatCurrency(total)}</strong></div>
                <div>
                  {step > 0 && <button className="back-button" type="button" onClick={() => setStep((current) => current - 1)}>Terug</button>}
                  <button
                    className="next-button"
                    type="button"
                    disabled={!canContinue()}
                    onClick={() => step === 4 ? confirmBooking() : setStep((current) => current + 1)}
                  >
                    {step === 4 ? "Bevestig aanvraag" : "Verder"} <span>→</span>
                  </button>
                </div>
              </footer>
            )}
          </section>
        </div>
      )}
    </>
  );
}
