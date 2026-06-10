import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Free Online Text Tools | Word Counter, Case Converter & More",
  description:
    "Free online text tools including word counter, character counter, and case converter for writers, students, and content creators.",
  alternates: { canonical: "https://tothewebpro.com/text-tools" },
};

export default function TextToolsPage() {
  const tools = TOOLS.filter((t) => t.category === "text");
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-4">
        <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Text Utilities</span>
      </div>
      <h1 className="text-4xl font-black tracking-tight text-slate-900">
        Text Tools
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 font-medium leading-relaxed">
        Speed up editorial QA with instant stats, casing conversions, and
        character budgeting for channels with strict limits.
      </p>
      <section
        className="mt-10"
        aria-labelledby="text-tools-grid-heading"
      >
        <h2 id="text-tools-grid-heading" className="sr-only">
          Text tool catalog
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