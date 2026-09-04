import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllPosts, getPostBySlug, BlogContentBlock } from "@/lib/blog-service";
import { FaqAccordion } from "./FaqAccordion";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const posts = await getAllPosts(false);
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug, true);
  if (!post) return {};
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tothewebpro.com";
  
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title: title,
    description: description,
    alternates: { canonical: `https://tothewebpro.com/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: title,
      description: description,
      url: `https://tothewebpro.com/blog/${post.slug}`,
      images: [
        {
          url: post.featureImage
            ? post.featureImage.startsWith("http")
              ? post.featureImage
              : `${baseUrl}${post.featureImage}`
            : `${baseUrl}/og-default.png`,
          width: 1200,
          height: 630,
        },
      ],
      publishedTime: post.date,
      authors: [post.author || "ToTheWebPro"],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [
        post.featureImage
          ? post.featureImage.startsWith("http")
            ? post.featureImage
            : `${baseUrl}${post.featureImage}`
          : `${baseUrl}/og-default.png`,
      ],
    },
  };
}

function RenderBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-8 sm:mt-12 mb-4 sm:mb-6 scroll-mt-24 break-words leading-tight"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={block.id}
          className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mt-6 sm:mt-8 mb-3 sm:mb-4 scroll-mt-24 break-words leading-snug"
        >
          {block.text}
        </h3>
      );
    case "p": {
      const isBlockHtml =
        block.text.trim().startsWith("<table") ||
        block.text.trim().startsWith("<div");
      if (isBlockHtml) {
        return (
          <div
            className="my-6 overflow-x-auto max-w-full w-full"
            dangerouslySetInnerHTML={{ __html: block.text }}
          />
        );
      }
      return (
        <p
          className="mb-5 sm:mb-6 text-base sm:text-lg leading-relaxed text-slate-700 break-words"
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      );
    }
    case "ul":
      return (
        <ul className="list-disc pl-5 sm:pl-6 mb-6 space-y-2 text-base sm:text-lg text-slate-700 break-words">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "img":
      return (
        <figure className="my-8 sm:my-10 relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
          <Image
            src={block.url}
            alt={block.alt}
            width={800}
            height={450}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 860px"
          />
          {block.caption && (
            <figcaption className="bg-slate-50 text-slate-500 text-xs sm:text-sm p-2.5 sm:p-3 text-center border-t border-slate-200">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "faq":
      return <FaqAccordion items={block.items} />;
    default:
      return null;
  }
}

function processHtmlAndToc(html: string) {
  try {
    const $ = cheerio.load(html);
    const toc: { type: "h2" | "h3"; text: string; id: string }[] = [];

    $("h2, h3").each((i, el) => {
      const $el = $(el);
      const tagName = (
        el.tagName ? el.tagName.toLowerCase() : "h2"
      ) as "h2" | "h3";
      const text = $el.text().trim();
      if (!text) return;

      let id = $el.attr("id");
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
        $el.attr("id", id || `section-${i + 1}`);
      }
      toc.push({ type: tagName, text, id: id || `section-${i + 1}` });
    });

    return {
      processedHtml: $("body").html() || html,
      toc,
    };
  } catch {
    return { processedHtml: html, toc: [] };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug, true);
  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts(false);
  const otherPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  let processedHtml = "";
  let toc: { type: "h2" | "h3"; text: string; id: string }[] = [];

  if (post.htmlContent && post.htmlContent.trim()) {
    const res = processHtmlAndToc(post.htmlContent);
    processedHtml = res.processedHtml;
    toc = res.toc;
  } else if (post.content && Array.isArray(post.content)) {
    toc = post.content.filter(
      (b): b is { type: "h2" | "h3"; text: string; id: string } =>
        b.type === "h2" || b.type === "h3"
    );
  }

  return (
    <div className="bg-white min-h-screen w-full pb-16 sm:pb-20">
      {/* Hero Header */}
      <div className="relative bg-[#0b1b36] overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 text-center text-white border-b border-[#1a2d50]">
        <div className="absolute inset-0 z-0">
          {post.featureImage && (
            <Image
              src={post.featureImage}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-[#0b1b36] opacity-90"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 sm:mb-8 flex flex-wrap items-center justify-center text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase gap-2 sm:gap-2.5"
          >
            <Link href="/" className="hover:text-orange-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-500" aria-hidden="true">&gt;</span>
            <Link href="/blog" className="hover:text-orange-400 transition-colors">
              Blog
            </Link>
            <span className="text-slate-500" aria-hidden="true">&gt;</span>
            <span className="text-slate-200 truncate max-w-[150px] sm:max-w-xs md:max-w-md">
              {post.title}
            </span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 sm:mb-8 break-words max-w-4xl mx-auto">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-slate-300 font-medium text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-slate-400">BY</span>
              <span className="text-white font-bold tracking-wide uppercase">
                {post.author || "Izhar Ul Haq"}
              </span>
            </div>
            <span className="text-slate-500" aria-hidden="true">•</span>
            <span>{post.date}</span>
            <span className="text-slate-500" aria-hidden="true">•</span>
            <span>{post.readMinutes || 5} min read</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Responsive TOC */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full min-w-0">
        <article className="blog-prose flex-1 w-full min-w-0 lg:max-w-[800px] xl:max-w-[860px]">
          {/* Mobile Collapsible Table of Contents */}
          {toc.length > 0 && (
            <details className="lg:hidden mb-8 border border-orange-200/70 rounded-2xl bg-orange-50/40 overflow-hidden shadow-sm group">
              <summary className="px-4 py-3.5 flex items-center justify-between cursor-pointer font-bold text-slate-900 text-sm list-none select-none hover:bg-orange-50/80 transition-colors">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-orange-600 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  <span>Table of Contents ({toc.length} sections)</span>
                </span>
                <span className="text-xs font-semibold text-orange-600 group-open:hidden">
                  Show ↓
                </span>
                <span className="text-xs font-semibold text-orange-600 hidden group-open:inline">
                  Hide ↑
                </span>
              </summary>
              <nav className="px-4 pb-4 pt-2 border-t border-orange-100 bg-white/95 space-y-1.5 max-h-[50vh] overflow-y-auto">
                {toc.map((heading, i) => (
                  <Link
                    key={i}
                    href={`#${heading.id}`}
                    className={`block text-xs sm:text-sm py-1 transition-colors ${
                      heading.type === "h3"
                        ? "pl-4 text-slate-600 hover:text-orange-600"
                        : "font-semibold text-slate-800 hover:text-orange-600"
                    }`}
                  >
                    {heading.type === "h2" ? (
                      <span className="flex gap-2 items-start">
                        <span className="text-orange-600 font-bold">
                          {i + 1}.
                        </span>
                        <span className="break-words">{heading.text}</span>
                      </span>
                    ) : (
                      <span className="break-words">{heading.text}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </details>
          )}

          {processedHtml ? (
            <div
              className="blog-prose max-w-none"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          ) : post.content && post.content.length > 0 ? (
            <div className="blog-prose max-w-none">
              {post.content.map((block, index) => (
                <RenderBlock key={index} block={block} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No content available for this post.</p>
          )}

          {post.faqs && post.faqs.length > 0 && (
            <FaqAccordion items={post.faqs} />
          )}
        </article>

        {/* Desktop Sticky Table of Contents */}
        <aside className="hidden lg:block w-[300px] xl:w-[320px] shrink-0 sticky top-24 space-y-6">
          <div className="bg-slate-50/90 rounded-2xl p-6 shadow-sm border border-slate-200/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <svg
                className="w-4 h-4 text-orange-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              <h4 className="text-base font-bold text-slate-900 tracking-wide uppercase">
                Table of Contents
              </h4>
            </div>
            <nav className="space-y-2.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {toc.map((heading, i) => (
                <Link
                  key={i}
                  href={`#${heading.id}`}
                  className={`block text-sm transition-colors py-0.5 ${
                    heading.type === "h3"
                      ? "pl-4 text-slate-500 hover:text-orange-600"
                      : "font-semibold text-slate-700 hover:text-orange-600"
                  }`}
                >
                  {heading.type === "h2" ? (
                    <span className="flex gap-2 items-start">
                      <span className="text-orange-600 font-bold">
                        {i + 1}.
                      </span>
                      <span className="break-words">{heading.text}</span>
                    </span>
                  ) : (
                    <span className="break-words">{heading.text}</span>
                  )}
                </Link>
              ))}
              {toc.length === 0 && (
                <p className="text-sm text-slate-400">
                  No headings in this article.
                </p>
              )}
            </nav>
          </div>
        </aside>
      </div>

      {/* Keep Reading Section */}
      {otherPosts.length > 0 && (
        <div className="bg-slate-50 py-10 sm:py-16 mt-8 sm:mt-12 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Keep Reading
              </h3>
              <Link
                href="/blog"
                className="text-orange-600 font-bold hover:text-orange-700 hidden sm:inline-flex items-center gap-1 transition-colors"
              >
                View all articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {otherPosts.map((other) => (
                <article
                  key={other.slug}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col min-w-0"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 sm:mb-3">
                    {other.date} &nbsp;&bull;&nbsp; {other.readMinutes} min read
                  </p>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3 break-words">
                    <Link
                      className="group-hover:text-orange-600 transition-colors before:absolute before:inset-0"
                      href={`/blog/${other.slug}`}
                    >
                      {other.title}
                    </Link>
                  </h4>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed flex-grow line-clamp-3 mb-4 break-words">
                    {other.excerpt}
                  </p>
                  <div className="mt-auto pt-3 border-t border-slate-100 text-xs sm:text-sm font-bold text-orange-600 group-hover:text-orange-700 flex items-center justify-between">
                    <span>Read article</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-orange-600 font-bold hover:text-orange-700 text-sm"
              >
                View all articles →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
