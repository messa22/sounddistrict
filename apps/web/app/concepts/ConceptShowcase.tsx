import Image from "next/image";
import Link from "next/link";
import { BookingFlow } from "../../components/BookingFlow";
import { ConciergeExperience } from "./ConciergeExperience";
import { ConceptStickyController } from "./ConceptStickyController";
import styles from "./concepts.module.css";

export const conceptDirections = [
  {
    id: "01",
    slug: "nocturne",
    name: "Nocturne",
    mood: "Cinematic · Private club · After dark",
    summary: "Een filmische entrance met één sterke hoofdactie en rooms als verschillende sferen."
  },
  {
    id: "02",
    slug: "sound-issue",
    name: "The Sound Issue",
    mood: "Editorial · Fashion · Cultured",
    summary: "Een rustig fashion-magazine waarin beeld, typografie en booking als één coververhaal voelen."
  },
  {
    id: "03",
    slug: "concierge",
    name: "Private Concierge",
    mood: "Booking-first · Boutique · Precise",
    summary: "De luxe van een boutique hotelbooking, vertaald naar een creatieve studiosessie."
  },
  {
    id: "04",
    slug: "pulse",
    name: "Pulse",
    mood: "Artist-led · Bold · Contemporary",
    summary: "Een energieke, culturele richting met bewegende beelden en een onmisbare boekingsactie."
  }
] as const;

export type ConceptSlug = (typeof conceptDirections)[number]["slug"];

const rooms = [
  {
    id: "blue",
    number: "01",
    name: "Blue Room",
    image: "room-blue-editorial.webp",
    use: "Record · Produce · Write",
    capacity: "Tot 5 personen"
  },
  {
    id: "red",
    number: "02",
    name: "Red Room",
    image: "room-red-editorial.webp",
    use: "Record · Listen · Direct",
    capacity: "Tot 6 personen"
  },
  {
    id: "infinity",
    number: "03",
    name: "Infinity",
    image: "room-infinity-editorial.webp",
    use: "Shoot · Perform · Create",
    capacity: "Tot 10 personen"
  }
] as const;

const fullServices = [
  ["01", "Recording & productie", "Van vocal chain en engineering tot een sessie die creatief vooruitgaat."],
  ["02", "Mixing & mastering", "Een heldere afwerking die de identiteit van je muziek bewaart."],
  ["03", "Visual sessions", "Covers, performancebeelden en content in de Infinity Room."],
  ["04", "Creative support", "Gerichte begeleiding voor planning, A&R en release-ready materiaal."]
] as const;

const bookingSteps = [
  ["01", "Kies je room", "Vergelijk de sfeer, setup en capaciteit van de drie ruimtes."],
  ["02", "Geef je moment door", "Selecteer datum, startuur, duur en eventuele ondersteuning."],
  ["03", "Ontvang bevestiging", "Wij controleren beschikbaarheid en bevestigen prijs en details persoonlijk."]
] as const;

