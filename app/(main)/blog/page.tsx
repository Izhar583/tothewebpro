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
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Latest Insights</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">SEO & Performance Blog</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Practical guidance on snippets, performance, and publishing workflows for teams who want results, not theory.
        </p>
      </div>
      
      <ul className="grid gap-8">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <article className="rounded-3xl border border-orange-100 bg-white p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">
                  {post.date} &nbsp;&bull;&nbsp; {post.readMinutes} min read
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  <Link className="group-hover:text-orange-600 transition-colors before:absolute before:inset-0" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed text-lg">{post.excerpt}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:text-orange-700">
                  Read article <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}