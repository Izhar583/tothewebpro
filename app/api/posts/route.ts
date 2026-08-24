import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getAllPosts(false); // published only
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
