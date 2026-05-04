import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "SEO Tools",
  description:
    "Free SEO utilities from ToTheWebPro including meta title and description analysis.",
  alternates: { canonical: "https://tothewebpro.com/seo-tools" },
};

export default function SeoToolsPage() {
  const tools = TOOLS.filter((t) => t.category === "seo");
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        SEO Tools
      </h1>
      <p className="mt-3 max-w-2xl text-body">
        Inspect snippets, validate copy length, and support technical audits
        with lightweight utilities tuned for UK and US workflows.
      </p>
      <section
        className="mt-10"
        aria-labelledby="seo-tools-grid-heading"
      >
        <h2 id="seo-tools-grid-heading" className="sr-only">
          SEO tool catalog
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
