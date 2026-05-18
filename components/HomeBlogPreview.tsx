"use client";

import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

const PREVIEW_COUNT = 3;

export function HomeBlogPreview() {
  const posts = BLOG_POSTS.slice(0, PREVIEW_COUNT);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-[#fdfaf6] border-t border-orange-100" aria-labelledby="blog-preview-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-widest">From the Blog</span>
            </div>
            <h2
              id="blog-preview-heading"
              className="text-3xl md:text-4xl font-black text-slate-900 leading-tight"
            >
              Latest Insights &amp; Guides
            </h2>
            <p className="mt-3 text-base text-slate-600 font-medium max-w-lg leading-relaxed">
              Practical SEO, performance, and publishing guidance — written for people who build the web.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-orange-200 bg-white px-6 py-3 text-sm font-bold text-orange-600 transition-all hover:bg-orange-50 hover:border-orange-300 group"
          >
            View all articles
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col rounded-[24px] border border-orange-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200"
            >
              {/* Top meta */}
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  {post.readMinutes} min read
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {post.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-slate-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors duration-200">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="flex-1 text-sm text-slate-600 leading-relaxed font-medium">
                {post.excerpt}
              </p>

              {/* Read more */}
              <div className="mt-6 pt-5 border-t border-orange-50">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 group-hover:gap-3 transition-all"
                >
                  Read article
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-16 rounded-[28px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-px shadow-xl shadow-orange-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-[27px] bg-gradient-to-r from-orange-500/90 to-amber-500/90 px-10 py-8">
            <div>
              <p className="text-lg font-black text-white">Want more SEO guides?</p>
              <p className="mt-1 text-sm text-orange-100 font-medium">
                Visit the full blog for practical tips on rankings, Core Web Vitals, and content.
              </p>
            </div>
            <Link
              href="/blog"
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-orange-600 shadow-lg transition hover:bg-orange-50 active:scale-95"
            >
              Go to Blog →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
