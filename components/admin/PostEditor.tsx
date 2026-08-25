"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  Calendar,
  User,
  Tag,
  Folder,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { BlogPost, BlogContentBlock, calculateReadTime } from "@/lib/blog-types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FaqAccordion } from "@/app/blog/[slug]/FaqAccordion";
import { FeaturedImageUploader } from "@/components/admin/FeaturedImageUploader";

interface PostEditorProps {
  initialPost?: BlogPost;
  isNew?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Convert legacy content blocks to HTML (excluding faq block if present)
function blocksToHtml(blocks: BlogContentBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .filter((b) => b.type !== "faq")
    .map((block) => {
      switch (block.type) {
        case "h2":
          return `<h2 id="${block.id || slugify(block.text)}">${block.text}</h2>`;
        case "h3":
          return `<h3 id="${block.id || slugify(block.text)}">${block.text}</h3>`;
        case "p":
          return `<p>${block.text}</p>`;
        case "img":
          return `<figure class="my-6 block"><img src="${block.url}" alt="${block.alt || ""}" class="w-full rounded-2xl" />${
            block.caption
              ? `<figcaption class="text-center text-xs text-slate-500 mt-2">${block.caption}</figcaption>`
              : ""
          }</figure>`;
        case "ul":
          return `<ul>${block.items.map((it) => `<li>${it}</li>`).join("")}</ul>`;
        default:
          return "";
      }
    })
    .join("\n");
}

function extractHeadingsFromHtml(html: string): { type: "h2" | "h3"; text: string; id: string }[] {
  if (!html) return [];
  const headings: { type: "h2" | "h3"; text: string; id: string }[] = [];
  const regex = /<(h[23])[^>]*id=["']([^"']*)["'][^>]*>(.*?)<\/\1>|<(h[23])[^>]*>(.*?)<\/\4>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = (match[1] || match[4]).toLowerCase() as "h2" | "h3";
    const rawText = (match[3] || match[5] || "").replace(/<[^>]*>?/gm, "").trim();
    const id = match[2] || slugify(rawText);
    if (rawText) {
      headings.push({ type: tag, text: rawText, id });
    }
  }
  return headings;
}

const DEFAULT_CATEGORIES = [
  "SEO Guides",
  "SEO & CTR",
  "Web Performance",
  "Content Strategy",
  "Developer Tools",
  "Image Optimization",
  "Digital Marketing",
];