function Nocturne({ asset }: { asset: (name: string) => string }) {
  const nocturneScenes = ["hero.png", "room-red-editorial.webp", "room-blue-editorial.webp"];

  return (
    <main className={`${styles.preview} ${styles.nocturne}`}>
      <section className={styles.nocturneHero} data-concept-hero>
        <div className={styles.nocturneMedia} aria-hidden="true">
          {nocturneScenes.map((image, index) => (
            <Image
              className={`${styles.nocturneFrame} ${styles[`nocturneFrame${index + 1}`]}`}
              src={asset(image)}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              key={image}
            />
          ))}
        </div>
        <div className={styles.nocturneShade} />

        <header className={styles.nocturneHeader}>
          <span className={styles.wordmark}>Sound District</span>
          <nav aria-label="Nocturne navigatie">
            <a href="#nocturne-rooms">Rooms</a>
            <a href="#nocturne-services">Services</a>
            <a href="#nocturne-process">Werkwijze</a>
            <a href="#nocturne-visit">Visit</a>
          </nav>
          <button type="button" data-booking="open">Plan <span>↗</span></button>
        </header>

        <div className={styles.nocturneCopy}>
          <p>Stadswaag 20 · Antwerpen</p>
          <h1>Maak iets dat <em>blijft hangen.</em></h1>
          <span className={styles.nocturneIntro}>Recording, productie en visuals in drie private rooms.</span>
          <button className={styles.nocturnePrimary} type="button" data-booking="open">
            Plan je sessie <span>↗</span>
          </button>
          <a href="#nocturne-rooms">Vergelijk de rooms <span>↓</span></a>
          <small>Aanvraag in ±2 minuten · persoonlijke bevestiging</small>
        </div>

        <div className={styles.nocturneProgress} aria-hidden="true">
          <span>01</span><i /><span>03</span>
        </div>
      </section>

      <section className={styles.nocturneRooms} id="nocturne-rooms">
        <div className={styles.nocturneSectionHead}>
          <p>Choose your atmosphere</p>
          <h2>Drie rooms.<br />Drie <em>frequencies.</em></h2>
        </div>
        <div className={styles.nocturneRail}>
          {rooms.map((room) => (
            <article key={room.id}>
              <div className={styles.nocturneRoomImage}>
                <Image src={asset(room.image)} alt={room.name} fill sizes="84vw" />
              </div>
              <div className={styles.nocturneRoomMeta}>
                <span>{room.number} · {room.use}</span>
                <h3>{room.name}</h3>
                <button type="button" data-booking={room.id}>Plan in {room.name} <b>↗</b></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.nocturneHouse} id="nocturne-services">
        <div className={styles.nocturneHouseImage}>
          <Image src={asset("Untitled-2.jpg")} alt="Infinity Room wordt klaargezet voor een visual session" fill sizes="(max-width: 800px) 100vw, 48vw" />
          <span>Private house · Stadswaag 20</span>
        </div>
        <div className={styles.nocturneHouseCopy}>
          <p>Beyond the room</p>
          <h2>Van eerste take tot <em>final form.</em></h2>
          <span>Boek alleen de room, of voeg precies de ondersteuning toe die je project nodig heeft.</span>
          <div>
            {fullServices.map(([number, title, copy]) => (
              <article key={number}>
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.nocturneMade}>
        <div className={styles.nocturneMadeCopy}>
          <p>Inside the district</p>
          <h2>Een plek die je werk <em>ruimte geeft.</em></h2>
          <span>
            SoundDistrict brengt sound, beeld en creatieve begeleiding samen in een private setting in het hart van Antwerpen.
          </span>
        </div>
        <div className={styles.nocturneMadeGrid}>
          <figure><Image src={asset("space2-new.jpg")} alt="On air-detail in de Red Room" fill sizes="34vw" /></figure>
          <figure><Image src={asset("blueroom-new1.jpg")} alt="Productiesessie in de Blue Room" fill sizes="42vw" /></figure>
          <figure><Image src={asset("room-infinity-editorial.webp")} alt="Visual session in de Infinity Room" fill sizes="34vw" /></figure>
        </div>
      </section>

      <section className={styles.nocturneProcess} id="nocturne-process">
        <div>
          <p>The process</p>
          <h2>Kies. Plan.<br /><em>Create.</em></h2>
        </div>
        <ol>
          {bookingSteps.map(([number, title, copy]) => (
            <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>
          ))}
        </ol>
        <button type="button" data-booking="open">Start je aanvraag <span>↗</span></button>
      </section>

      <section className={styles.nocturneApp}>
        <div className={styles.nocturneAppMock} aria-hidden="true">
          <span>SD / Sessions</span>
          <strong>Blue Room</strong>
          <small>Za 25 jul · 14:00—17:00</small>
          <i>Confirmed</i>
        </div>
        <div>
          <p>For returning artists</p>
          <h2>Je volgende sessie.<br /><em>Nog sneller geregeld.</em></h2>
          <span>De SoundDistrict-app wordt je plek voor rebooking, sessiebeheer en updates.</span>
          <small>App in ontwikkeling</small>
        </div>
      </section>

      <section className={styles.nocturneVisit} id="nocturne-visit">
        <div className={styles.nocturneVisitImage}>
          <Image src={asset("hero.png")} alt="Entree van SoundDistrict in Antwerpen" fill sizes="(max-width: 800px) 100vw, 55vw" />
        </div>
        <div>
          <p>Visit the district</p>
          <h2>Stadswaag 20<br /><em>2000 Antwerpen.</em></h2>
          <span>Alle sessies zijn op afspraak. Eerst je project bespreken? Mail ons rechtstreeks.</span>
          <a href="mailto:team@sounddistrict.be">team@sounddistrict.be ↗</a>
          <button type="button" data-booking="open">Plan je sessie <b>→</b></button>
        </div>
      </section>

      <section className={styles.nocturneFinal}>
        <p>Sound · Production · Visuals</p>
        <h2>Your next session<br />starts <em>here.</em></h2>
        <button type="button" data-booking="open">Plan je sessie <span>→</span></button>
      </section>
      <footer className={styles.nocturneFooter}>
        <strong>Sound District</strong>
        <span>A private house for sound &amp; image.</span>
        <div><a href="mailto:team@sounddistrict.be">Contact</a><a href="https://www.instagram.com/sounddistrict.be">Instagram ↗</a><Link href="/privacy/">Privacy</Link></div>
        <small>© 2026 SoundDistrict Antwerp · VAT BE 1023.309.121</small>
      </footer>
      <ConceptStickyController />
      <BookingFlow />
    </main>
  );
}

function SoundIssue({ asset }: { asset: (name: string) => string }) {
  return (
    <main className={`${styles.preview} ${styles.soundIssue}`}>
      <section className={styles.issueHero} data-concept-hero>
        <header className={styles.issueHeader}>
          <span>Sound District</span>
          <nav aria-label="Editorial navigatie">
            <a href="#issue-rooms">Rooms</a>
            <a href="#issue-services">Services</a>
            <a href="#issue-process">Werkwijze</a>
            <a href="#issue-visit">Visit</a>
          </nav>
          <button type="button" data-booking="open">Start aanvraag ↗</button>
        </header>

        <div className={styles.issueCover}>
          <div className={styles.issueMainImage}>
            <Image src={asset("room-red-editorial.webp")} alt="Red Room bij SoundDistrict" fill priority sizes="(max-width: 800px) 100vw, 58vw" />
          </div>
          <div className={styles.issueSecondaryImage}>
            <Image src={asset("room-infinity-editorial.webp")} alt="Infinity Room bij SoundDistrict" fill sizes="34vw" />
          </div>
          <span className={styles.issueVertical}>The Sound Issue</span>
          <span className={styles.issueNumber}>Nº 01</span>
          <button className={styles.issueCoverCta} type="button" data-booking="open">
            Start je aanvraag <span>↗</span>
          </button>
        </div>

        <div className={styles.issueHeroCopy}>
          <p>A private house for sound &amp; image</p>
          <h1>Ruimte voor werk<br />dat <em>blijft.</em></h1>
          <div>
            <span>Recording, productie en beeld in drie zorgvuldig ontworpen ruimtes in Antwerpen.</span>
            <button type="button" data-booking="open">Start je aanvraag <b>↗</b></button>
            <small>Geen betaling · prijs en moment worden persoonlijk bevestigd</small>
          </div>
        </div>
      </section>

      <section className={styles.issueRooms} id="issue-rooms">
        <div className={styles.issueRoomsHead}>
          <span>03 rooms · 01 creative house</span>
          <h2>Choose your <em>setting.</em></h2>
        </div>
        <div className={styles.issueRoomList}>
          {rooms.map((room) => (
            <article key={room.id}>
              <div className={styles.issueRoomImage}>
                <Image src={asset(room.image)} alt={room.name} fill sizes="(max-width: 800px) 88vw, 31vw" />
                <span>{room.number}</span>
              </div>
              <p>{room.use}</p>
              <h3>{room.name}</h3>
              <button type="button" data-booking={room.id}>Kies {room.name} <span>↗</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.issueStory}>
        <div className={styles.issueStoryTitle}>
          <span>Feature · The house</span>
          <h2>Een private setting.<br /><em>Een complete creative flow.</em></h2>
        </div>
        <div className={styles.issueStoryBody}>
          <figure><Image src={asset("blueroom-new1.jpg")} alt="Makers werken in de Blue Room" fill sizes="(max-width: 800px) 100vw, 50vw" /></figure>
          <div>
            <span>SoundDistrict / Antwerpen</span>
            <p>
              Drie rooms, elk met een eigen karakter. Eén team dat de praktische details afstemt zodat jij meteen kunt beginnen.
            </p>
            <p>
              Van een vocal take en productie tot mix, coverbeeld of performance session: je bouwt alleen wat je nodig hebt.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.issueServices} id="issue-services">
        <div className={styles.issueServicesIntro}>
          <span>Index / Services</span>
          <h2>The complete<br /><em>session menu.</em></h2>
        </div>
        <div className={styles.issueServiceIndex}>
          {fullServices.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.issueProcess} id="issue-process">
        <div>
          <span>Booking notes · 01—03</span>
          <h2>Van keuze naar sessie,<br /><em>zonder omwegen.</em></h2>
        </div>
        <ol>
          {bookingSteps.map(([number, title, copy]) => (
            <li key={number}><b>{number}</b><h3>{title}</h3><p>{copy}</p></li>
          ))}
        </ol>
        <button type="button" data-booking="open">Start je aanvraag <span>↗</span></button>
      </section>

      <section className={styles.issueApp}>
        <div>
          <span>Next issue · SoundDistrict app</span>
          <h2>Your sessions,<br /><em>in your pocket.</em></h2>
          <p>Opnieuw boeken, sessies beheren en updates ontvangen vanuit één rustige plek.</p>
          <small>In ontwikkeling</small>
        </div>
        <div className={styles.issueAppCard} aria-hidden="true">
          <span>Upcoming session</span>
          <strong>Red Room</strong>
          <i>Recording · 3 hours</i>
          <b>25 / 07 / 2026</b>
        </div>
      </section>

      <section className={styles.issueVisit} id="issue-visit">
        <div>
          <span>Visit / Contact</span>
          <h2>Find us in<br /><em>the district.</em></h2>
          <p>Stadswaag 20<br />2000 Antwerpen</p>
          <a href="mailto:team@sounddistrict.be">team@sounddistrict.be ↗</a>
          <button type="button" data-booking="open">Kies je room &amp; moment <b>↗</b></button>
        </div>
        <figure><Image src={asset("hero.png")} alt="SoundDistrict aan Stadswaag 20" fill sizes="(max-width: 800px) 100vw, 58vw" /></figure>
      </section>

      <section className={styles.issueFinal}>
        <span>SoundDistrict · Stadswaag 20</span>
        <h2>Ready when<br /><em>you are.</em></h2>
        <button type="button" data-booking="open">Start je aanvraag <b>↗</b></button>
      </section>
      <footer className={styles.issueFooter}>
        <span>Sound District · Antwerp</span>
        <strong>The Sound Issue</strong>
        <div><a href="mailto:team@sounddistrict.be">Contact</a><a href="https://www.instagram.com/sounddistrict.be">Instagram ↗</a><Link href="/privacy/">Privacy</Link></div>
        <small>© 2026 · Stadswaag 20 · VAT BE 1023.309.121</small>
      </footer>
      <ConceptStickyController />
      <BookingFlow />
    </main>
  );
}

function Concierge({ asset, basePath }: { asset: (name: string) => string; basePath: string }) {
  return (
    <main className={`${styles.preview} ${styles.concierge}`}>
      <section className={styles.conciergeHero} data-concept-hero>
        <header className={styles.conciergeHeader}>
          <span className={styles.wordmark}>Sound District</span>
          <nav aria-label="Concierge navigatie">
            <a href="#concierge-rooms">Rooms</a>
            <a href="#concierge-services">Services</a>
            <a href="#concierge-process">Werkwijze</a>
            <a href="#concierge-visit">Visit</a>
          </nav>
          <button type="button" data-booking="open">Plan je sessie ↗</button>
        </header>

        <ConciergeExperience basePath={basePath} />
      </section>

      <section className={styles.conciergeProof}>
        <span><b>03</b> unieke rooms</span>
        <span><b>01</b> private house</span>
        <span><b>2000</b> Antwerpen</span>
      </section>

      <section className={styles.conciergeCompare} id="concierge-rooms">
        <div>
          <p>Find your room</p>
          <h2>Een setting voor<br />ieder <em>idee.</em></h2>
        </div>
        <div className={styles.conciergeCards}>
          {rooms.map((room) => (
            <article key={room.id}>
              <div>
                <Image src={asset(room.image)} alt={room.name} fill sizes="80vw" />
              </div>
              <span>{room.number} · {room.capacity}</span>
              <h3>{room.name}</h3>
              <p>{room.use}</p>
              <button type="button" data-booking={room.id}>Kies deze room <b>→</b></button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.conciergeServices} id="concierge-services">
        <div className={styles.conciergeServicesHead}>
          <span>Build your session</span>
          <h2>De room is het begin.<br /><em>Jij kiest wat volgt.</em></h2>
          <p>Voeg ondersteuning toe wanneer je ze nodig hebt. Geen vaste pakketten, geen overbodige stappen.</p>
        </div>
        <div className={styles.conciergeServiceCards}>
          {fullServices.map(([number, title, copy]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><button type="button" data-booking="open">Plan met support <b>→</b></button></article>
          ))}
        </div>
      </section>

      <section className={styles.conciergeProcess} id="concierge-process">
        <div className={styles.conciergeProcessIntro}>
          <span>Your session, handled</span>
          <h2>Van eerste keuze<br />tot <em>bevestigde sessie.</em></h2>
          <button type="button" data-booking="open">Bekijk momenten <b>→</b></button>
        </div>
        <ol>
          {bookingSteps.map(([number, title, copy]) => (
            <li key={number}><b>{number}</b><div><h3>{title}</h3><p>{copy}</p></div></li>
          ))}
        </ol>
      </section>

      <section className={styles.conciergeApp}>
        <div className={styles.conciergePhone} aria-hidden="true">
          <span>SoundDistrict</span>
          <small>Next session</small>
          <strong>Infinity Room</strong>
          <i>Confirmed · 18:00</i>
          <b>Manage session →</b>
        </div>
        <div>
          <span>For returning artists</span>
          <h2>Boeken wordt nog<br /><em>persoonlijker.</em></h2>
          <p>De app wordt de plek voor snelle rebooking, planning, sessie-updates en support.</p>
          <small>SoundDistrict app · in ontwikkeling</small>
        </div>
      </section>

      <section className={styles.conciergeVisit} id="concierge-visit">
        <figure><Image src={asset("hero.png")} alt="SoundDistrict aan Stadswaag 20" fill sizes="(max-width: 800px) 100vw, 50vw" /></figure>
        <div>
          <span>Your private address</span>
          <h2>Stadswaag 20<br /><em>Antwerpen.</em></h2>
          <p>Alle sessies zijn op afspraak. Persoonlijk advies nodig voor je kiest?</p>
          <a href="mailto:team@sounddistrict.be">Bespreek je project →</a>
          <button type="button" data-booking="open">Plan je sessie <b>→</b></button>
        </div>
      </section>

      <section className={styles.conciergeFinal}>
        <span>Ready when you are</span>
        <h2>Kies je room.<br /><em>Wij regelen de rest.</em></h2>
        <button type="button" data-booking="open">Start je aanvraag <b>→</b></button>
      </section>
      <footer className={styles.conciergeFooter}>
        <strong>Sound District</strong>
        <span>Private session concierge · Antwerp</span>
        <div><a href="mailto:team@sounddistrict.be">Contact</a><a href="https://www.instagram.com/sounddistrict.be">Instagram ↗</a><Link href="/privacy/">Privacy</Link></div>
        <small>© 2026 · VAT BE 1023.309.121</small>
      </footer>
      <ConceptStickyController />
      <BookingFlow />
    </main>
  );
}

function Pulse({ asset }: { asset: (name: string) => string }) {
  return (
    <main className={`${styles.preview} ${styles.pulse}`}>
      <section className={styles.pulseHero} data-concept-hero>
        <header className={styles.pulseHeader}>
          <span className={styles.wordmark}>Sound District</span>
          <nav aria-label="Pulse navigatie">
            <a href="#pulse-rooms">Rooms</a>
            <a href="#pulse-services">Services</a>
            <a href="#pulse-process">Werkwijze</a>
            <a href="#pulse-visit">Visit</a>
          </nav>
          <button type="button" data-booking="open">Book a session ↗</button>
        </header>

        <div className={styles.pulseCollage} aria-hidden="true">
          <div className={styles.pulseImageOne}><Image src={asset("room-blue-editorial.webp")} alt="" fill priority sizes="56vw" /></div>
          <div className={styles.pulseImageTwo}><Image src={asset("space2-new.jpg")} alt="" fill sizes="44vw" /></div>
          <div className={styles.pulseImageThree}><Image src={asset("Untitled-2.jpg")} alt="" fill sizes="42vw" /></div>
        </div>

        <div className={styles.pulseCopy}>
          <p>Sound · Image · Culture · Antwerp</p>
          <h1>Book the room.<br /><em>Make the record.</em></h1>
          <span>Drie ruimtes voor recording, productie en visuals. Eén plek om ideeën echt af te maken.</span>
          <button type="button" data-booking="open">Plan je sessie <b>↗</b></button>
        </div>

        <div className={styles.pulseStamp}>SD<br /><span>2000</span></div>
      </section>

      <div className={styles.pulseTicker} aria-hidden="true">
        <div>
          <span>Blue Room · Red Room · Infinity · Book your session ·</span>
          <span>Blue Room · Red Room · Infinity · Book your session ·</span>
        </div>
      </div>

      <section className={styles.pulseRooms} id="pulse-rooms">
        <div className={styles.pulseRoomsHead}>
          <p>Pick your energy</p>
          <h2>Choose a room.<br />Change the <em>frequency.</em></h2>
        </div>
        <div className={styles.pulseGrid}>
          {rooms.map((room, index) => (
            <article className={styles[`pulseCard${index + 1}`]} key={room.id}>
              <div>
                <Image src={asset(room.image)} alt={room.name} fill sizes="(max-width: 800px) 100vw, 33vw" />
              </div>
              <span>{room.number} / {room.use}</span>
              <h3>{room.name}</h3>
              <button type="button" data-booking={room.id}>Book {room.name} <b>↗</b></button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pulseMade}>
        <div className={styles.pulseMadeTitle}>
          <p>Made in the district</p>
          <h2>Sound. Image.<br /><em>All under one roof.</em></h2>
        </div>
        <div className={styles.pulseMadeCollage}>
          <figure><Image src={asset("space2-new.jpg")} alt="Red Room detail" fill sizes="32vw" /><span>Record</span></figure>
          <figure><Image src={asset("blueroom-new1.jpg")} alt="Blue Room productiesessie" fill sizes="44vw" /><span>Produce</span></figure>
          <figure><Image src={asset("Untitled-2.jpg")} alt="Infinity Room visual setup" fill sizes="32vw" /><span>Shoot</span></figure>
        </div>
      </section>

      <section className={styles.pulseServices} id="pulse-services">
        <div>
          <span>What we do / 01—04</span>
          <h2>Bring the idea.<br /><em>Build the release.</em></h2>
        </div>
        <div className={styles.pulseServiceList}>
          {fullServices.map(([number, title, copy]) => (
            <article key={number}><b>{number}</b><h3>{title}</h3><p>{copy}</p><span>↗</span></article>
          ))}
        </div>
      </section>

      <section className={styles.pulseProcess} id="pulse-process">
        <div className={styles.pulseProcessTitle}>
          <span>How it works</span>
          <h2>Three steps.<br /><em>Zero noise.</em></h2>
        </div>
        <ol>
          {bookingSteps.map(([number, title, copy]) => (
            <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>
          ))}
        </ol>
        <button type="button" data-booking="open">Plan je sessie <b>↗</b></button>
      </section>

      <section className={styles.pulseApp}>
        <div>
          <span>Coming next</span>
          <h2>The district.<br /><em>In your pocket.</em></h2>
          <p>Boek opnieuw, beheer je sessies en blijf verbonden met SoundDistrict.</p>
          <small>App in ontwikkeling</small>
        </div>
        <div className={styles.pulseAppScreen} aria-hidden="true">
          <span>SD / My sessions</span>
          <strong>Red Room</strong>
          <small>Recording session</small>
          <b>Confirmed</b>
          <i>Open session →</i>
        </div>
      </section>

      <section className={styles.pulseVisit} id="pulse-visit">
        <figure><Image src={asset("hero.png")} alt="SoundDistrict in Antwerpen" fill sizes="(max-width: 800px) 100vw, 58vw" /></figure>
        <div>
          <span>Visit / Antwerp</span>
          <h2>Find your<br /><em>frequency.</em></h2>
          <p>Stadswaag 20<br />2000 Antwerpen</p>
          <a href="mailto:team@sounddistrict.be">team@sounddistrict.be ↗</a>
          <button type="button" data-booking="open">Book your session <b>↗</b></button>
        </div>
      </section>

      <section className={styles.pulseFinal}>
        <span>Stadswaag 20 · 2000 Antwerp</span>
        <h2>Ready to<br /><em>make noise?</em></h2>
        <button type="button" data-booking="open">Book your session <b>→</b></button>
      </section>
      <footer className={styles.pulseFooter}>
        <strong>Sound District</strong>
        <span>Sound · Image · Culture · Antwerp</span>
        <div><a href="mailto:team@sounddistrict.be">Contact</a><a href="https://www.instagram.com/sounddistrict.be">Instagram ↗</a><Link href="/privacy/">Privacy</Link></div>
        <small>© 2026 · Stadswaag 20 · VAT BE 1023.309.121</small>
      </footer>
      <ConceptStickyController />
      <BookingFlow />
    </main>
  );
}

export function ConceptShowcase({ slug }: { slug: ConceptSlug }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const asset = (name: string) => `${basePath}/${name}`;

  if (slug === "nocturne") return <Nocturne asset={asset} />;
  if (slug === "sound-issue") return <SoundIssue asset={asset} />;
  if (slug === "concierge") return <Concierge asset={asset} basePath={basePath} />;
  return <Pulse asset={asset} />;
}
