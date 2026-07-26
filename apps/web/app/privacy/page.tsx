import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/websites/nocturne/" className="legal-back">← Back to Sound District</Link>
      <p className="section-label">Privacy</p>
      <h1>Clear agreements.<br /><em>No hidden tracking.</em></h1>
      <div className="legal-copy">
        <section>
          <h2>Booking requests</h2>
          <p>
            When you prepare a request, we use your name, email address, optional phone number and project information only to discuss and respond to your session.
          </p>
        </section>
        <section>
          <h2>How the website works</h2>
          <p>
            The website does not store your form data in the browser or in a website database. The final step opens your own email app; SoundDistrict receives your request only after you send that email.
          </p>
        </section>
        <section>
          <h2>Your information</h2>
          <p>
            To access, correct or delete information you shared by email, contact us at <a href="mailto:team@sounddistrict.be">team@sounddistrict.be</a>.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>SoundDistrict · Stadswaag 20 · 2000 Antwerp · VAT BE 1023.309.121</p>
        </section>
      </div>
    </main>
  );
}
