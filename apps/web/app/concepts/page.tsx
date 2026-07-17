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
        <span>Design directions · 01—04</span>
      </header>

      <section className={styles.galleryIntro}>
        <p>Choose the feeling</p>
        <h1>Vier richtingen.<br /><em>Eén nieuwe SoundDistrict.</em></h1>
        <div>
          <p>
            Niet vier kleuren van dezelfde website, maar vier verschillende manieren waarop het merk kan voelen, bewegen en converteren.
          </p>
          <span>Open elk concept op volledig scherm en kies de richting die je het sterkst aantrekt.</span>
        </div>
      </section>

      <section className={styles.galleryList} aria-label="Vier visuele richtingen">
        {conceptDirections.map((concept, index) => (
          <article className={`${styles.galleryCard} ${styles[`galleryCard${index + 1}`]}`} key={concept.slug}>
            <Link href={`/concepts/${concept.slug}/`} aria-label={`Open concept ${concept.id}: ${concept.name}`}>
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
                  <span>Concept {concept.id}</span>
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
                <b>Open fullscreen ↗</b>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <footer className={styles.galleryFooter}>
        <span>SoundDistrict · Antwerp</span>
        <p>Kies eerst het gevoel. Daarna combineren en verfijnen we de beste onderdelen.</p>
        <Link href="/">Huidige website bekijken ↗</Link>
      </footer>
    </main>
  );
}
