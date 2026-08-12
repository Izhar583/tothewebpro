import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolRenderer } from "@/components/ToolRenderer";
import { JsonLd } from "@/components/JsonLd";
import { TOOL_BY_SLUG, TOOLS } from "@/lib/tools-data";

import { getToolSchemas } from "@/lib/schema";

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
    robots: tool.noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = TOOL_BY_SLUG[params.slug];
  if (!tool) {
    notFound();
  }

  const schemas = getToolSchemas(tool);

  return (
    <>
      {tool.noIndex && <meta name="robots" content="noindex, nofollow" />}
      <JsonLd data={schemas.softwareApp} />
      <JsonLd data={schemas.breadcrumb} />
      <JsonLd data={schemas.faq} />
      <ToolPageLayout tool={tool}>
        <ToolRenderer slug={params.slug} />
      </ToolPageLayout>
    </>
  );
}
