import Link from "next/link";
import { AdSlot } from "@/components/ui/AdSlot";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { TOOL_BY_SLUG } from "@/lib/tools-data";
import type { ToolDefinition } from "@/lib/types";

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
    <div className="mx-auto max-w-6xl px-4 py-8 text-navy">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        <div>
          <Breadcrumb items={crumbs} />
          <h1 className="mt-4 text-3xl font-bold text-navy md:text-4xl">
            {tool.name}
          </h1>
          <p className="mt-2 max-w-3xl text-body">{tool.shortDescription}</p>

          <div className="mt-6">{children}</div>

          <div className="mt-8">
            <AdSlot id="tool-inline-primary" />
          </div>

          <section className="mt-10 space-y-4" aria-labelledby="how-to-use">
            <h2 id="how-to-use" className="text-2xl font-semibold text-navy">
              How to use this tool
            </h2>
            <div className="prose prose-slate max-w-none text-body">
              {tool.howToUseParagraphs.map((p, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>

          <div className="mt-8">
            <AdSlot id="tool-inline-secondary" />
          </div>

          <section className="mt-10" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-semibold text-navy">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6">
              {tool.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="glass-card border-white/60 p-4"
                >
                  <dt className="font-semibold text-navy">{faq.question}</dt>
                  <dd className="mt-2 text-body">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12" aria-labelledby="related-tools">
            <h2 id="related-tools" className="text-2xl font-semibold text-navy">
              You may also like
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tool.relatedSlugs.map((slug) => (
                <RelatedToolCard key={slug} slug={slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="mt-10 space-y-6 lg:mt-0 lg:block lg:w-[300px]">
          <div className="hidden lg:block">
            <AdSlot id="tool-sidebar-sticky" className="sticky top-24" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function RelatedToolCard({ slug }: { slug: string }) {
  const related = TOOL_BY_SLUG[slug];
  if (!related) return null;
  return (
    <Link
      href={`/tools/${related.slug}`}
      className="group glass-card border-blue-100/40 p-4 transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="text-2xl" aria-hidden>
        {related.icon}
      </div>
      <h3 className="mt-2 font-semibold text-navy group-hover:text-primary">
        {related.name}
      </h3>
      <p className="mt-1 text-sm text-body">{related.shortDescription}</p>
      <span className="mt-3 inline-flex text-sm font-medium text-primary">
        Open tool →
      </span>
    </Link>
  );
}
