import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Terug naar SoundDistrict</Link>
      <p className="section-label">Privacy</p>
      <h1>Heldere afspraken.<br /><em>Geen verborgen tracking.</em></h1>
      <div className="legal-copy">
        <section>
          <h2>Boekingsaanvragen</h2>
          <p>
            Wanneer je een aanvraag voorbereidt, gebruiken we je naam, e-mailadres, optionele telefoonnummer en projectinformatie uitsluitend om je sessie te bespreken en te beantwoorden.
          </p>
        </section>
        <section>
          <h2>Hoe de website werkt</h2>
          <p>
            De website bewaart je formuliergegevens niet in de browser of in een website-database. De laatste stap opent je eigen e-mailapp; pas wanneer jij die e-mail verstuurt, ontvangt SoundDistrict je aanvraag.
          </p>
        </section>
        <section>
          <h2>Jouw gegevens</h2>
          <p>
            Voor inzage, correctie of verwijdering van gegevens die je per e-mail hebt gedeeld, neem je contact op via <a href="mailto:team@sounddistrict.be">team@sounddistrict.be</a>.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>SoundDistrict · Stadswaag 20 · 2000 Antwerpen · VAT BE 1023.309.121</p>
        </section>
      </div>
    </main>
  );
}
