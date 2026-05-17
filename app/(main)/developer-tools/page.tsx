import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Developer Tools",
  description:
    "Developer-focused utilities from ToTheWebPro including secure password generation.",
  alternates: { canonical: "https://tothewebpro.com/developer-tools" },
};

export default function DeveloperToolsPage() {
  const tools = TOOLS.filter((t) => t.category === "developer");
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-4">
        <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Developer Suite</span>
      </div>
      <h1 className="text-4xl font-black tracking-tight text-slate-900">
        Developer Tools
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 font-medium leading-relaxed">
        Small, sharp helpers for shipping safely—more encoders and formatters
        arrive in Phase 2.
      </p>
      <section
        className="mt-10"
        aria-labelledby="developer-tools-grid-heading"
      >
        <h2 id="developer-tools-grid-heading" className="sr-only">
          Developer tool catalog
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