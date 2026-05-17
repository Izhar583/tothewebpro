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
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-4">
        <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">SEO Power</span>
      </div>
      <h1 className="text-4xl font-black tracking-tight text-slate-900">
        SEO Tools
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 font-medium leading-relaxed">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="light" />
          ))}
        </div>
      </section>
    </div>
  );
}