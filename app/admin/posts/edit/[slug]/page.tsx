import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog-service";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: { slug: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostBySlug(params.slug, true);

  if (!post) {
    notFound();
  }

  return <PostEditor initialPost={post} isNew={false} />;
}
