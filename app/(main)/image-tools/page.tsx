import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Free Online Image Tools | Compress, Resize & Convert Images",
  description:
    "Free online image compression, resizing, and conversion tools. Optimize images for faster websites without quality loss and no upload limits.",
  alternates: { canonical: "https://tothewebpro.com/image-tools" },
};

export default function ImageToolsPage() {
  const tools = TOOLS.filter((t) => t.category === "image");
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">
        Image Tools
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 font-medium leading-relaxed">
        Prepare lightweight creatives for web and social without uploading
        sensitive assets to a server.
      </p>
      <section
        className="mt-10"
        aria-labelledby="image-tools-grid-heading"
      >
        <h2 id="image-tools-grid-heading" className="sr-only">
          Image tool catalog
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="light" />
          ))}
        </div>
      </section>
    </div>
  );
}