export function PostEditor({ initialPost, isNew = false }: PostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [isSlugCustom, setIsSlugCustom] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [date, setDate] = useState(
    initialPost?.date || new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<"published" | "draft">(
    initialPost?.status || "published"
  );
  const [author, setAuthor] = useState(initialPost?.author || "Izhar Ul Haq");
  const [category, setCategory] = useState(
    initialPost?.category || "SEO Guides"
  );
  const [tags, setTags] = useState<string[]>(
    initialPost?.tags || ["SEO", "Web Tools"]
  );
  const [tagInput, setTagInput] = useState("");
  const [featureImage, setFeatureImage] = useState(
    initialPost?.featureImage || "/blog/3blog-1.webp"
  );
  const [readMinutes, setReadMinutes] = useState(
    initialPost?.readMinutes || 5
  );

  const [metaTitle, setMetaTitle] = useState(
    initialPost?.metaTitle || initialPost?.title || ""
  );
  const [metaDescription, setMetaDescription] = useState(
    initialPost?.metaDescription || initialPost?.excerpt || ""
  );
  const [focusKeyword, setFocusKeyword] = useState(
    initialPost?.focusKeyword || ""
  );
  const [serpView, setSerpView] = useState<"desktop" | "mobile">("desktop");

  const [htmlContent, setHtmlContent] = useState<string>(() => {
    if (initialPost?.htmlContent) return initialPost.htmlContent;
    if (initialPost?.content && initialPost.content.length > 0) {
      return blocksToHtml(initialPost.content);
    }
    return `<h2>Introduction</h2><p>Write or paste your article content here. Headings, bold text, links, and lists will automatically format...</p>`;
  });

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(() => {
    if (initialPost?.faqs && Array.isArray(initialPost.faqs) && initialPost.faqs.length > 0) {
      return initialPost.faqs;
    }
    if (initialPost?.content) {
      const faqBlock = initialPost.content.find((b) => b.type === "faq");
      if (faqBlock && "items" in faqBlock && Array.isArray(faqBlock.items)) {
        return faqBlock.items;
      }
    }
    return [
      {
        question: "What is this guide about?",
        answer: "This is an actionable FAQ answer explaining the core takeaway.",
      },
    ];
  });

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isNew && !isSlugCustom && title) {
      setSlug(slugify(title));
    }
    if (isNew && (!metaTitle || metaTitle === initialPost?.title)) {
      setMetaTitle(title);
    }
  }, [title, isNew, isSlugCustom, initialPost?.title, metaTitle]);

  useEffect(() => {
    const calculated = calculateReadTime(htmlContent);
    setReadMinutes(calculated);
  }, [htmlContent]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Tag helpers
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // FAQ helpers
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleUpdateFaq = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Image upload handler

  const handleSave = async (explicitStatus?: "published" | "draft") => {
    const targetStatus = explicitStatus || status;

    if (!title.trim()) {
      setToast({ type: "error", message: "Please enter a post title." });
      return;
    }

    const cleanSlug = slugify(slug || title);
    if (!cleanSlug) {
      setToast({ type: "error", message: "Please enter a valid slug." });
      return;
    }

    setSaving(true);

    const validFaqs = faqs.filter((f) => f.question.trim() || f.answer.trim());

    const payload: Partial<BlogPost> = {
      title: title.trim(),
      slug: cleanSlug,
      excerpt: excerpt.trim() || title.trim(),
      date,
      status: targetStatus,
      author,
      category,
      tags,
      featureImage,
      readMinutes: Number(readMinutes) || calculateReadTime(htmlContent),
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim() || title.trim(),
      focusKeyword: focusKeyword.trim(),
      htmlContent,
      faqs: validFaqs,
    };

    try {
      let res: Response;
      if (isNew) {
        res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const originalSlug = initialPost?.slug || cleanSlug;
        res = await fetch(`/api/admin/posts/${encodeURIComponent(originalSlug)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      setStatus(targetStatus);
      setToast({
        type: "success",
        message:
          targetStatus === "published"
            ? "Post published successfully!"
            : "Draft saved successfully!",
      });

      if (isNew) {
        router.push(`/admin/posts/edit/${cleanSlug}`);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to save post";
      setToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;
  const keywordInTitle = focusKeyword
    ? metaTitle.toLowerCase().includes(focusKeyword.toLowerCase())
    : true;
  const keywordInDesc = focusKeyword
    ? metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())
    : true;

  const previewToc = extractHeadingsFromHtml(htmlContent);
  const activePreviewFaqs = faqs.filter((f) => f.question.trim());

  return (
    <div className="min-h-screen bg-slate-100/60 pb-20">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-bounce ${
            toast.type === "success"
              ? "bg-emerald-950 text-emerald-200 border-emerald-800"
              : "bg-rose-950 text-rose-200 border-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sticky Header Nav */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              ← All Posts
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status === "published" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "edit"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Edit3 size={13} />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "preview"
                    ? "bg-white text-orange-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Eye size={13} />
                <span>Live Preview</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>
                {isNew
                  ? status === "draft"
                    ? "Publish Now"
                    : "Publish Post"
                  : "Update Post"}
              </span>
            </button>

            {!isNew && (
              <Link
                href={`/blog/${slug}`}
                target="_blank"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="View live post on site"
              >
                <ExternalLink size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 pt-8">
        {viewMode === "preview" ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-900 text-white p-4 px-8 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
                <Eye size={14} />
                <span>Live Article Preview</span>
              </div>
              <button
                onClick={() => setViewMode("edit")}
                className="text-xs font-bold text-slate-300 hover:text-white underline"
              >
                Back to Edit Mode
              </button>
            </div>
            <div className="relative bg-[#0b1b36] overflow-hidden pt-16 pb-20 px-6 text-center text-white">
              {featureImage && (
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src={featureImage}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                  {category}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                  {title || "Untitled Post"}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300 text-sm font-medium">
                  <span>
                    By <strong className="text-white">{author}</strong>
                  </span>
                  <span>•</span>
                  <span>{date}</span>
                  <span>•</span>
                  <span>{readMinutes} min read</span>
                </div>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 min-w-0">
                {excerpt && (
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8 p-6 bg-orange-50/60 rounded-2xl border border-orange-100">
                    {excerpt}
                  </p>
                )}
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-6 prose-a:text-blue-600 prose-a:font-semibold prose-a:underline hover:prose-a:text-blue-800 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-lg prose-li:text-slate-700 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:border prose-td:border-slate-200 prose-td:p-3"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {activePreviewFaqs.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <FaqAccordion items={activePreviewFaqs} />
                  </div>
                )}
              </div>

              <aside className="w-full lg:w-80 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    Table of Contents
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    {previewToc.map((b, i) => (
                      <div
                        key={i}
                        className={`${
                          b.type === "h3"
                            ? "pl-4 text-slate-500 text-xs"
                            : "font-semibold text-slate-800"
                        }`}
                      >
                        {b.text}
                      </div>
                    ))}
                    {previewToc.length === 0 && (
                      <p className="text-xs text-slate-400">
                        Add H2 or H3 headings in your article to see the table of contents.
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Main Content Column */}
            <div className="lg:col-span-8 space-y-5">
              {/* Title Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title here..."
                  className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 border-none outline-none focus:ring-0 p-0 mb-4"
                />

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400">Permalink:</span>
                  <span className="text-slate-400">https://tothewebpro.com/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugCustom(true);
                      setSlug(slugify(e.target.value));
                    }}
                    placeholder="post-url-slug"
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none text-xs"
                  />
                  {isSlugCustom && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSlugCustom(false);
                        setSlug(slugify(title));
                      }}
                      className="text-[11px] text-orange-600 hover:text-orange-700 font-bold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Excerpt Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Post Excerpt / Summary
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {excerpt.length} characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Write a quick, engaging 2-sentence summary for search snippets and preview cards..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 focus:bg-white focus:border-orange-500 outline-none transition-all"
                />
              </div>

              {/* Rich Text CKEditor Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Article Description &amp; Content
                  </label>
          
                </div>

                <RichTextEditor
                  value={htmlContent}
                  onChange={setHtmlContent}
                  placeholder="Type or paste your article here... Headings, lists, bold text, and links will auto-detect."
                  minHeight="520px"
                />
              </div>

              {/* FAQ Accordions Section */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="text-orange-600" size={20} />
                      <h3 className="text-lg font-bold text-slate-900">
                        Frequently Asked Questions (FAQ Section)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Add interactive Q&amp;A accordions. These render as expand/collapse accordions and generate Google FAQ Schema.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100">
                    {faqs.length} FAQs
                  </span>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-orange-200 hover:bg-white transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-extrabold">
                            {index + 1}
                          </span>
                          <span>Question #{index + 1}</span>
                        </span>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          handleUpdateFaq(index, "question", e.target.value)
                        }
                        placeholder="e.g. How does this tool optimize meta titles?"
                        className="w-full text-sm font-bold border border-slate-200 rounded-xl px-3.5 py-2 focus:border-orange-500 outline-none bg-white"
                      />

                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) =>
                          handleUpdateFaq(index, "answer", e.target.value)
                        }
                        placeholder="Write a clear, concise answer..."
                        className="w-full text-sm border border-slate-200 rounded-xl p-3.5 focus:border-orange-500 outline-none bg-white leading-relaxed text-slate-700"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 text-orange-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus size={15} />
                    <span>Add Another FAQ Question</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-4 space-y-5">
              {/* Publish Settings */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Publish Settings</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">
                    Post Status
                  </label>
                  <CustomSelect
                    value={status}
                    onChange={(val) =>
                      setStatus(val as "published" | "draft")
                    }
                    options={[
                      {
                        value: "published",
                        label: "Published (Public)",
                        dotColor: "bg-emerald-500",
                        badge: "Live",
                      },
                      {
                        value: "draft",
                        label: "Draft (Admin only)",
                        dotColor: "bg-amber-500",
                        badge: "Draft",
                      },
                    ]}
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>Publish Date</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <User size={13} />
                    <span>Author Name</span>
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Izhar Ul Haq"
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>Read Time (Minutes)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={readMinutes}
                      onChange={(e) => setReadMinutes(Number(e.target.value))}
                      className="w-24 text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none"
                    />
                    <span className="text-xs text-slate-400 font-medium">
                      (Auto calculated from words)
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <FeaturedImageUploader
                value={featureImage}
                onChange={setFeatureImage}
                onToast={setToast}
              />

              {/* Category & Tags */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Category &amp; Tags</span>
                  <Folder size={16} className="text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">
                    Category
                  </label>
                  <CustomSelect
                    value={category}
                    onChange={setCategory}
                    options={DEFAULT_CATEGORIES.map((cat) => ({
                      value: cat,
                      label: cat,
                    }))}
                    icon={<Folder size={13} />}
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                    <Tag size={12} />
                    <span>Tags (Press Enter or comma to add)</span>
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="e.g. SEO, Meta Tags, Ranking..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium"
                      >
                        <span>#{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-slate-400 hover:text-rose-500 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO Snippet & Meta Settings */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-orange-500" />
                    <span>Yoast SEO Snippet</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSerpView("desktop")}
                      className={`px-2 py-0.5 rounded ${
                        serpView === "desktop"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-400"
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpView("mobile")}
                      className={`px-2 py-0.5 rounded ${
                        serpView === "mobile"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-400"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-[11px] text-slate-400 font-mono truncate mb-1">
                    https://tothewebpro.com › blog › {slug || "your-post-slug"}
                  </div>
                  <div className="text-base font-semibold text-blue-700 hover:underline leading-snug cursor-pointer line-clamp-1 mb-1.5">
                    {metaTitle || title || "Your Page Title Goes Here"}
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {metaDescription ||
                      excerpt ||
                      "Write an optimized meta description to attract more searchers from Google results..."}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">
                    Focus Target Keyword
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. meta title seo"
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none"
                  />
                  {focusKeyword && (
                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {keywordInTitle ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={12} className="text-amber-500" />
                        )}
                        <span className={keywordInTitle ? "text-emerald-700" : "text-amber-700"}>
                          Keyword in Meta Title
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {keywordInDesc ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={12} className="text-amber-500" />
                        )}
                        <span className={keywordInDesc ? "text-emerald-700" : "text-amber-700"}>
                          Keyword in Meta Description
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>SEO Meta Title</span>
                    <span
                      className={`text-[11px] ${
                        titleLength >= 45 && titleLength <= 60
                          ? "text-emerald-600"
                          : titleLength > 60
                          ? "text-rose-600"
                          : "text-amber-600"
                      }`}
                    >
                      {titleLength}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Custom meta title for Google..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none"
                  />
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        titleLength >= 45 && titleLength <= 60
                          ? "bg-emerald-500"
                          : titleLength > 60
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>SEO Meta Description</span>
                    <span
                      className={`text-[11px] ${
                        descLength >= 120 && descLength <= 160
                          ? "text-emerald-600"
                          : descLength > 160
                          ? "text-rose-600"
                          : "text-amber-600"
                      }`}
                    >
                      {descLength}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Custom meta description for search results..."
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none"
                  />
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        descLength >= 120 && descLength <= 160
                          ? "bg-emerald-500"
                          : descLength > 160
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
