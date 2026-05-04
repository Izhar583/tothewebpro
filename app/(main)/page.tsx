"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";

const CATEGORIES = [
  {
    title: "SEO Tools",
    description: "SERP-ready checkers and utilities for search teams.",
    href: "/seo-tools",
    accent: "from-blue-100/90 via-sky-50/50 to-indigo-50/80 border-white/60",
  },
  {
    title: "Text Tools",
    description: "Word stats, casing, and character limits for writers.",
    href: "/text-tools",
    accent: "from-sky-50/90 via-white/40 to-blue-100/70 border-white/60",
  },
  {
    title: "Image Tools",
    description: "Compress, resize, and convert visuals client-side.",
    href: "/image-tools",
    accent: "from-blue-50/80 via-sky-50/50 to-indigo-50/80 border-white/60",
  },
  {
    title: "Developer Tools",
    description: "Productivity helpers for builders and operators.",
    href: "/developer-tools",
    accent: "from-slate-100/80 via-blue-50/40 to-slate-50/90 border-white/60",
  },
];

const WHY = [
  {
    title: "No waiting, no installs",
    body: "Every tool runs in your browser tab. Paste your text, drop an image, or enter a URL — results are instant because there's no round-trip to a processing server.",
  },
  {
    title: "Your files stay on your device",
    body: "Image compression, resizing, and format conversion happen using your own CPU via browser APIs. We never see your uploads, which matters when handling client work or pre-release assets.",
  },
  {
    title: "Free to use, honestly monetised",
    body: "Core tools are free and stay free. We run unobtrusive display ads — no popups, no paywalls, no bait-and-switch. If you find the tools useful, the ads are how we keep the lights on.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const featured = TOOLS.find((t) => t.slug === "meta-title-description-checker");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div>
      <section className="border-b border-white/40">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="glass-panel max-w-4xl p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              ToTheWebPro
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-navy md:text-5xl">
              Free Online Tools for SEO, Text &amp; Images
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-body/80">
              Professional-grade utilities for SEO executives, writers, developers,
              and marketers—without clutter, popups, or paywalls on core features.
            </p>
            <form
              className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
              onSubmit={onSearch}
              role="search"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search tools
              </label>
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools e.g. word counter, meta checker…"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-navy shadow-inner outline-none transition-all placeholder:text-body/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              />
              <button
                type="submit"
                className="rounded-2xl bg-primary px-7 py-3 text-sm font-bold text-white shadow-lift transition hover:bg-primary-dark active:scale-95"
                aria-label="Submit search"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold text-navy">Featured tool</h2>
          <div className="mt-6 rounded-3xl border border-blue-100 bg-white/50 p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Flagship SEO</p>
                <h3 className="mt-1 text-2xl font-bold text-navy">
                  {featured.name}
                </h3>
                <p className="mt-2 max-w-2xl text-body/80">
                  {featured.shortDescription} Includes Google-style SERP preview,
                  scoring, manual and URL modes.
                </p>
              </div>
              <Link
                href={`/tools/${featured.slug}`}
                className="inline-flex justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-primary-dark"
                aria-label={`Use ${featured.name}`}
              >
                Use Tool
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section
        className="mx-auto max-w-6xl px-4 py-6"
        aria-labelledby="categories-heading"
      >
        <h2 id="categories-heading" className="text-2xl font-bold text-navy text-center sm:text-left">Explore Categories</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`rounded-3xl border bg-gradient-to-br ${c.accent} p-7 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift`}
            >
              <h3 className="text-xl font-bold text-navy">{c.title}</h3>
              <p className="mt-2 text-[14px] font-medium text-body/80">{c.description}</p>
              <span className="mt-4 inline-flex text-sm font-bold text-primary">
                Browse {c.title} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-12"
        aria-labelledby="tools-directory-heading"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="tools-directory-heading"
            className="text-3xl font-bold tracking-tight text-navy"
          >
            All tools
          </h2>
          <p className="text-sm font-medium text-body/60">
            Eight free utilities — fast, focused, and production-ready.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.slice(0, 8).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-slate-100 bg-white/40 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-navy text-center">Why professionals choose ToTheWebPro</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {WHY.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className="h-1 w-12 bg-primary rounded-full mb-6" />
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-4 text-[14px] leading-relaxed text-body/70 font-medium">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
