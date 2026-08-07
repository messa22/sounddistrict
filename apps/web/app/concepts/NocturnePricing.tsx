"use client";

import Image from "next/image";
import {
  calculateNocturnePrice,
  getNocturneOffer,
  type NocturneOfferId
} from "./NocturneBookingData";
import styles from "./concepts.module.css";

const districtRates = [
  {
    id: "blue",
    bookingId: "blue",
    number: "01",
    name: "Blue District",
    image: "room-blue-editorial.webp",
    services: "Recording · Production · Engineering",
    eyebrow: "Modern music studio",
    description: "XL, high end, modern music studio with an underwater touch.",
    hourlyLabel: "Studio only",
    defaultOffer: "studio-hourly" satisfies NocturneOfferId,
    producerOffer: "with-producer" satisfies NocturneOfferId,
    packages: [
      { label: "5h + 1h free", detail: "6 hours of studio time", offer: "six-hour" satisfies NocturneOfferId },
      { label: "8h + 2h free", detail: "10 hours of studio time", offer: "ten-hour" satisfies NocturneOfferId }
    ],
    note: "Free-hour packages apply to studio-only bookings."
  },
  {
    id: "red",
    bookingId: "red",
    number: "02",
    name: "Red District",
    image: "room-red-editorial.webp",
    services: "Recording · Production · Engineering",
    eyebrow: "Warm recording studio",
    description: "High end, retro, warm music studio with a separate booth.",
    hourlyLabel: "Studio only",
    defaultOffer: "studio-hourly" satisfies NocturneOfferId,
    producerOffer: "with-producer" satisfies NocturneOfferId,
    packages: [
      { label: "5h + 1h free", detail: "6 hours of studio time", offer: "six-hour" satisfies NocturneOfferId },
      { label: "8h + 2h free", detail: "10 hours of studio time", offer: "ten-hour" satisfies NocturneOfferId }
    ],
    note: "Free-hour packages apply to studio-only bookings."
  },
  {
    id: "white",
    bookingId: "infinity",
    number: "03",
    name: "White District",
    image: "room-infinity-editorial.webp",
    services: "Visuals · Shoots · Content",
    eyebrow: "Infinite photo studio",
    description: "Endless, white, clean photo studio for creators.",
    hourlyLabel: "Opening month",
    defaultOffer: "white-hourly" satisfies NocturneOfferId,
    packages: [
      { label: "3-hour package", detail: "Opening month", offer: "white-three" satisfies NocturneOfferId },
      { label: "5-hour package", detail: "Opening month", offer: "white-five" satisfies NocturneOfferId }
    ],
    note: "Opening prices are personally confirmed with your request."
  }
] as const;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export function NocturnePricing({ basePath }: { basePath: string }) {
  return (
    <section
      className={`${styles.nocturnePricing} ${styles.nocturneDistricts}`}
      id="nocturne-rooms"
      data-nocturne-pricing
    >
      <span className={styles.nocturneAnchor} id="nocturne-pricing" aria-hidden="true" />

      <div className={styles.nocturnePricingHead} data-nocturne-pricing-head>
        <div>
          <p>Districts · Rates · Opening offers</p>
          <h2 aria-label="Choose your district.">
            <span aria-hidden="true" data-nocturne-pricing-word>Choose</span>
            <span aria-hidden="true" data-nocturne-pricing-word>your</span>
            <span aria-hidden="true" data-nocturne-pricing-word>district.</span>
          </h2>
        </div>
        <div className={styles.nocturnePricingIntro}>
          <p>Swipe through the districts. Compare the atmosphere, rates and offers in one place.</p>
          <i data-nocturne-pricing-signal aria-hidden="true" />
        </div>
      </div>

      <div className={`${styles.nocturneRail} ${styles.nocturneDistrictRail}`} aria-label="Districts and rates">
        {districtRates.map((district, index) => {
          const hourlyOffer = getNocturneOffer(district.bookingId, district.defaultOffer);
          const producerOffer = "producerOffer" in district
            ? getNocturneOffer(district.bookingId, district.producerOffer)
            : null;

          return (
            <article
              className={styles.nocturneDistrictCard}
              data-district={district.id}
              data-nocturne-room-card={index}
              data-nocturne-cursor-label="Swipe district"
              key={district.id}
            >
              <div className={styles.nocturneRoomReveal} data-nocturne-room-reveal>
                <div className={styles.nocturneRoomShell} data-nocturne-room-shell>
                  <div className={styles.nocturneDistrictMedia} data-nocturne-room-media>
                    <Image
                      src={`${basePath}/${district.image}`}
                      alt={`${district.name} interior`}
                      fill
                      sizes="(max-width: 800px) 88vw, 470px"
                    />
                    <span className={styles.nocturneDistrictImageLabel}>
                      <b>{district.number}</b>
                      <strong>{district.name}</strong>
                    </span>
                    <span className={styles.nocturneRoomAperture} data-nocturne-room-aperture aria-hidden="true"><i /></span>
                  </div>

                  <div
                    className={`${styles.nocturneRateBody} ${styles.nocturneDistrictBody}`}
                    data-nocturne-room-meta
                  >
                    <header>
                      <div>
                        <p>{district.number} · {district.services}</p>
                        <h3>{district.name}</h3>
                      </div>
                      {district.id === "white" && <span className={styles.nocturnePromoPill}>Opening month</span>}
                    </header>

                    <p className={styles.nocturneDistrictDescription}>{district.description}</p>

                    <button
                      className={styles.nocturneRateLead}
                      type="button"
                      data-booking={district.bookingId}
                      data-booking-offer={district.defaultOffer}
                      data-nocturne-price-row
                      data-nocturne-rate-choice
                    >
                      <span>{district.hourlyLabel}</span>
                      <div>
                        <strong data-nocturne-price-number>{formatPrice(calculateNocturnePrice(hourlyOffer, 1))}</strong>
                        <small>/ hour</small>
                      </div>
                      {hourlyOffer.standardPrice !== undefined && <del>{formatPrice(hourlyOffer.standardPrice)} standard</del>}
                      <i>Choose <b aria-hidden="true">↗</b></i>
                    </button>

                    {producerOffer && (
                      <button
                        className={styles.nocturneProducerRate}
                        type="button"
                        data-booking={district.bookingId}
                        data-booking-offer={producerOffer.id}
                        data-nocturne-price-row
                        data-nocturne-rate-choice
                      >
                        <span>With producer</span>
                        <strong data-nocturne-price-number>{formatPrice(calculateNocturnePrice(producerOffer, 1))} / hour</strong>
                        <i>Choose <b aria-hidden="true">↗</b></i>
                      </button>
                    )}

                    <div className={styles.nocturnePackageList}>
                      {district.packages.map((item) => {
                        const packageOffer = getNocturneOffer(district.bookingId, item.offer);
                        return (
                          <button
                            className={styles.nocturnePackageRow}
                            type="button"
                            data-booking={district.bookingId}
                            data-booking-offer={item.offer}
                            data-nocturne-price-row
                            data-nocturne-rate-choice
                            key={item.label}
                          >
                            <div><strong>{item.label}</strong><small>{item.detail}</small></div>
                            <div>
                              <b data-nocturne-price-number>
                                {formatPrice(calculateNocturnePrice(packageOffer, packageOffer.defaultDuration))}
                                {district.id === "white" ? "" : " total"}
                              </b>
                              {packageOffer.valuePrice !== undefined && packageOffer.standardPrice !== undefined && (
                                <small>{formatPrice(packageOffer.standardPrice)} package · {formatPrice(packageOffer.valuePrice)} hourly value</small>
                              )}
                            </div>
                            <i>Choose <b aria-hidden="true">↗</b></i>
                          </button>
                        );
                      })}
                    </div>

                    <p className={styles.nocturneRateNote} data-nocturne-price-row>{district.note}</p>
                    <button
                      className={styles.nocturneRateCta}
                      type="button"
                      data-booking={district.bookingId}
                      data-booking-offer={district.defaultOffer}
                      data-nocturne-pricing-cta
                      data-nocturne-magnetic
                    >
                      Book {district.name} <b aria-hidden="true">↗</b>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={`${styles.nocturneRailProgress} ${styles.nocturneDistrictProgress}`} aria-label="District swipe controls">
        <span><b data-nocturne-room-current>01</b> / 03</span>
        <i><b /></i>
        <small>Swipe</small>
        <div>
          <button type="button" data-nocturne-room-previous aria-label="Previous district">←</button>
          <button type="button" data-nocturne-room-next aria-label="Next district">→</button>
        </div>
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
