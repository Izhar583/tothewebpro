"use client";

import Link from "next/link";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { TOOL_BY_SLUG } from "@/lib/tools-data";
import type { ToolDefinition } from "@/lib/types";

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
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            {tool.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 font-medium leading-relaxed">
            {tool.shortDescription}
          </p>

          <div className="mt-8">{children}</div>

          {/* How to use / Guide Section */}
          {tool.howToUseParagraphs && tool.howToUseParagraphs.length > 0 && (
            <section className="mt-16 pt-12 border-t border-orange-100" aria-labelledby="how-to-use-heading">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-700 font-bold text-sm">
                  1
                </span>
                <h2 id="how-to-use-heading" className="text-2xl font-black text-slate-900 tracking-tight">
                  How to Use {tool.name}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {tool.howToUseParagraphs.map((para: string, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-orange-100/80 bg-gradient-to-br from-white to-orange-50/20 p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/10 font-bold text-xs text-orange-600">
                        {idx + 1}
                      </span>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        {para}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {((tool.whyItMatters && tool.whyItMatters.length > 0) || (tool.keyFeatures && tool.keyFeatures.length > 0)) && (
            <section className="mt-12 grid gap-6 md:grid-cols-2" aria-labelledby="features-benefits-heading">
              {tool.whyItMatters && tool.whyItMatters.length > 0 && (
                <div className="rounded-2xl border border-orange-100 bg-white p-7 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <span className="text-orange-500"></span> Why It Matters
                  </h3>
                  <ul className="space-y-3.5">
                    {tool.whyItMatters.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm md:text-base leading-relaxed">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tool.keyFeatures && tool.keyFeatures.length > 0 && (
                <div className="rounded-2xl border border-orange-100 bg-white p-7 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                Key Features
                  </h3>
                  <ul className="space-y-3.5">
                    {tool.keyFeatures.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm md:text-base leading-relaxed">
                        <span className="text-orange-500 font-bold mt-0.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Frequently Asked Questions (FAQ) */}
          {tool.faqs && tool.faqs.length > 0 && (
            <section className="mt-16 pt-12 border-t border-orange-100" aria-labelledby="faq-heading">
              <div className="flex items-center gap-3 mb-8">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-700 font-bold text-sm">
                  ?
                </span>
                <div>
                  <h2 id="faq-heading" className="text-2xl font-black text-slate-900 tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Everything you need to know about {tool.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {tool.faqs.map((faq, idx: number) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-orange-200 open:border-orange-300 open:bg-orange-50/10"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-slate-900 text-base md:text-lg select-none">
                      <span className="pr-4">{faq.question}</span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-transform duration-200 group-open:rotate-180">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed border-t border-orange-100/60 pt-4">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* FIX 2 & 3: Added Safe-check (&&) and strict type for related slugs */}
          {tool.relatedSlugs && tool.relatedSlugs.length > 0 && (
            <section className="mt-16 pt-16 border-t border-orange-100" aria-labelledby="related-tools">
              <h2 id="related-tools" className="text-2xl font-black text-slate-900">
                You may also like
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tool.relatedSlugs.map((slug: string) => (
                  <RelatedToolCard key={slug} slug={slug} />
                ))}
              </div>
            </section>
          )}
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