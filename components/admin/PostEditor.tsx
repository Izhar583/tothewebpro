"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Eye,
  Edit3,
  Image as ImageIcon,
  Heading2,
  Heading3,
  AlignLeft,
  List,
  HelpCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Plus,
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
} from "lucide-react";
import { BlogPost, BlogContentBlock, calculateReadTime } from "@/lib/blog-types";
import { CustomSelect } from "@/components/ui/CustomSelect";

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

  const [content, setContent] = useState<BlogContentBlock[]>(
    initialPost?.content || [
      {
        type: "h2",
        text: "Introduction",
        id: "introduction",
      },
      {
        type: "p",
        text: "Write your introductory paragraph here. You can include <b>bold text</b>, links, or formatting.",
      },
      {
        type: "faq",
        items: [
          {
            question: "What is this guide about?",
            answer: "This is an actionable FAQ answer.",
          },
        ],
      },
    ]
  );

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    const calculated = calculateReadTime(content);
    setReadMinutes(calculated);
  }, [content]);

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

  const handleAddBlock = (type: BlogContentBlock["type"]) => {
    let newBlock: BlogContentBlock;

    switch (type) {
      case "h2":
        newBlock = {
          type: "h2",
          text: "New Section Heading",
          id: slugify("New Section Heading"),
        };
        break;
      case "h3":
        newBlock = {
          type: "h3",
          text: "New Sub-Heading",
          id: slugify("New Sub-Heading"),
        };
        break;
      case "p":
        newBlock = {
          type: "p",
          text: "Write your paragraph here...",
        };
        break;
      case "img":
        newBlock = {
          type: "img",
          url: "/blog/3blog-1.webp",
          alt: "Image description",
          caption: "Image caption",
        };
        break;
      case "ul":
        newBlock = {
          type: "ul",
          items: ["Key takeaway or list item 1", "List item 2"],
        };
        break;
      case "faq":
        newBlock = {
          type: "faq",
          items: [
            {
              question: "Frequently Asked Question?",
              answer: "Detailed answer goes here.",
            },
          ],
        };
        break;
      default:
        newBlock = { type: "p", text: "Text here..." };
    }

    setContent([...content, newBlock]);
  };

  const handleUpdateBlock = (index: number, updatedBlock: BlogContentBlock) => {
    const updated = [...content];
    updated[index] = updatedBlock;
    setContent(updated);
  };

  const handleDeleteBlock = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= content.length) return;

    const copy = [...content];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setContent(copy);
  };

  // Image upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      onSuccess(data.url);
      setToast({ type: "success", message: "Image uploaded successfully!" });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setToast({ type: "error", message: msg });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

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
      readMinutes: Number(readMinutes) || 5,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim() || title.trim(),
      focusKeyword: focusKeyword.trim(),
      content,
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
                    ? "bg-white text-slate-900 shadow-sm"
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
                    ? "bg-white text-orange-600 shadow-sm"
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
                  <span>By <strong className="text-white">{author}</strong></span>
                  <span>•</span>
                  <span>{date}</span>
                  <span>•</span>
                  <span>{readMinutes} min read</span>
                </div>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
              <div className="flex-1 min-w-0">
                {excerpt && (
                  <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8 p-6 bg-orange-50/60 rounded-2xl border border-orange-100">
                    {excerpt}
                  </p>
                )}
                <div className="space-y-6">
                  {content.map((block, idx) => {
                    switch (block.type) {
                      case "h2":
                        return (
                          <h2
                            key={idx}
                            id={block.id}
                            className="text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-4 pt-4 border-t border-slate-100"
                          >
                            {block.text}
                          </h2>
                        );
                      case "h3":
                        return (
                          <h3
                            key={idx}
                            id={block.id}
                            className="text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-3"
                          >
                            {block.text}
                          </h3>
                        );
                      case "p":
                        return (
                          <p
                            key={idx}
                            className="text-lg text-slate-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: block.text }}
                          />
                        );
                      case "img":
                        return (
                          <figure
                            key={idx}
                            className="my-8 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
                          >
                            <div className="relative w-full aspect-video">
                              <Image
                                src={block.url}
                                alt={block.alt || "Image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {block.caption && (
                              <figcaption className="bg-slate-50 text-slate-500 text-sm p-3 text-center border-t border-slate-200">
                                {block.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      case "ul":
                        return (
                          <ul
                            key={idx}
                            className="list-disc pl-6 space-y-2 text-lg text-slate-700 my-4"
                          >
                            {block.items.map((it, i) => (
                              <li key={i}>{it}</li>
                            ))}
                          </ul>
                        );
                      case "faq":
                        return (
                          <div key={idx} className="my-10 space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                              Frequently Asked Questions
                            </h3>
                            {block.items.map((item, i) => (
                              <div
                                key={i}
                                className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
                              >
                                <div className="font-bold text-slate-900 text-base mb-2">
                                  {item.question}
                                </div>
                                <div className="text-slate-600 text-sm leading-relaxed">
                                  {item.answer}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>

              <aside className="w-full lg:w-80 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    Table of Contents
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    {content
                      .filter(
                        (b): b is { type: "h2" | "h3"; text: string; id: string } =>
                          b.type === "h2" || b.type === "h3"
                      )
                      .map((b, i) => (
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
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">
                    Tags
                  </h4>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
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

              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Article Content Blocks
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Build your article structure using modular headings, paragraphs, images, and FAQs.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100">
                    {content.length} Blocks
                  </span>
                </div>
                <div className="space-y-4">
                  {content.map((block, index) => (
                    <div
                      key={index}
                      className="group relative border border-slate-200 rounded-2xl bg-white p-5 hover:border-orange-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 text-xs">
                        <div className="flex items-center gap-2 font-bold text-slate-500">
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          <span className="uppercase text-[11px] tracking-wider text-orange-600">
                            {block.type === "h2"
                              ? "Heading 2"
                              : block.type === "h3"
                              ? "Heading 3"
                              : block.type === "p"
                              ? "Paragraph"
                              : block.type === "img"
                              ? "Image"
                              : block.type === "ul"
                              ? "Bullet List"
                              : block.type === "faq"
                              ? "FAQ Accordion"
                              : "Custom Block"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, "up")}
                            disabled={index === 0}
                            title="Move Block Up"
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, "down")}
                            disabled={index === content.length - 1}
                            title="Move Block Down"
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(index)}
                            title="Delete Block"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 ml-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {block.type === "h2" && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.text}
                            onChange={(e) =>
                              handleUpdateBlock(index, {
                                ...block,
                                text: e.target.value,
                                id: slugify(e.target.value),
                              })
                            }
                            placeholder="Enter Section Heading (H2)..."
                            className="w-full text-lg font-bold text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2 focus:border-orange-500 outline-none"
                          />
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <span>Anchor ID:</span>
                            <span className="font-mono text-slate-600">#{block.id}</span>
                          </div>
                        </div>
                      )}

                      {block.type === "h3" && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.text}
                            onChange={(e) =>
                              handleUpdateBlock(index, {
                                ...block,
                                text: e.target.value,
                                id: slugify(e.target.value),
                              })
                            }
                            placeholder="Enter Sub-Heading (H3)..."
                            className="w-full text-base font-bold text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2 focus:border-orange-500 outline-none"
                          />
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <span>Anchor ID:</span>
                            <span className="font-mono text-slate-600">#{block.id}</span>
                          </div>
                        </div>
                      )}

                      {block.type === "p" && (
                        <div>
                          <textarea
                            rows={4}
                            value={block.text}
                            onChange={(e) =>
                              handleUpdateBlock(index, {
                                ...block,
                                text: e.target.value,
                              })
                            }
                            placeholder="Write your paragraph here. You can use <b>bold</b>, <i>italic</i>, and <a href='...'>links</a>..."
                            className="w-full text-sm text-slate-700 leading-relaxed border border-slate-200 rounded-xl p-3.5 focus:border-orange-500 outline-none"
                          />
                        </div>
                      )}

                      {block.type === "img" && (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3 items-center">
                            <input
                              type="text"
                              value={block.url}
                              onChange={(e) =>
                                handleUpdateBlock(index, {
                                  ...block,
                                  url: e.target.value,
                                })
                              }
                              placeholder="Image URL (e.g. /blog/image.webp or https://...)"
                              className="flex-1 w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-orange-500 outline-none"
                            />
                            <label className="shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                              <Upload size={14} />
                              <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageUpload(e, (url) => {
                                    handleUpdateBlock(index, { ...block, url });
                                  })
                                }
                              />
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={block.alt}
                              onChange={(e) =>
                                handleUpdateBlock(index, {
                                  ...block,
                                  alt: e.target.value,
                                })
                              }
                              placeholder="Alt text for SEO..."
                              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 focus:border-orange-500 outline-none"
                            />
                            <input
                              type="text"
                              value={block.caption || ""}
                              onChange={(e) =>
                                handleUpdateBlock(index, {
                                  ...block,
                                  caption: e.target.value,
                                })
                              }
                              placeholder="Optional caption..."
                              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 focus:border-orange-500 outline-none"
                            />
                          </div>

                          {block.url && (
                            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              <Image
                                src={block.url}
                                alt={block.alt || "Preview"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {block.type === "ul" && (
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400">
                            Bullet Points (One per line)
                          </label>
                          <textarea
                            rows={4}
                            value={block.items.join("\n")}
                            onChange={(e) =>
                              handleUpdateBlock(index, {
                                ...block,
                                items: e.target.value.split("\n"),
                              })
                            }
                            placeholder="Point 1&#10;Point 2&#10;Point 3"
                            className="w-full text-sm text-slate-700 leading-relaxed border border-slate-200 rounded-xl p-3 focus:border-orange-500 outline-none"
                          />
                        </div>
                      )}

                      {block.type === "faq" && (
                        <div className="space-y-4">
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            FAQ Items (Schema Ready)
                          </div>
                          {block.items.map((faqItem, fIdx) => (
                            <div
                              key={fIdx}
                              className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">
                                  FAQ #{fIdx + 1}
                                </span>
                                {block.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedFaqs = block.items.filter(
                                        (_, i) => i !== fIdx
                                      );
                                      handleUpdateBlock(index, {
                                        ...block,
                                        items: updatedFaqs,
                                      });
                                    }}
                                    className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={faqItem.question}
                                onChange={(e) => {
                                  const updatedFaqs = [...block.items];
                                  updatedFaqs[fIdx] = {
                                    ...updatedFaqs[fIdx],
                                    question: e.target.value,
                                  };
                                  handleUpdateBlock(index, {
                                    ...block,
                                    items: updatedFaqs,
                                  });
                                }}
                                placeholder="Question (e.g. What is meta title length?)"
                                className="w-full text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 focus:border-orange-500 outline-none bg-white"
                              />
                              <textarea
                                rows={2}
                                value={faqItem.answer}
                                onChange={(e) => {
                                  const updatedFaqs = [...block.items];
                                  updatedFaqs[fIdx] = {
                                    ...updatedFaqs[fIdx],
                                    answer: e.target.value,
                                  };
                                  handleUpdateBlock(index, {
                                    ...block,
                                    items: updatedFaqs,
                                  });
                                }}
                                placeholder="Answer..."
                                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:border-orange-500 outline-none bg-white"
                              />
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateBlock(index, {
                                ...block,
                                items: [
                                  ...block.items,
                                  {
                                    question: "New Question",
                                    answer: "New Answer",
                                  },
                                ],
                              });
                            }}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                          >
                            <Plus size={13} />
                            <span>Add Another FAQ Question</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    + Add New Block
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddBlock("h2")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
                    >
                      <Heading2 size={14} />
                      <span>Heading 2</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("h3")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
                    >
                      <Heading3 size={14} />
                      <span>Heading 3</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("p")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
                    >
                      <AlignLeft size={14} />
                      <span>Paragraph</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("img")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
                    >
                      <ImageIcon size={14} />
                      <span>Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("ul")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
                    >
                      <List size={14} />
                      <span>Bullet List</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("faq")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
                    >
                      <HelpCircle size={14} />
                      <span>FAQ Accordion</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
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
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Featured Image</span>
                  <ImageIcon size={16} className="text-slate-400" />
                </div>

                {featureImage ? (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image
                        src={featureImage}
                        alt="Featured Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={featureImage}
                        onChange={(e) => setFeatureImage(e.target.value)}
                        placeholder="Image URL..."
                        className="flex-1 text-[11px] border border-slate-200 rounded-lg px-2 py-1 font-mono text-slate-600 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFeatureImage("")}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-orange-300 transition-colors">
                    <ImageIcon size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500 font-medium mb-3">
                      No featured image selected
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-orange-600/20">
                      <Upload size={13} />
                      <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, (url) => setFeatureImage(url))
                        }
                      />
                    </label>
                  </div>
                )}

                {featureImage && (
                  <label className="block text-center cursor-pointer text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 py-2 rounded-xl border border-orange-100">
                    <span>{uploadingImage ? "Uploading..." : "Replace with new upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (url) => setFeatureImage(url))
                      }
                    />
                  </label>
                )}
              </div>
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
