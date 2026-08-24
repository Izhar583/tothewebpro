import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { getAllPosts, createPost } from "@/lib/blog-service";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getAllPosts(true); 
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error getting posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const created = await createPost({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || "",
      date: body.date || new Date().toISOString().split("T")[0],
      status: body.status || "draft",
      readMinutes: Number(body.readMinutes) || 5,
      featureImage: body.featureImage || "",
      author: body.author || "Admin",
      category: body.category || "General",
      tags: Array.isArray(body.tags) ? body.tags : [],
      metaTitle: body.metaTitle || body.title,
      metaDescription: body.metaDescription || body.excerpt,
      focusKeyword: body.focusKeyword || "",
      content: Array.isArray(body.content) ? body.content : [],
    });

    return NextResponse.json({ success: true, post: created }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating post:", error);
    const msg = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
