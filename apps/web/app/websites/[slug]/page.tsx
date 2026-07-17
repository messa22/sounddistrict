import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConceptShowcase,
  conceptDirections,
  type ConceptSlug
} from "../../concepts/ConceptShowcase";

export const dynamicParams = false;

export function generateStaticParams() {
  return conceptDirections.map((website) => ({ slug: website.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const website = conceptDirections.find((item) => item.slug === slug);

  if (!website) return {};
  return {
    title: `SoundDistrict — ${website.name}`,
    description: website.summary
  };
}

export default async function WebsitePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const website = conceptDirections.find((item) => item.slug === slug);

  if (!website) notFound();
  return <ConceptShowcase slug={website.slug as ConceptSlug} />;
}
