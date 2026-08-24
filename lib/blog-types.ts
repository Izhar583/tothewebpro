export type BlogContentBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "img"; url: string; alt: string; caption?: string }
  | { type: "ul"; items: string[] }
  | { type: "faq"; items: { question: string; answer: string }[] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  status: "published" | "draft";
  readMinutes: number;
  featureImage?: string;
  author?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  content: BlogContentBlock[];
  updatedAt?: string;
}

/**
 * Helper to calculate reading time in minutes from content blocks
 */
export function calculateReadTime(content: BlogContentBlock[]): number {
  if (!content || !Array.isArray(content)) return 3;

  let totalWords = 0;
  for (const block of content) {
    if ("text" in block && typeof block.text === "string") {
      // Strip HTML tags
      const clean = block.text.replace(/<[^>]*>?/gm, " ");
      totalWords += clean.trim().split(/\s+/).filter(Boolean).length;
    } else if (block.type === "ul") {
      for (const item of block.items) {
        totalWords += item.trim().split(/\s+/).filter(Boolean).length;
      }
    } else if (block.type === "faq") {
      for (const item of block.items) {
        totalWords += (item.question + " " + item.answer)
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;
      }
    }
  }

  const minutes = Math.ceil(totalWords / 200);
  return Math.max(1, minutes);
}
