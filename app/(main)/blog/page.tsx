import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog | SEO Tips, Web Tools and Digital Marketing Guides",
  description:
    "Read practical guides on SEO, website optimization, and digital tools. Actionable tips for beginners and professionals alike.",
  alternates: { canonical: "https://tothewebpro.com/blog" },
};

export default function BlogIndexPage() {
  const featuredPost = BLOG_POSTS[0];
  const otherPosts = BLOG_POSTS.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Latest Insights</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">SEO & Performance Blog</h1>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          Practical guidance on snippets, performance, and publishing workflows for teams who want results, not theory.
        </p>
      </div>
      
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-16">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-200 group relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase mb-4">
                Featured
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                {featuredPost.date} &nbsp;&bull;&nbsp; {featuredPost.readMinutes} min read
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                <Link className="group-hover:text-orange-600 transition-colors before:absolute before:inset-0" href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg md:text-xl mb-8">{featuredPost.excerpt}</p>
              <div className="inline-flex items-center gap-2 font-bold text-orange-600 group-hover:text-orange-700">
                Read article <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
            
            {/* If the featured post has an image, we display it (optional, fallback to a pattern) */}
            <div className="relative z-10 w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 hidden md:block">
               <Image src={featuredPost.featureImage || "/blog/meta_title_hero.png"} alt={featuredPost.title} fill className="object-cover" />
            </div>
          </article>
        </div>
      )}

      {/* Other Posts */}
      <h3 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-200 pb-4">More Articles</h3>
      <ul className="grid md:grid-cols-2 gap-8">
        {otherPosts.map((post) => (
          <li key={post.slug}>
            <article className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 group relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col flex-grow">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  {post.date} &nbsp;&bull;&nbsp; {post.readMinutes} min read
                </p>
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                  <Link className="group-hover:text-orange-600 transition-colors before:absolute before:inset-0" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-600 leading-relaxed flex-grow">{post.excerpt}</p>
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