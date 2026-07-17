import Image from "next/image";
import Link from "next/link";
import { conceptDirections } from "./ConceptShowcase";
import styles from "./concepts.module.css";

const previewImages = [
  "room-red-editorial.webp",
  "room-infinity-editorial.webp",
  "room-blue-editorial.webp",
  "room-red-editorial.webp"
];

export default function ConceptsPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <main className={styles.gallery}>
      <header className={styles.galleryHeader}>
        <Link href="/" aria-label="Terug naar de huidige SoundDistrict-site">Sound District</Link>
        <span>Vier volledige websites · 01—04</span>
      </header>

      <section className={styles.galleryIntro}>
        <p>Four complete websites</p>
        <h1>Vier websites.<br /><em>Vier totaal andere ervaringen.</em></h1>
        <div>
          <p>
            Iedere versie heeft een eigen navigatie, homepage-opbouw, rooms, services, werkwijze, booking, app-verhaal en contactervaring.
          </p>
          <span>Open iedere website afzonderlijk en beoordeel ze alsof dit de echte SoundDistrict-site is.</span>
        </div>
      </section>

      <section className={styles.galleryList} aria-label="Vier volledige SoundDistrict-websites">
        {conceptDirections.map((concept, index) => (
          <article className={`${styles.galleryCard} ${styles[`galleryCard${index + 1}`]}`} key={concept.slug}>
            <Link href={`/websites/${concept.slug}/`} aria-label={`Open website ${concept.id}: ${concept.name}`}>
              <div className={styles.galleryCardVisual}>
                <Image
                  src={`${basePath}/${previewImages[index]}`}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
                <div className={styles.galleryMockNav}>
                  <span>Sound District</span>
                  <span>Website {concept.id}</span>
                </div>
                <div className={styles.galleryMockCopy}>
                  <span>{concept.mood}</span>
                  <strong>{concept.name}</strong>
                </div>
              </div>
              <div className={styles.galleryCardInfo}>
                <span>{concept.id}</span>
                <div>
                  <p>{concept.mood}</p>
                  <h2>{concept.name}</h2>
                  <span>{concept.summary}</span>
                </div>
                <b>Open volledige website ↗</b>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <footer className={styles.galleryFooter}>
        <span>SoundDistrict · Antwerp</span>
        <p>Kies de volledige website die het dichtst bij jouw ideale SoundDistrict komt.</p>
        <Link href="/">Huidige website bekijken ↗</Link>
      </footer>
    </main>
  );
}
