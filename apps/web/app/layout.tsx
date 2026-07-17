import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "SoundDistrict Antwerp | Boek je studiosessie",
  description:
    "Boek een recording-, hiphop- of contentstudio in hartje Antwerpen. Kies je room, moment en extra's in enkele stappen.",
  metadataBase: new URL("https://sounddistrict.be"),
  openGraph: {
    title: "SoundDistrict Antwerp",
    description: "One hub. Three rooms. Built for output.",
    type: "website",
    locale: "nl_BE"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
