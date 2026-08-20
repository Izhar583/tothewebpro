import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="w-full">
      {/* Humanized Hero Header */}
      <header className="pb-8 border-b border-slate-200/80">
        {/* Clean Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">Image Tools</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Image & Creative Tools
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Compress, resize, convert formats, and remove image backgrounds with on-device browser processing for maximum privacy and speed.
          </p>
        </div>
      </header>

      {/* Catalog Section */}
      <section className="pt-10" aria-labelledby="image-tools-grid-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="image-tools-grid-heading" className="text-xl font-bold text-slate-900">
            Available Tools <span className="text-sm font-semibold text-slate-400 ml-1.5">({tools.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="light" />
          ))}
        </div>
      </section>
    </div>
  );
}