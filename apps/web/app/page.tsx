import Image from "next/image";
import { ROOMS, formatCurrency } from "@sounddistrict/booking-core";
import { BookingFlow } from "../components/BookingFlow";

const services = [
  {
    number: "01",
    title: "Recording",
    text: "Van eerste demo tot final vocals, met de juiste ruimte en technische support."
  },
  {
    number: "02",
    title: "A&R & project",
    text: "Scherpe feedback, planning en creatieve richting om je project vooruit te krijgen."
  },
  {
    number: "03",
    title: "Mix & release",
    text: "Mixing, release support en een praktische route van sessie naar publiek."
  },
  {
    number: "04",
    title: "Visual content",
    text: "Covers, social content en live visuals die klinken zoals je muziek eruitziet."
  }
];

export default function HomePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const asset = (name: string) => `${basePath}/${name}`;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SoundDistrict home">
          <Image src={asset("new-logo2.png")} alt="SoundDistrict Antwerp" width={300} height={45} priority />
        </a>
        <nav aria-label="Hoofdnavigatie">
          <a href="#rooms">Rooms</a>
          <a href="#services">Services</a>
          <a href="#process">Werkwijze</a>
        </nav>
        <a className="button button-small" href="#booking" data-booking="blue">
          Boek je sessie <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,3,4,.92) 0%, rgba(2,3,4,.6) 47%, rgba(2,3,4,.18) 100%), url('${asset("hero.png")}')` }}>
        <div className="hero-noise" />
        <div className="hero-content reveal">
          <p className="eyebrow"><span /> SoundDistrict · Antwerp</p>
          <h1>
            Your sound.
            <br />
            <em>Your district.</em>
          </h1>
          <p className="hero-copy">
            Drie creatieve ruimtes in het hart van Antwerpen. Kies je room, prik je moment en kom maken.
          </p>
          <div className="hero-actions">
            <a className="button" href="#booking" data-booking="blue">
              Bekijk vrije momenten <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#rooms">Ontdek de rooms <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">01 — 03</div>
        <div className="hero-scroll" aria-hidden="true"><span /> Scroll to explore</div>
      </section>

      <section className="booking-bar" aria-label="Snel boeken">
        <div>
          <span className="booking-bar-label">Wat wil je maken?</span>
          <strong>Recording, vocals of visual content</strong>
        </div>
        <div>
          <span className="booking-bar-label">Waar?</span>
          <strong>Stadswaag 20, Antwerpen</strong>
        </div>
        <a className="booking-bar-cta" href="#booking" data-booking="blue">
          Vind jouw room <span>→</span>
        </a>
      </section>

      <section className="intro section-shell">
        <p className="section-kicker">— Built around what you make</p>
        <div className="intro-grid">
          <h2>Geen eindeloos heen-en-weer. Je studiosessie staat in een paar minuten.</h2>
          <div>
            <p>
              Van eerste take tot tiende album: SoundDistrict brengt professionele rooms, mensen en output samen onder één dak.
            </p>
            <div className="stats">
              <div><strong>3</strong><span>unieke rooms</span></div>
              <div><strong>7/7</strong><span>boekbaar</span></div>
              <div><strong>2000</strong><span>Antwerpen</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="rooms section-shell" id="rooms">
        <div className="section-heading">
          <div>
            <p className="section-kicker">— 01 · Spaces</p>
            <h2>Choose your room.</h2>
          </div>
          <p>Elke ruimte heeft zijn eigen energie. Dezelfde focus: beter werk maken.</p>
        </div>
        <div className="room-grid">
          {ROOMS.map((room, index) => (
            <article className="room-card" key={room.id} style={{ "--room-accent": room.accent } as React.CSSProperties}>
              <div className="room-image-wrap">
                <Image
                  src={asset(room.image)}
                  alt={`${room.name} studio bij SoundDistrict`}
                  fill
                  sizes="(max-width: 800px) 100vw, 33vw"
                />
                <span className="room-number">0{index + 1}</span>
                <span className="room-availability">Vandaag beschikbaar</span>
              </div>
              <div className="room-content">
                <p>{room.eyebrow}</p>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <ul>
                  {room.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <div className="room-footer">
                  <span>vanaf <strong>{formatCurrency(room.pricePerHour)}</strong>/uur</span>
                  <a href="#booking" data-booking={room.id} aria-label={`Boek ${room.name}`}>Boek deze room <span>↗</span></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services" id="services">
        <div className="section-shell">
          <p className="section-kicker gold">— 02 · Beyond the rooms</p>
          <div className="services-heading">
            <h2>More than studio time.</h2>
            <p>Boek precies wat je nodig hebt. Voeg ondersteuning toe tijdens je reservatie of start alleen met een room.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article key={service.number}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#booking" data-booking="blue" aria-label={`${service.title} boeken`}>Voeg toe aan sessie →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process section-shell" id="process">
        <p className="section-kicker">— 03 · Process</p>
        <div className="process-layout">
          <div className="process-copy">
            <h2>From idea to session in four moves.</h2>
            <p>Geen DM’s, losse mails of onduidelijke prijzen. Je ziet meteen wat je kiest en wat het kost.</p>
            <a className="button" href="#booking" data-booking="blue">Start je boeking <span>↗</span></a>
          </div>
          <ol>
            <li><span>01</span><div><h3>Kies je room</h3><p>Vergelijk sfeer, mogelijkheden en prijs.</p></div></li>
            <li><span>02</span><div><h3>Prik je moment</h3><p>Selecteer datum, startuur en duur.</p></div></li>
            <li><span>03</span><div><h3>Maak het compleet</h3><p>Voeg engineer, mix of content toe.</p></div></li>
            <li><span>04</span><div><h3>Bevestig</h3><p>Bekijk je totaal en ontvang je referentie.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="app-preview">
        <div className="section-shell app-preview-grid">
          <div>
            <p className="section-kicker gold">— The SoundDistrict app</p>
            <h2>Your sessions. Always in reach.</h2>
            <p>Boek opnieuw in seconden, beheer je sessies en hou al je details op één plek. Gebouwd voor iOS en Android.</p>
            <div className="app-pills"><span>Sneller herboeken</span><span>Sessie-overzicht</span><span>Updates</span></div>
            <a className="button" href="#app">Bekijk de app <span>→</span></a>
          </div>
          <div className="phone" id="app" aria-label="Voorbeeld van de SoundDistrict app">
            <div className="phone-bar"><span>9:41</span><span>● ● ●</span></div>
            <div className="phone-head"><Image src={asset("new-logo2.png")} alt="SoundDistrict" width={150} height={23} /></div>
            <p className="phone-overline">Good evening</p>
            <h3>Ready to create?</h3>
            <div className="phone-card">
              <Image src={asset("blueroom-new1.jpg")} alt="Blue Room" fill sizes="280px" />
              <div><span>Available today</span><strong>Blue Room</strong><small>From €55 / hour</small></div>
            </div>
            <button type="button" data-booking="blue">Book a session →</button>
            <div className="phone-nav"><span>⌂<small>Home</small></span><span>◈<small>Rooms</small></span><span>▣<small>Sessions</small></span></div>
          </div>
        </div>
      </section>

      <section className="final-cta" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,3,4,.93) 0%, rgba(2,3,4,.42) 70%), url('${asset("final.jpg")}')` }}>
        <div>
          <p>Ready when you are.</p>
          <h2>No limits.<br /><em>Just creation.</em></h2>
          <a className="button button-light" href="#booking" data-booking="blue">Boek je sessie <span>↗</span></a>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-brand"><Image src={asset("new-logo2.png")} alt="SoundDistrict Antwerp" width={300} height={45} /><p>Creative hub for music, visuals and identity. Built for output.</p></div>
          <div><h3>Explore</h3><a href="#rooms">Rooms</a><a href="#services">Services</a><a href="#process">Process</a></div>
          <div><h3>Contact</h3><a href="mailto:team@sounddistrict.be">team@sounddistrict.be</a><p>Stadswaag 20<br />2000 Antwerpen</p></div>
          <div><h3>Follow</h3><a href="https://www.instagram.com/sounddistrict.be" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 SoundDistrict Antwerp</span><span>VAT BE 1023.309.121</span><span>Privacy · Terms</span></div>
      </footer>

      <BookingFlow />
    </main>
  );
}
