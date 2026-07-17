import Image from "next/image";
import { ROOMS, type RoomId } from "@sounddistrict/booking-core";
import { BookingFlow } from "../components/BookingFlow";

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
          Plan je sessie <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="hero-private" aria-labelledby="hero-title">
        <div className="hero-private-copy">
          <p className="locator"><span aria-hidden="true" /> Stadswaag 20 · Antwerpen</p>
          <h1 id="hero-title">Een private plek voor <em>sound &amp; image.</em></h1>
          <p className="hero-lede">
            Drie ruimtes in het hart van Antwerpen. Voor opnames, producties en beeld dat blijft hangen.
          </p>
          <div className="hero-actions">
            <button className="button button-bone" type="button" data-booking="open">
              Plan je sessie <span aria-hidden="true">↗</span>
            </button>
            <a className="quiet-link" href="#rooms">Ontdek de rooms <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <figure className="hero-private-visual">
          <Image
            src={asset("room-red-editorial.webp")}
            alt="De warme Red Room van SoundDistrict met platenwand en On Air-verlichting"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 58vw"
          />
          <figcaption><span>Studio 02</span> The Red Room</figcaption>
        </figure>
      </section>

      <section className="session-launch" aria-label="Start je boekingsaanvraag">
        <div className="session-launch-inner section-shell">
          <div><span>Rooms</span><strong>Blue · Red · Infinity</strong></div>
          <div><span>Locatie</span><strong>Stadswaag 20, Antwerpen</strong></div>
          <div><span>Reservatie</span><strong>Kies je voorkeursmoment</strong></div>
          <button type="button" data-booking="open">Start je aanvraag <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <section className="house" id="house">
        <div className="section-shell house-grid">
          <p className="section-label">The house</p>
          <div>
            <h2>Alles wat je sessie nodig heeft.<br /><em>Niets wat afleidt.</em></h2>
            <div className="house-copy">
              <p>
                SoundDistrict brengt sound, beeld en creatieve begeleiding samen onder één dak. Iedere room heeft een eigen karakter; de aandacht blijft altijd bij het werk.
              </p>
              <p>
                Kies je ruimte en voorkeursmoment. Wij stemmen de praktische details persoonlijk met je af, zodat je voorbereid binnenkomt en meteen kunt beginnen.
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

      <section className="rooms-editorial" id="rooms">
        <div className="section-shell rooms-intro">
          <p className="section-label section-label-light">The rooms</p>
          <h2>Three rooms.<br /><em>Three frequencies.</em></h2>
        </div>

        <div className="room-stories section-shell">
          {ROOMS.map((room, index) => {
            const editorial = roomEditorial[room.id];
            return (
              <article className={`room-story ${index % 2 ? "room-story-reverse" : ""}`} key={room.id}>
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
                    Plan deze room <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-editorial" id="services">
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

      <section className="process-minimal" aria-labelledby="process-title">
        <div className="section-shell">
          <p className="section-label section-label-light">The process</p>
          <div className="process-heading">
            <h2 id="process-title">Van idee naar sessie,<br /><em>zonder ruis.</em></h2>
            <button className="button button-outline" type="button" data-booking="open">Start je aanvraag <span aria-hidden="true">↗</span></button>
          </div>
          <ol>
            <li><span>01</span><h3>Kies</h3><p>Selecteer de room die past bij wat je wilt maken.</p></li>
            <li><span>02</span><h3>Plan</h3><p>Geef je voorkeursmoment en eventuele ondersteuning door.</p></li>
            <li><span>03</span><h3>Create</h3><p>Wij bevestigen de details. Jij komt binnen en begint.</p></li>
          </ol>
        </div>
      </section>

      <section className="returning-strip" aria-label="SoundDistrict app voor terugkerende artiesten">
        <div className="section-shell returning-grid">
          <p className="section-label">For returning artists</p>
          <h2>Je volgende sessie.<br /><em>Nog sneller geregeld.</em></h2>
          <p>De SoundDistrict app wordt de plek om opnieuw te boeken, sessies te beheren en updates te ontvangen.</p>
          <span className="coming-soon">App in ontwikkeling</span>
        </div>
      </section>

      <section className="visit-final" id="visit">
        <div className="visit-copy">
          <p className="section-label section-label-light">Visit the district</p>
          <h2>Vind jouw <em>frequency.</em></h2>
          <p>Stadswaag 20<br />2000 Antwerpen</p>
          <button className="button button-bone" type="button" data-booking="open">Plan je sessie <span aria-hidden="true">↗</span></button>
          <a href="mailto:team@sounddistrict.be">Liever eerst overleggen? team@sounddistrict.be</a>
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

      <BookingFlow />
    </main>
  );
}
