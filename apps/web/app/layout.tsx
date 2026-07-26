import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoundDistrict Antwerp | Sound & image studios",
  description:
    "Three private districts for recording, production and visuals in the heart of Antwerp. Book your session at SoundDistrict.",
  metadataBase: new URL("https://sounddistrict.be"),
  openGraph: {
    title: "SoundDistrict Antwerp",
    description: "A private house for sound and image in Antwerp.",
    type: "website",
    locale: "en_GB"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
