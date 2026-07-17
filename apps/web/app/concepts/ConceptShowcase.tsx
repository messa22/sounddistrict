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

function PreviewNavigation({ slug }: { slug: ConceptSlug }) {
  const activeIndex = conceptDirections.findIndex((concept) => concept.slug === slug);
  const previous = conceptDirections[(activeIndex + conceptDirections.length - 1) % conceptDirections.length];
  const next = conceptDirections[(activeIndex + 1) % conceptDirections.length];

  return (
    <nav className={styles.previewNavigation} aria-label="Conceptnavigatie">
      <Link href="/concepts/" className={styles.allConcepts}>
        <span aria-hidden="true">←</span> Alle 4
      </Link>
      <span className={styles.activeConcept}>Concept {conceptDirections[activeIndex].id} · {conceptDirections[activeIndex].name}</span>
      <div className={styles.conceptArrows}>
        <Link href={`/concepts/${previous.slug}/`} aria-label={`Vorige richting: ${previous.name}`}>←</Link>
        <Link href={`/concepts/${next.slug}/`} aria-label={`Volgende richting: ${next.name}`}>→</Link>
      </div>
    </nav>
  );
}

function Nocturne({ asset }: { asset: (name: string) => string }) {
  const nocturneScenes = ["hero.png", "room-red-editorial.webp", "room-blue-editorial.webp"];

  return (
    <main className={`${styles.preview} ${styles.nocturne}`}>
      <PreviewNavigation slug="nocturne" />

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

      <section className={styles.nocturneFinal}>
        <p>Sound · Production · Visuals</p>
        <h2>Your next session<br />starts <em>here.</em></h2>
        <button type="button" data-booking="open">Plan je sessie <span>→</span></button>
      </section>
      <ConceptStickyController />
      <BookingFlow />
    </main>
  );
}

function SoundIssue({ asset }: { asset: (name: string) => string }) {
  return (
    <main className={`${styles.preview} ${styles.soundIssue}`}>
      <PreviewNavigation slug="sound-issue" />

      <section className={styles.issueHero} data-concept-hero>
        <header className={styles.issueHeader}>
          <span>Sound District</span>
          <span>Antwerp · Issue 01</span>
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

      <section className={styles.issueRooms}>
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

      <section className={styles.issueFinal}>
        <span>SoundDistrict · Stadswaag 20</span>
        <h2>Ready when<br /><em>you are.</em></h2>
        <button type="button" data-booking="open">Start je aanvraag <b>↗</b></button>
      </section>
      <ConceptStickyController />
      <BookingFlow />
    </main>
  );
}

function Concierge({ asset, basePath }: { asset: (name: string) => string; basePath: string }) {
  return (
    <main className={`${styles.preview} ${styles.concierge}`}>
      <PreviewNavigation slug="concierge" />

      <section className={styles.conciergeHero} data-concept-hero>
        <header className={styles.conciergeHeader}>
          <span className={styles.wordmark}>Sound District</span>
          <span>Private session concierge</span>
        </header>

        <ConciergeExperience basePath={basePath} />
      </section>

      <section className={styles.conciergeProof}>
        <span><b>03</b> unieke rooms</span>
        <span><b>01</b> private house</span>
        <span><b>2000</b> Antwerpen</span>
      </section>

      <section className={styles.conciergeCompare}>
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
      <ConceptStickyController />
      <BookingFlow />
    </main>
  );
}

function Pulse({ asset }: { asset: (name: string) => string }) {
  return (
    <main className={`${styles.preview} ${styles.pulse}`}>
      <PreviewNavigation slug="pulse" />

      <section className={styles.pulseHero} data-concept-hero>
        <header className={styles.pulseHeader}>
          <span className={styles.wordmark}>Sound District</span>
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

      <section className={styles.pulseRooms}>
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

      <section className={styles.pulseFinal}>
        <span>Stadswaag 20 · 2000 Antwerp</span>
        <h2>Ready to<br /><em>make noise?</em></h2>
        <button type="button" data-booking="open">Book your session <b>→</b></button>
      </section>
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
