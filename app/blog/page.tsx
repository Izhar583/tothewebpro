import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog-service";
import { BlogFeed } from "@/components/blog/BlogFeed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | SEO Tips, Web Tools and Digital Marketing Guides",
  description:
    "Read practical guides on SEO, website optimization, and digital tools. Actionable tips for beginners and professionals alike.",
  alternates: { canonical: "https://tothewebpro.com/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
      <BlogFeed initialPosts={posts} />
    </div>
  );
}
