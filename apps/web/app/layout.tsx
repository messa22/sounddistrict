import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoundDistrict Antwerp | Sound & image studios",
  description:
    "Drie private ruimtes voor sound, recording en beeld in hartje Antwerpen. Plan je sessie bij SoundDistrict.",
  metadataBase: new URL("https://sounddistrict.be"),
  openGraph: {
    title: "SoundDistrict Antwerp",
    description: "A private house for sound and image in Antwerp.",
    type: "website",
    locale: "nl_BE"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
