import { notFound } from "next/navigation";
import {
  ConceptShowcase,
  conceptDirections,
  type ConceptSlug
} from "../ConceptShowcase";

export const dynamicParams = false;

export function generateStaticParams() {
  return conceptDirections.map((concept) => ({ slug: concept.slug }));
}

export default async function ConceptPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = conceptDirections.find((item) => item.slug === slug);

  if (!concept) notFound();
  return <ConceptShowcase slug={concept.slug as ConceptSlug} />;
}
