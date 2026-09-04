"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog-service";

interface CategoryTab {
  id: string;
  label: string;
  count: number;
}

function matchPostCategory(post: BlogPost, categoryId: string): boolean {
  if (categoryId === "all") return true;

  const cat = (post.category || "").toLowerCase().trim();

  switch (categoryId) {
    case "seo":
      return (
        cat === "seo blogs" ||
        cat === "seo guides" ||
        cat === "seo & ctr" ||
        cat === "seo"
      );
    case "text":
      return (
        cat === "text blogs" ||
        cat === "text tools" ||
        cat === "text"
      );
    case "images":
      return (
        cat === "images blogs" ||
        cat === "image tools" ||
        cat === "image" ||
        cat === "images"
      );
    case "dev":
      return (
        cat === "dev blogs" ||
        cat === "developer tools" ||
        cat === "developer" ||
        cat === "web performance" ||
        cat === "dev"
      );
    default:
      return true;
  }
}

export function BlogFeed({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dynamic calculation of real blog counts (no demo data)
  const counts = useMemo(() => {
    return {
      all: initialPosts.length,
      seo: initialPosts.filter((p) => matchPostCategory(p, "seo")).length,
      text: initialPosts.filter((p) => matchPostCategory(p, "text")).length,
      images: initialPosts.filter((p) => matchPostCategory(p, "images")).length,
      dev: initialPosts.filter((p) => matchPostCategory(p, "dev")).length,
    };
  }, [initialPosts]);

  const categories: CategoryTab[] = useMemo(
    () => [
      { id: "all", label: "All Posts", count: counts.all },
      { id: "seo", label: "SEO Blogs", count: counts.seo },
      { id: "text", label: "Text Blogs", count: counts.text },
      { id: "images", label: "Images Blogs", count: counts.images },
      { id: "dev", label: "Dev Blogs", count: counts.dev },
    ],
    [counts]
  );

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) =>
      matchPostCategory(post, selectedCategory)
    );
  }, [initialPosts, selectedCategory]);

  const isAll = selectedCategory === "all";
  const featuredPost = isAll ? filteredPosts[0] : null;
  const displayPosts = isAll ? filteredPosts.slice(1) : filteredPosts;

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative pt-4 sm:pt-8 pb-8 sm:pb-12 text-center overflow-hidden">
        {/* Ambient warm peach glow behind hero */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-56 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(254, 215, 170, 0.45), rgba(255, 247, 237, 0.2) 60%, transparent 80%)",
          }}
        />



        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#0b1b36] tracking-tight leading-tight mb-3 sm:mb-4 break-words">
          SEO &amp; Performance Blog
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-9 font-normal px-2">
          Practical guidance on snippets, performance, and publishing workflows for teams who want results, not theory.
        </p>

        {/* Categories Pills - Forced into 1 Single Clean Line */}
        <div className="w-full max-w-5xl mx-auto px-2 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 md:gap-3 flex-nowrap min-w-max mx-auto px-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#ea580c] text-white shadow-md shadow-orange-500/25 scale-[1.02]"
                      : "bg-white text-slate-700 hover:text-[#ea580c] hover:border-orange-200 hover:bg-orange-50/40 border border-slate-200/90 shadow-sm"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-700"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Post (Displayed when All Posts is active) */}
      {featuredPost && (
        <div className="mb-12 sm:mb-16">
          <article className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 md:p-10 lg:p-12 transition-all duration-300 hover:border-orange-200 hover:shadow-xl group relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 items-stretch md:items-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

            <div className="relative z-10 flex-1 w-full min-w-0 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2.5 mb-3 sm:mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide">
                  Featured
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {featuredPost.date} &nbsp;&bull;&nbsp; {featuredPost.readMinutes} min read
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3 sm:mb-4 break-words">
                <Link
                  className="group-hover:text-orange-600 transition-colors before:absolute before:inset-0"
                  href={`/blog/${featuredPost.slug}`}
                >
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base md:text-lg mb-6 line-clamp-3 sm:line-clamp-4 md:line-clamp-none break-words">
                {featuredPost.excerpt}
              </p>

              <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-orange-600 group-hover:text-orange-700">
                Read article <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>

            {/* Featured Post Image */}
            {featuredPost.featureImage && (
              <div className="relative z-10 w-full md:w-5/12 lg:w-1/2 aspect-[16/10] sm:aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-sm order-first md:order-last">
                <Image
                  src={featuredPost.featureImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </article>
        </div>
      )}

      {/* Articles Grid Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-slate-200 pb-3 sm:pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {isAll ? "More Articles" : `${activeCategoryObj?.label || "Articles"}`}
        </h2>
        <span className="text-xs sm:text-sm font-semibold text-slate-500">
          {displayPosts.length} {displayPosts.length === 1 ? "Guide" : "Guides"}
        </span>
      </div>

      {/* Articles Grid */}
      {displayPosts.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayPosts.map((post) => (
            <li key={post.slug} className="flex">
              <article className="w-full h-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg group relative overflow-hidden flex flex-col min-w-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                {/* Card Thumbnail */}
                {post.featureImage && (
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 mb-4 shrink-0">
                    <Image
                      src={post.featureImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="relative z-10 flex flex-col flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {post.date} &nbsp;&bull;&nbsp; {post.readMinutes} min read
                    </p>
                    {post.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2.5 line-clamp-2 break-words">
                    <Link
                      className="group-hover:text-orange-600 transition-colors before:absolute before:inset-0"
                      href={`/blog/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed flex-grow line-clamp-3 mb-4 break-words">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-orange-600 group-hover:text-orange-700">
                    <span>Read article</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No guides found in this category</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            We are working on fresh articles for this section. In the meantime, browse all of our guides.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-full text-sm font-bold shadow-sm hover:bg-orange-700 transition-colors"
          >
            View All Posts
          </button>
        </div>
      )}
    </div>
  );
}
