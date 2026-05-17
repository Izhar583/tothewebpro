"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools-data";
import {
  SpeedIcon,
  AccuracyIcon,
  ClarityIcon,
  WordCounterIcon,
  ImageCompressorIcon,
  MetaCheckerIcon,
  PasswordGeneratorIcon,
} from "@/components/ui/PremiumIcons";

const TOOL_CATEGORIES = [
  {
    id: "text",
    title: "Text Analysis Tools",
    description: "A comprehensive set of text tools to help you with content creation and analysis.",
    Icon: WordCounterIcon,
  },
  {
    id: "image",
    title: "Image Editing Tools",
    description: "Easily compress, resize, and convert your images with these online utilities.",
    Icon: ImageCompressorIcon,
  },
  {
    id: "seo",
    title: "SEO Tools",
    description: "Essential tools to help you optimize your website for search engines.",
    Icon: MetaCheckerIcon,
  },
  {
    id: "developer",
    title: "Developer Tools",
    description: "Productivity tools designed to help developers and technical operators.",
    Icon: PasswordGeneratorIcon,
  },
];

const WHY = [
  {
    title: "Speed",
    body: "Results in milliseconds, not after a progress bar you didn't ask for.",
    Icon: SpeedIcon,
    bgClass: "bg-orange-50/70",
  },
  {
    title: "Accuracy",
    body: "Output you can trust, especially when it feeds into a client deliverable.",
    Icon: AccuracyIcon,
    bgClass: "bg-amber-50/70",
  },
  {
    title: "Clarity",
    body: "Instructions you won't need to re-read. Interfaces that get out of your way.",
    Icon: ClarityIcon,
    bgClass: "bg-orange-50/70",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div>
      <section className="bg-white border-b border-orange-100">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <span className="text-xs font-bold text-orange-700 uppercase tracking-widest">Premium SEO Utilities</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Sharp Tools for <br />
            <span className="text-orange-600">Smart Creators</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Get instant, browser-local results with our professional-grade utilities. 
            No accounts, no trackers, no limits.
          </p>
          <form
            className="mt-12 flex max-w-2xl mx-auto flex-col gap-3 sm:flex-row p-2 bg-orange-50 rounded-[24px] border border-orange-100"
            onSubmit={onSearch}
            role="search"
          >
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools e.g. word counter, meta checker…"
              className="w-full flex-1 rounded-[18px] border-none bg-white px-6 py-4 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              type="submit"
              className="rounded-[18px] bg-orange-600 px-10 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-700 active:scale-95"
            >
              Search Tools
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="space-y-24">
          {TOOL_CATEGORIES.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} id={cat.id} className="scroll-mt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div className="max-w-xl">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                      <span className="h-12 w-12 flex items-center justify-center bg-orange-50 rounded-[14px]" aria-hidden>
                        <cat.Icon className="h-8 w-8 shrink-0" />
                      </span>
                      {cat.title}
                    </h2>
                    <p className="mt-3 text-lg text-slate-600 font-medium leading-relaxed">{cat.description}</p>
                  </div>
                  <Link 
                    href={`/${cat.id}-tools`} 
                    className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group"
                  >
                    View All {cat.id} Tools
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} variant="light" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-24 border-y border-orange-100 bg-orange-50/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900">Built for the People Who Build the Web</h2>
            <p className="mt-6 text-lg text-slate-600 font-medium leading-relaxed">
              Whether you&apos;re auditing a client&apos;s SERP snippet, optimizing images for a Core Web Vitals report,
              or counting characters before a deadline — you need tools that respect your time.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {WHY.map((item) => {
              const Icon = item.Icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[32px] border border-orange-100 bg-white p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-8 ${item.bgClass}`}>
                    <Icon className="h-8 w-8 shrink-0" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 font-medium">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-28 bg-white overflow-hidden relative">
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">The Right Tool Is Already Waiting</h2>
          <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Technical work deserves technical precision. Open any tool, run your task, move on. That&apos;s the whole deal.
          </p>
          <Link
            href="/seo-tools"
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-700 active:scale-95"
          >
            Browse All Tools →
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/30 blur-[120px] rounded-full -z-0" />
      </section>
    </div>
  );
}
