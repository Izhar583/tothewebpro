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
  content?: BlogContentBlock[];
  htmlContent?: string;
  faqs?: { question: string; answer: string }[];
  updatedAt?: string;
}

/**
 * Helper to calculate reading time in minutes from content blocks or HTML string
 */
export function calculateReadTime(
  contentOrHtml: BlogContentBlock[] | string | undefined
): number {
  if (!contentOrHtml) return 3;

  if (typeof contentOrHtml === "string") {
    // Strip HTML tags and entities
    const clean = contentOrHtml
      .replace(/<[^>]*>?/gm, " ")
      .replace(/&[a-z0-9#]+;/gi, " ");
    const words = clean.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  }

  if (Array.isArray(contentOrHtml)) {
    let totalWords = 0;
    for (const block of contentOrHtml) {
      if ("text" in block && typeof block.text === "string") {
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

  return 3;
}
