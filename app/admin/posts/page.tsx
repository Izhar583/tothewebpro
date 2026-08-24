"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Filter,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { BlogPost } from "@/lib/blog-types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        throw new Error(data.error || "Failed to load posts");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch posts";
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDelete = async (slug: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${postTitle}"?`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      setToast({ type: "success", message: "Post deleted successfully." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete post";
      setToast({ type: "error", message: msg });
    } finally {
      setDeletingSlug(null);
    }
  };

  const categories = Array.from(
    new Set(posts.map((p) => p.category || "General"))
  );

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || (post.category || "General") === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <AdminHeader
        title="All Blog Posts"
        subtitle="Manage, edit, publish and search all articles on ToTheWebPro."
        action={{
          label: "Add New Post",
          href: "/admin/posts/new",
          icon: "plus",
        }}
      />

      {/* Toast */}
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

      <div className="max-w-9xl mx-auto px-6 py-8 space-y-6">
        {/* Filters & Search Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold w-fit">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  statusFilter === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All Posts ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("published")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  statusFilter === "published"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Published ({publishedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  statusFilter === "draft"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Drafts ({draftCount})
              </button>
            </div>

            {/* Category Dropdown & Refresh */}
            <div className="flex items-center gap-3">
              <CustomSelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { value: "all", label: "All Categories" },
                  ...categories.map((c) => ({ value: c, label: c })),
                ]}
                icon={<Filter size={14} />}
                size="sm"
              />

              <button
                type="button"
                onClick={fetchPosts}
                disabled={loading}
                title="Refresh posts"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title, slug, keywords or excerpt..."
              className="w-full text-xs font-medium border border-slate-200 rounded-2xl pl-10 pr-4 py-3 bg-slate-50/70 focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm font-semibold flex items-center justify-center gap-2">
              <RefreshCw size={18} className="animate-spin text-orange-500" />
              <span>Loading posts...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-extrabold text-slate-900 text-base mb-1">
                No blog posts found
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                {search
                  ? "No posts match your search query."
                  : "You haven't created any posts in this filter yet."}
              </p>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20"
              >
                <Plus size={14} />
                <span>Create First Post</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Post Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.slug}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/posts/edit/${post.slug}`}
                          className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 max-w-md block"
                        >
                          {post.title}
                        </Link>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          /blog/{post.slug}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          {post.category || "General"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        {post.author || "Admin"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            post.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              post.status === "published"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {post.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {post.date}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/posts/edit/${post.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold transition-all"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </Link>

                          {post.status === "published" && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View on public site"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(post.slug, post.title)}
                            disabled={deletingSlug === post.slug}
                            title="Delete permanently"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
