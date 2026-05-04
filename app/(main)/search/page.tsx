import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Search Tools",
  description: "Find ToTheWebPro utilities by keyword.",
  robots: { index: false, follow: true },
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const results = q
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.slug.includes(q),
      )
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">Search tools</h1>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/search" method="get" role="search">
        <label htmlFor="search-q" className="sr-only">
          Query
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={searchParams.q ?? ""}
          placeholder="Try “meta”, “word”, or “image”"
          className="w-full rounded-input border border-slate-200 px-4 py-3 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-input bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {!q ? (
        <p className="mt-8 text-body">Enter a keyword to see matching tools.</p>
      ) : results.length === 0 ? (
        <p className="mt-8 text-body">
          No tools matched “{searchParams.q}”. Try another keyword or browse
          categories from the homepage.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {results.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="block rounded-card border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>
                    {tool.icon}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-navy">{tool.name}</h2>
                    <p className="text-sm text-body">{tool.shortDescription}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
