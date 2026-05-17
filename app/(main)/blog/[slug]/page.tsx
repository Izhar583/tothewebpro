import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_BY_SLUG, BLOG_POSTS } from "@/lib/blog-posts";

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
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://tothewebpro.com/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `https://tothewebpro.com/blog/${post.slug}`,
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
      publishedTime: post.date,
      authors: ["ToTheWebPro"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/og-default.png"],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = BLOG_BY_SLUG[params.slug];
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm font-bold text-orange-600 hover:text-orange-700">
        ← Back to blog
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
        {post.date} · {post.readMinutes} min read
      </p>
      <h1 className="mt-2 text-4xl font-black text-slate-900">{post.title}</h1>
      <div className="prose prose-orange mt-8 max-w-none text-slate-700 leading-relaxed">
        {post.content.map((paragraph, index) => (
          <p key={index} className="mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
