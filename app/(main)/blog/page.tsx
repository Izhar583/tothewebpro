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
      <h1 className="text-4xl font-bold text-navy">Blog</h1>
      <p className="mt-3 text-body">
        Practical guidance on snippets, performance, and publishing workflows.
      </p>
      <ul className="mt-10 space-y-6">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {post.date} · {post.readMinutes} min read
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-navy">
                <Link className="hover:text-primary" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-body">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-flex text-sm font-semibold text-primary"
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
