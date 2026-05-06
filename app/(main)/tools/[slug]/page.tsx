import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolRenderer } from "@/components/ToolRenderer";
import { JsonLd } from "@/components/JsonLd";
import { TOOL_BY_SLUG, TOOLS } from "@/lib/tools-data";

interface ToolPageProps {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const tool = TOOL_BY_SLUG[params.slug];
  if (!tool) {
    return {};
  }
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: `https://tothewebpro.com/tools/${tool.slug}` },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `https://tothewebpro.com/tools/${tool.slug}`,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = TOOL_BY_SLUG[params.slug];
  if (!tool) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: `https://tothewebpro.com/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    description: tool.schemaDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolPageLayout tool={tool}>
        <ToolRenderer slug={params.slug} />
      </ToolPageLayout>
    </>
  );
}
