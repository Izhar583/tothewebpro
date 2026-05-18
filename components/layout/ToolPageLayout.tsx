"use client";

import Link from "next/link";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { TOOL_BY_SLUG } from "@/lib/tools-data";
import type { ToolDefinition } from "@/lib/types";
import { AdSlot } from "@/components/ui/AdSlot";
import { getToolCardIcon } from "@/lib/tool-card-icons";

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: tool.categoryLabel, href: tool.categoryPath },
    { label: tool.name },
  ];

  return (
    <div className="mx-auto max-w-full py-2">
      <div className="flex flex-col gap-6">
        <div>
          <Breadcrumb items={crumbs} />
          <h1 className="mt-4 text-3xl font-black md:text-5xl text-slate-900 tracking-tight">
            {tool.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 font-medium leading-relaxed">
            {tool.shortDescription}
          </p>

          <div className="mt-8">{children}</div>

          <div className="mt-12 py-12 border-y border-orange-100">
            <AdSlot id="tool-inline-primary" />
          </div>

          <section className="mt-12 space-y-6" aria-labelledby="how-to-use">
            <h2 id="how-to-use" className="text-2xl font-black text-slate-900">
              How to use this tool
            </h2>
            <div className="prose prose-orange max-w-none text-slate-700">
              {tool.howToUseParagraphs.map((p, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>


          <section className="mt-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-black text-slate-900 mb-8">
              Frequently asked questions
            </h2>
            <dl className="grid gap-6 sm:grid-cols-2">
              {tool.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-shadow"
                >
                  <dt className="font-bold text-slate-900 mb-2">{faq.question}</dt>
                  <dd className="text-sm text-slate-600 leading-relaxed font-medium">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-16 pt-16 border-t border-orange-100" aria-labelledby="related-tools">
            <h2 id="related-tools" className="text-2xl font-black text-slate-900">
              You may also like
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tool.relatedSlugs.map((slug) => (
                <RelatedToolCard key={slug} slug={slug} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function RelatedToolCard({ slug }: { slug: string }) {
  const related = TOOL_BY_SLUG[slug];
  if (!related) return null;

  const { Icon } = getToolCardIcon(slug);

  return (
    <Link
      href={`/tools/${related.slug}`}
      className="group rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-200"
    >
      <div className="h-10 w-10 flex items-center justify-center bg-orange-50/60 rounded-xl mb-4 transition-transform duration-500 group-hover:scale-110" aria-hidden>
        <Icon className="h-6 w-6 shrink-0" />
      </div>
      <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
        {related.name}
      </h3>
      <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{related.shortDescription}</p>
      <span className="mt-4 inline-flex text-sm font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
        Open tool →
      </span>
    </Link>
  );
}