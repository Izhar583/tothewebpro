import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "SEO & Performance Blog",
  description:
    "Practical SEO and web performance articles from ToTheWebPro — written for UK and US teams who want results, not theory.",
  alternates: { canonical: "https://tothewebpro.com/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-4">
        <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Latest Insights</span>
      </div>
      <h1 className="text-4xl font-black text-slate-900">Blog</h1>
      <p className="mt-3 text-slate-600 font-medium">
        Practical guidance on snippets, performance, and publishing workflows.
      </p>
      <ul className="mt-10 space-y-6">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <article className="rounded-2xl border border-orange-100 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-orange-200 group">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                {post.date} · {post.readMinutes} min read
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                <Link className="group-hover:text-orange-600 transition-colors" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-slate-600 leading-relaxed">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                Read article →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}