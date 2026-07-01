import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BLOG_BY_SLUG, BLOG_POSTS, BlogContentBlock } from "@/lib/blog-posts";

import { FaqAccordion } from "./FaqAccordion";

const Facebook = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const Twitter = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const Linkedin = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = BLOG_BY_SLUG[params.slug];
  if (!post) return {};
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tothewebpro.com";
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://tothewebpro.com/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `https://tothewebpro.com/blog/${post.slug}`,
      images: [{ url: `${baseUrl}/og-default.png`, width: 1200, height: 630 }],
      publishedTime: post.date,
      authors: ["ToTheWebPro"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${baseUrl}/og-default.png`],
    },
  };
}

function RenderBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 id={block.id} className="text-2xl md:text-3xl font-black text-slate-900 mt-12 mb-6 scroll-mt-24">{block.text}</h2>;
    case "h3":
      return <h3 id={block.id} className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-4 scroll-mt-24">{block.text}</h3>;
    case "p":
      return <p className="mb-6 text-lg leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: block.text }} />;
    case "ul":
      return (
        <ul className="list-disc pl-6 mb-6 space-y-2 text-lg text-slate-700">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "img":
      return (
        <figure className="my-10 relative w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <Image src={block.url} alt={block.alt} width={800} height={450} className="w-full h-auto object-cover" />
          {block.caption && <figcaption className="bg-slate-50 text-slate-500 text-sm p-3 text-center border-t border-slate-200">{block.caption}</figcaption>}
        </figure>
      );
    case "faq":
      return <FaqAccordion items={block.items} />;
    default:
      return null;
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = BLOG_BY_SLUG[params.slug];
  if (!post) {
    notFound();
  }

  const toc = post.content.filter((b): b is { type: "h2" | "h3"; text: string; id: string } => b.type === "h2" || b.type === "h3");
  const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-[#0b1b36] overflow-hidden pt-20 pb-24 px-4 text-center text-white border-b border-[#1a2d50]">
        <div className="absolute inset-0 z-0">
          {post.featureImage && (
            <Image src={post.featureImage} alt="Hero Background" fill className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-[#0b1b36] opacity-90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase gap-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-500">&gt;</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span className="text-slate-500">&gt;</span>
            <span className="text-white truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300 font-medium text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">BY</span>
              <span className="text-white font-bold tracking-wide uppercase">Izhar Ul Haq</span>
            </div>
            <span className="text-slate-500">•</span>
            <span>{post.date}</span>
          </div>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-12 flex flex-col lg:flex-row gap-12 items-start">

        {/* Left: Main Content */}
        <article className="flex-1 w-full lg:max-w-[750px] xl:max-w-[800px]">

          <div className="prose prose-slate max-w-none">
            {post.content.map((block, index) => (
              <RenderBlock key={index} block={block} />
            ))}
          </div>
        </article>

        {/* Right: Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-24 space-y-8">

          {/* Author Box */}
          <div className="bg-slate-50 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
              <span className="text-4xl">🧑‍💻</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Izhar Ul Haq</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">SEO Specialist & Content Writer</p>
            <div className="flex gap-2 justify-center mb-6">
              <Link href="#" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80"><Facebook size={14} className="text-white" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center hover:opacity-80"><Twitter size={14} className="text-white" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center hover:opacity-80"><Linkedin size={14} className="text-white" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-[#E4405F] flex items-center justify-center hover:opacity-80"><Instagram size={14} className="text-white" /></Link>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hi, I&apos;m Izhar Haq, a professional content writer and SEO specialist. I create high-impact, search-optimized content that drives organic traffic, improves search visibility, and delivers meaningful user experiences.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-slate-50 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100">
            <h4 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-200">Contents</h4>
            <nav className="space-y-3">
              {toc.map((heading, i) => (
                <Link
                  key={i}
                  href={`#${heading.id}`}
                  className={`block text-sm transition-colors ${heading.type === "h3" ? "pl-4 text-slate-500 hover:text-blue-600" : "font-bold text-slate-700 hover:text-blue-600"
                    }`}
                >
                  {heading.type === "h2" ? (
                    <span className="flex gap-2 items-start">
                      <span className="text-blue-600 font-black">{i + 1}.</span>
                      <span>{heading.text}</span>
                    </span>
                  ) : heading.text}
                </Link>
              ))}
              {toc.length === 0 && <p className="text-sm text-slate-400">No headings in this article.</p>}
            </nav>
          </div>
        </aside>
      </div>

      {/* Other Posts Section */}
      {otherPosts.length > 0 && (
        <div className="bg-slate-50 py-16 mt-12 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-slate-900">Keep Reading</h3>
              <Link href="/blog" className="text-blue-600 font-bold hover:text-blue-700 hidden sm:block">View all →</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {otherPosts.map((other) => (
                <article key={other.slug} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                    {other.date} &nbsp;&bull;&nbsp; {other.readMinutes} min read
                  </p>
                  <h4 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                    <Link className="group-hover:text-blue-600 transition-colors before:absolute before:inset-0" href={`/blog/${other.slug}`}>
                      {other.title}
                    </Link>
                  </h4>
                  <p className="text-slate-600 leading-relaxed flex-grow">{other.excerpt}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/blog" className="text-blue-600 font-bold hover:text-blue-700">View all articles →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
