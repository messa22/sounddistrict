import Image from "next/image";
import { ROOMS, type RoomId } from "@sounddistrict/booking-core";
import { BookingFlow } from "../components/BookingFlow";
import { MotionEnhancer } from "../components/MotionEnhancer";

const roomEditorial: Record<RoomId, { image: string; bestFor: string; tone: string }> = {
  blue: {
    image: "room-blue-editorial.webp",
    bestFor: "Vocal recording · Production · Writing",
    tone: "deep-blue"
  },
  red: {
    image: "room-red-editorial.webp",
    bestFor: "Recording · Listening · Creative direction",
    tone: "oxblood"
  },
  infinity: {
    image: "room-infinity-editorial.webp",
    bestFor: "Covers · Campaigns · Live sessions",
    tone: "bone"
  }
};

const services = [
  ["01", "Opname & productie", "Van eerste take tot een sessie die technisch en creatief klaarstaat."],
  ["02", "Mixing & mastering", "Heldere afwerking met respect voor de identiteit van je muziek."],
  ["03", "Visual sessions", "Covers, performancebeelden en content in een flexibele infinity space."],
  ["04", "Project support", "Gerichte begeleiding voor planning, A&R en de volgende stap van je release."]
];

export default function HomePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const asset = (name: string) => `${basePath}/${name}`;

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SoundDistrict home">
          <Image src={asset("new-logo2.png")} alt="SoundDistrict Antwerp" width={300} height={45} priority />
        </a>
        <nav aria-label="Hoofdnavigatie">
          <a href="#house">The house</a>
          <a href="#rooms">Rooms</a>
          <a href="#services">Services</a>
          <a href="#visit">Visit</a>
        </nav>
        <button className="header-cta" type="button" data-booking="open">
          Kies room &amp; moment <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="hero-cinematic" aria-labelledby="hero-title" data-hero>
        <div className="hero-media" aria-hidden="true">
          {ROOMS.map((room, index) => (
            <Image
              className={`hero-frame hero-frame-${index + 1}`}
              src={asset(roomEditorial[room.id].image)}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              key={room.id}
            />
          ))}
        </div>
        <div className="hero-shade" aria-hidden="true" />

        <div className="hero-cinematic-copy">
          <p className="hero-kicker">Recording · Production · Visuals</p>
          <h1 id="hero-title">Maak ruimte voor <em>je beste werk.</em></h1>
          <p className="hero-lede">
            Recording, productie en visuals in drie karaktervolle ruimtes in Antwerpen. Kies je room en stuur je voorkeursmoment door.
          </p>
          <div className="hero-actions">
            <button className="button button-bone" type="button" data-booking="open">
              Kies je room &amp; moment <span aria-hidden="true">↗</span>
            </button>
            <a className="quiet-link" href="#rooms">Bekijk de 3 rooms <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-assurance">Geen directe betaling · beschikbaarheid en prijs volgen per e-mail</p>
        </div>

        <div className="hero-room-note">
          <span>Blue · Red · Infinity</span>
          <small>3 rooms · 1 creative house</small>
        </div>
      </section>

      <div className="signal-strip" aria-hidden="true">
        <div className="signal-track">
          <span>Recording · Production · Visuals · Mixing · Content · Antwerp ·</span>
          <span>Recording · Production · Visuals · Mixing · Content · Antwerp ·</span>
        </div>
      </div>

      <section className="room-quicklook" id="rooms" data-reveal>
        <div className="room-quicklook-head section-shell">
          <div>
            <p className="section-label">Choose your room</p>
            <h2>Drie ruimtes.<br /><em>Elk een eigen energie.</em></h2>
          </div>
          <p>Swipe, vergelijk en kies de setting die past bij wat je wilt maken.</p>
        </div>

        <div className="room-rail" aria-label="Vergelijk de drie SoundDistrict rooms">
          {ROOMS.map((room, index) => {
            const editorial = roomEditorial[room.id];
            return (
              <article className={`room-preview-card ${editorial.tone}`} key={room.id}>
                <Image
                  src={asset(editorial.image)}
                  alt={`${room.name} bij SoundDistrict Antwerpen`}
                  fill
                  sizes="(max-width: 800px) 84vw, 32vw"
                />
                <div className="room-preview-shade" />
                <span className="room-preview-index">0{index + 1}</span>
                <div className="room-preview-copy">
                  <p>{editorial.bestFor}</p>
                  <h3>{room.name}</h3>
                  <button type="button" data-booking={room.id} aria-label={`Bekijk momenten voor ${room.name}`}>
                    Bekijk momenten <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <a className="room-rail-more" href="#room-details">Bekijk alle roomdetails <span aria-hidden="true">↓</span></a>
      </section>

      <section className="house" id="house" data-reveal>
        <div className="section-shell house-grid">
          <p className="section-label">The house</p>
          <div>
            <h2>Alles wat je sessie nodig heeft.<br /><em>Niets wat afleidt.</em></h2>
            <div className="house-copy">
              <p>
                SoundDistrict brengt sound, beeld en creatieve begeleiding samen. Iedere room heeft een eigen karakter; wij stemmen de praktische details persoonlijk af zodat jij meteen kunt beginnen.
              </p>
            </div>
          </div>
        </div>
        <div className="house-facts section-shell" aria-label="SoundDistrict in het kort">
          <span><strong>03</strong> unieke ruimtes</span>
          <span><strong>01</strong> creative house</span>
          <span><strong>2000</strong> Antwerpen</span>
        </div>
      </section>

      <section className="rooms-editorial" id="room-details">
        <div className="section-shell rooms-intro">
          <p className="section-label section-label-light">The rooms</p>
          <h2>Three rooms.<br /><em>Three frequencies.</em></h2>
        </div>

        <div className="room-stories section-shell">
          {ROOMS.map((room, index) => {
            const editorial = roomEditorial[room.id];
            return (
              <article className={`room-story ${index % 2 ? "room-story-reverse" : ""}`} data-reveal key={room.id}>
                <figure className={`room-story-image ${editorial.tone}`}>
                  <Image
                    src={asset(editorial.image)}
                    alt={`${room.name} bij SoundDistrict Antwerpen`}
                    fill
                    sizes="(max-width: 800px) 100vw, 60vw"
                  />
                  <figcaption>0{index + 1} / 03</figcaption>
                </figure>
                <div className="room-story-copy">
                  <p className="room-type">{editorial.bestFor}</p>
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <ul>
                    {room.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <button type="button" className="room-link" data-booking={room.id}>
                    Bekijk momenten voor {room.name} <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-editorial" id="services" data-reveal>
        <div className="section-shell services-layout">
          <div className="services-title">
            <p className="section-label">Services</p>
            <h2>Van eerste take tot <em>final form.</em></h2>
            <p>Start met een room. Voeg alleen de ondersteuning toe die je project echt nodig heeft.</p>
          </div>
          <div className="service-list">
            {services.map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-minimal" aria-labelledby="process-title" data-reveal>
        <div className="section-shell">
          <p className="section-label section-label-light">The process</p>
          <div className="process-heading">
            <h2 id="process-title">Van idee naar sessie,<br /><em>zonder ruis.</em></h2>
            <button className="button button-outline" type="button" data-booking="open">Kies room &amp; moment <span aria-hidden="true">↗</span></button>
          </div>
          <ol>
            <li><span>01</span><h3>Kies</h3><p>Selecteer de room die past bij wat je wilt maken.</p></li>
            <li><span>02</span><h3>Plan</h3><p>Geef je voorkeursmoment en eventuele ondersteuning door.</p></li>
            <li><span>03</span><h3>Create</h3><p>Wij bevestigen de details. Jij komt binnen en begint.</p></li>
          </ol>
        </div>
      </section>

      <section className="returning-strip" aria-label="SoundDistrict app voor terugkerende artiesten" data-reveal>
        <div className="section-shell returning-grid">
          <p className="section-label">For returning artists</p>
          <h2>Je volgende sessie.<br /><em>Nog sneller geregeld.</em></h2>
          <p>De SoundDistrict app wordt de plek om opnieuw te boeken, sessies te beheren en updates te ontvangen.</p>
          <span className="coming-soon">App in ontwikkeling</span>
        </div>
      </section>

      <section className="visit-final" id="visit" data-reveal>
        <div className="visit-copy">
          <p className="section-label section-label-light">Visit the district</p>
          <h2>Vind jouw <em>frequency.</em></h2>
          <p>Stadswaag 20<br />2000 Antwerpen</p>
          <button className="button button-bone" type="button" data-booking="open">Kies je room &amp; moment <span aria-hidden="true">↗</span></button>
          <a href="mailto:team@sounddistrict.be">Bespreek je project eerst per e-mail →<small>team@sounddistrict.be</small></a>
        </div>
        <figure>
          <Image src={asset("final.jpg")} alt="Een SoundDistrict productiesessie in uitvoering" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </figure>
      </section>

      <footer>
        <div className="footer-main">
          <a className="footer-logo" href="#top"><Image src={asset("new-logo2.png")} alt="SoundDistrict Antwerp" width={300} height={45} /></a>
          <p>A private house for sound and image.</p>
          <div><span>Visit</span><p>Stadswaag 20<br />2000 Antwerpen</p></div>
          <div><span>Contact</span><a href="mailto:team@sounddistrict.be">team@sounddistrict.be</a><a href="https://www.instagram.com/sounddistrict.be" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        </div>
        <div className="footer-legal"><span>© 2026 SoundDistrict Antwerp</span><span>VAT BE 1023.309.121</span><a href={`${basePath}/privacy/`}>Privacy</a></div>
      </footer>

      <MotionEnhancer />
      <BookingFlow />
    </main>
  );
}
