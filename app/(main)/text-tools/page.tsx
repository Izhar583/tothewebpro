import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Text Tools",
  description:
    "Word counters, case converters, and character utilities for writers and editors.",
  alternates: { canonical: "https://tothewebpro.com/text-tools" },
};

export default function TextToolsPage() {
  const tools = TOOLS.filter((t) => t.category === "text");
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Text Tools
      </h1>
      <p className="mt-3 max-w-2xl text-body">
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
