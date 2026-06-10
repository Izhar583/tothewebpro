export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "write-meta-descriptions-that-earn-clicks",
    title: "How to Write Meta Descriptions That Earn More Clicks in 2026",
    excerpt:
      "Learn how to write compelling meta descriptions that boost your CTR in Google search results. Includes examples, tips, and character limits explained.",
    date: "2026-05-01",
    readMinutes: 6,
    content: [
      "Meta descriptions do not directly dictate rankings, but they shape whether searchers choose your result. In competitive English-speaking markets, a crisp promise, proof point, and aligned keyword phrase can lift click-through rate while reducing bounces caused by mismatched expectations.",
      "Start from the query intent behind your page. Informational pages should foreground the answer shape—steps, checklist, or definition—while commercial pages can highlight differentiators such as pricing transparency, guarantees, or speed of delivery. Mirror the language users type, but avoid repeating the title verbatim.",
      "Keep an eye on length. Desktop snippets tolerate longer lines than mobile, so front-load the value proposition. If you localise pages, write unique descriptions per locale rather than translating one string blindly—UK and US spelling differences matter for trust.",
      "Finally, pair descriptions with on-page H1 and intro copy. When messaging aligns, Google is less likely to rewrite your snippet, and users see a coherent story from SERP to first screen.",
    ],
  },
  {
    slug: "core-web-vitals-for-content-teams",
    title: "Core Web Vitals for Content Teams | What You Need to Know",
    excerpt:
      "Understand Core Web Vitals and how they affect your content rankings. A simple guide for non technical content teams to improve page experience scores.",
    date: "2026-05-02",
    readMinutes: 7,
    content: [
      "Core Web Vitals remain a practical quality bar for user experience and SEO. Largest Contentful Paint often traces back to hero media, so content teams should supply appropriately sized masters and avoid multi-megabyte PNGs for photographic heroes.",
      "Interaction to Next Paint reflects how quickly the page responds to taps and clicks. Third-party embeds—chat widgets, survey tools, and heavy ad containers—can starve the main thread. Sequence non-critical scripts and prefer lightweight embeds when demos require interactivity.",
      "Cumulative Layout Shift is frequently a content issue: late-loading banners, dynamic consent bars, or unsized iframes push text while users read. Always declare width and height attributes for images and reserve space for promotional slots.",
      "Collaborate with developers on responsive breakpoints and modern formats such as AVIF or WebP. ToTheWebPro image tools help you compress and resize before upload, shrinking the performance feedback loop for writers without desktop utilities.",
    ],
  },
];

export const BLOG_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
);
