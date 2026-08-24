import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit,
  FolderTree,
} from "lucide-react";
import { getAllPosts } from "@/lib/blog-service";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const posts = await getAllPosts(true);

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const totalReadMinutes = posts.reduce(
    (acc, p) => acc + (p.readMinutes || 5),
    0
  );

  const categories = Array.from(new Set(posts.map((p) => p.category || "General")));

  const recentPosts = posts.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Manage your blog articles, publications, and SEO content."
        action={{
          label: "Add New Post",
          href: "/admin/posts/new",
          icon: "plus",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Posts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-orange-300 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Articles
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-2">
                {totalPosts}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-1">
                All created posts
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              <FileText size={22} />
            </div>
          </div>

          {/* Card 2: Published */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live &amp; Published
              </div>
              <div className="text-3xl font-bold text-emerald-600 mt-2">
                {publishedPosts}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-1">
                Visible on public blog
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              <CheckCircle2 size={22} />
            </div>
          </div>

          {/* Card 3: Drafts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-300 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Drafts
              </div>
              <div className="text-3xl font-bold text-amber-600 mt-2">
                {draftPosts}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-1">
                Unpublished ideas
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              <Clock size={22} />
            </div>
          </div>

          {/* Card 4: Categories */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Categories
              </div>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                {categories.length}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-1">
                {totalReadMinutes} mins total reading
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              <FolderTree size={22} />
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Recent Blog Articles
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Latest created and edited posts in your database.
              </p>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              View All ({totalPosts}) →
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Title &amp; URL</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentPosts.map((post) => (
                  <tr
                    key={post.slug}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 line-clamp-1 max-w-md">
                        {post.title}
                      </div>
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/edit/${post.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold transition-all"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </Link>
                        {post.status === "published" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View live post"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
