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
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Developer Tools
      </h1>
      <p className="mt-3 max-w-2xl text-body">
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
