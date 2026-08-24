import fs from "fs/promises";
import path from "path";
import { BLOG_POSTS as SEED_POSTS } from "./blog-posts";
import { BlogPost, BlogContentBlock, calculateReadTime } from "./blog-types";

export type { BlogPost, BlogContentBlock };
export { calculateReadTime };

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

let memoryCache: BlogPost[] | null = null;
let lastReadTime = 0;
const CACHE_TTL_MS = 2000; // 2 seconds cache in dev/production

/**
 * Initializes data directory and posts.json if not present
 */
async function ensureDataFile(): Promise<BlogPost[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }

  try {
    const raw = await fs.readFile(POSTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // File doesn't exist or is invalid JSON, initialize with SEED_POSTS
  }

  // Seed default posts with standard WordPress-like fields
  const initialPosts: BlogPost[] = SEED_POSTS.map((p, index) => ({
    ...p,
    status: "published",
    author: index % 2 === 0 ? "Izhar Ul Haq" : "ToTheWebPro Team",
    category:
      p.slug.includes("vitals")
        ? "Web Performance"
        : p.slug.includes("description")
        ? "SEO & CTR"
        : "SEO Guides",
    tags: ["SEO", "Web Optimization", "Digital Marketing"],
    metaTitle: p.title,
    metaDescription: p.excerpt,
    focusKeyword: p.title.split(":")[0] || p.title,
    updatedAt: p.date,
  }));

  try {
    await fs.writeFile(POSTS_FILE, JSON.stringify(initialPosts, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write initial posts.json:", err);
  }

  return initialPosts;
}

/**
 * Reads all posts (published and drafts)
 */
export async function getAllPosts(includeDrafts = true): Promise<BlogPost[]> {
  const now = Date.now();
  if (memoryCache && now - lastReadTime < CACHE_TTL_MS) {
    return includeDrafts
      ? memoryCache
      : memoryCache.filter((p) => p.status === "published");
  }

  const posts = await ensureDataFile();
  memoryCache = posts;
  lastReadTime = now;

  return includeDrafts
    ? posts
    : posts.filter((p) => p.status === "published");
}

/**
 * Gets a single post by slug
 */
export async function getPostBySlug(
  slug: string,
  includeDrafts = true
): Promise<BlogPost | null> {
  const posts = await getAllPosts(includeDrafts);
  const normalizedSlug = slug.trim().toLowerCase();
  return (
    posts.find((p) => p.slug.trim().toLowerCase() === normalizedSlug) || null
  );
}

/**
 * Saves all posts array to data/posts.json
 */
async function persistPosts(posts: BlogPost[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
  memoryCache = posts;
  lastReadTime = Date.now();
}

/**
 * Creates a new blog post
 */
export async function createPost(
  newPost: Omit<BlogPost, "updatedAt"> & { updatedAt?: string }
): Promise<BlogPost> {
  const posts = await getAllPosts(true);

  // Validate slug uniqueness
  const slugExists = posts.some(
    (p) => p.slug.trim().toLowerCase() === newPost.slug.trim().toLowerCase()
  );
  if (slugExists) {
    throw new Error(`A post with slug "${newPost.slug}" already exists.`);
  }

  const fullPost: BlogPost = {
    ...newPost,
    status: newPost.status || "published",
    updatedAt: newPost.updatedAt || new Date().toISOString().split("T")[0],
    readMinutes: newPost.readMinutes || calculateReadTime(newPost.content),
  };

  // Add to top of list
  const updatedList = [fullPost, ...posts];
  await persistPosts(updatedList);
  return fullPost;
}

/**
 * Updates an existing blog post by slug
 */
export async function updatePost(
  targetSlug: string,
  updatedData: Partial<BlogPost>
): Promise<BlogPost> {
  const posts = await getAllPosts(true);
  const index = posts.findIndex(
    (p) => p.slug.trim().toLowerCase() === targetSlug.trim().toLowerCase()
  );

  if (index === -1) {
    throw new Error(`Post with slug "${targetSlug}" not found.`);
  }

  const current = posts[index];

  // If slug is changing, verify the new slug isn't taken by another post
  if (
    updatedData.slug &&
    updatedData.slug.trim().toLowerCase() !== targetSlug.trim().toLowerCase()
  ) {
    const slugConflict = posts.some(
      (p, i) =>
        i !== index &&
        p.slug.trim().toLowerCase() === updatedData.slug!.trim().toLowerCase()
    );
    if (slugConflict) {
      throw new Error(`Slug "${updatedData.slug}" is already in use.`);
    }
  }

  const merged: BlogPost = {
    ...current,
    ...updatedData,
    updatedAt: new Date().toISOString().split("T")[0],
  };

  if (updatedData.content && !updatedData.readMinutes) {
    merged.readMinutes = calculateReadTime(updatedData.content);
  }

  posts[index] = merged;
  await persistPosts(posts);
  return merged;
}

/**
 * Deletes a blog post by slug
 */
export async function deletePost(targetSlug: string): Promise<boolean> {
  const posts = await getAllPosts(true);
  const filtered = posts.filter(
    (p) => p.slug.trim().toLowerCase() !== targetSlug.trim().toLowerCase()
  );

  if (filtered.length === posts.length) {
    return false; // Not found
  }

  await persistPosts(filtered);
  return true;
}
