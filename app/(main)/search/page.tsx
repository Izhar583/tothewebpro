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
      <h1 className="text-3xl font-black text-slate-900">Search tools</h1>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/search" method="get" role="search">
        <label htmlFor="search-q" className="sr-only">
          Query
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={searchParams.q ?? ""}
          placeholder='Try "meta", "word", or "image"'
          className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
        />
        <button
          type="submit"
          className="rounded-xl bg-orange-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-700 active:scale-95"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {!q ? (
        <p className="mt-8 text-slate-500 font-medium">Enter a keyword to see matching tools.</p>
      ) : results.length === 0 ? (
        <p className="mt-8 text-slate-500 font-medium">
          No tools matched &quot;{searchParams.q}&quot;. Try another keyword or browse
          categories from the homepage.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {results.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="block rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:border-orange-200 group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden>
                    {tool.icon}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{tool.name}</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">{tool.shortDescription}</p>
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