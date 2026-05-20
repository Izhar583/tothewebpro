import type { ToolDefinition } from "./types";

const paragraph = (...parts: string[]) => parts.join(" ");

export const TOOLS: ToolDefinition[] = [
  {
    slug: "meta-title-description-checker",
    name: "Meta Title & Description Checker",
    shortDescription:
      "Fetch or write titles and descriptions, see a live pixel-accurate SERP preview, scores, and character guidance.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "🔎",
    schemaDescription:
      "Free meta title and description checker with Google-style SERP preview, pixel-width scoring, character counts, and URL fetch.",
    metaTitle:
      "Meta Title Checker — Preview Your Title in Google Search Results",
    metaDescription:
      "Write meta titles that work. Get a real-time pixel-width simulation that mirrors how Google renders titles in the SERP — catch truncation before your client does.",
    howToUseParagraphs: [],
    faqs: [],
    relatedSlugs: ["word-counter", "character-counter", "case-converter"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription:
      "Count words, characters, sentences, and reading time with keyword frequency insights — real-time, in your browser.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "📝",
    schemaDescription:
      "Free word counter with real-time word, character, sentence, and paragraph counts, reading time, speaking time, and keyword frequency table.",
    metaTitle: "Word Counter — Count Words, Characters, and Reading Time",
    metaDescription:
      "Count words, characters, sentences, and reading time instantly. Built for SEO page targets, content briefs, and copy QA — free, private, no account needed.",
    howToUseParagraphs: [],
    faqs: [],
    relatedSlugs: [
      "character-counter",
      "case-converter",
      "meta-title-description-checker",
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    shortDescription:
      "Transform text into eight developer-friendly and editorial formats with live outputs.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "🔠",
    schemaDescription:
      "Free case converter for uppercase, title case, camelCase, snake_case, kebab-case, and more.",
    metaTitle: "Free Case Converter Online",
    metaDescription:
      "Convert text to uppercase, title case, camelCase, snake_case, kebab-case, and more. Live preview and one-click copy.",
    howToUseParagraphs: [
      paragraph(
        "The Case Converter accelerates repetitive text normalisation for writers and engineers. ",
        "Type or paste any string and instantly see eight parallel outputs, each with its own copy control. ",
        "Use it for slugs, variable names, headlines, legal disclaimers, or social captions without retyping.",
      ),
      paragraph(
        "Editorial modes include UPPERCASE, lowercase, Title Case, Sentence case, and alternating case for creative formats. ",
        "Developer modes cover camelCase, snake_case, and kebab-case, keeping separators predictable for APIs, URLs, and databases. ",
        "All transformations run locally in your browser for speed and privacy.",
      ),
      paragraph(
        "Combine this tool with the Word Counter when you refactor long documents: normalise headings, then verify length targets. ",
        "For SEO, consistent slug casing in kebab-case supports readable URLs; camelCase helps when exporting schema constants or front-end props. ",
        "If you need PascalCase for class names, derive it by capitalising the camelCase output manually or extend your snippet library.",
      ),
    ],
    faqs: [
      {
        question: "How does Title Case work?",
        answer:
          "Major words are capitalised using a simple English heuristic. Proper nouns may still need manual review.",
      },
      {
        question: "Does camelCase strip punctuation?",
        answer:
          "Non-alphanumeric characters are treated as separators. Numbers are preserved where meaningful.",
      },
      {
        question: "Can I convert multi-line text?",
        answer:
          "Yes. Line breaks are respected in outputs that are not delimiter-based; delimiter formats join words predictably.",
      },
      {
        question: "Will this translate text?",
        answer:
          "No. It only changes letter casing, not language or spelling.",
      },
      {
        question: "Is data sent to a server?",
        answer:
          "No. Conversion happens entirely in your browser session on ToTheWebPro.",
      },
    ],
    relatedSlugs: ["word-counter", "character-counter", "password-generator"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortDescription:
      "Reduce JPG, PNG, WebP, and GIF file size in your browser — lossless or lossy, with a quality slider and ZIP download.",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    icon: "🗜️",
    schemaDescription:
      "Browser-based image compressor with lossless and lossy modes, quality slider, savings preview, and ZIP download. No server upload.",
    metaTitle: "Free Image Compressor — Reduce File Size Without Losing Quality",
    metaDescription:
      "Compress JPG, PNG, and WebP images instantly in your browser. Lossless and lossy modes, no upload limits, no account required. Built for developers and SEO professionals.",
    howToUseParagraphs: [
      paragraph(
        "Every kilobyte your images carry is a kilobyte your users wait for. ",
        "If you've ever watched a Lighthouse report flag oversized images as the top performance hit, ",
        "you already know this isn't a cosmetic issue — it's a ranking issue. ",
        "This tool compresses images directly in your browser. No file size caps. No accounts. No data sent to a server.",
      ),
      paragraph(
        "Drag up to twenty images into the drop zone or click to browse. ",
        "Supported formats: JPG, PNG, WebP, and GIF. ",
        "Choose lossless compression to strip metadata without altering a single pixel — ideal for UI assets and logos. ",
        "Choose lossy compression to reduce file size more aggressively for photographs where minor detail loss is acceptable.",
      ),
      paragraph(
        "Adjust the quality slider between 10 and 100. A setting of 75–85 typically produces web-ready images ",
        "that are indistinguishable from the original at normal viewing distances. ",
        "Each row shows original size, compressed size, and savings percentage with an individual download button.",
      ),
      paragraph(
        "Use Download All as ZIP to hand assets to a developer or archive a batch. ",
        "Pair compression with responsive delivery in your CMS or CDN. ",
        "All processing uses your device CPU — files never leave your browser, supporting GDPR-friendly workflows.",
      ),
    ],
    faqs: [
      {
        question: "Does this tool upload my images to a server?",
        answer:
          "No. All compression processing happens locally in your browser using client-side JavaScript. Your images never leave your device, which also means the tool works offline after the page loads.",
      },
      {
        question: "What is the difference between lossless and lossy compression?",
        answer:
          "Lossless compression removes redundant encoding data without changing any pixel values — the image is mathematically identical to the original. Lossy compression applies perceptual algorithms that reduce colour data in ways the human eye is least likely to notice, achieving higher compression ratios at the cost of minor detail reduction.",
      },
      {
        question: "Will compression change my image dimensions or aspect ratio?",
        answer:
          "No. This tool compresses file size only. Your image width, height, and aspect ratio remain exactly as they were in the original file.",
      },
      {
        question: "What file formats are supported?",
        answer:
          "JPG, PNG, WebP, and GIF. For format conversion — such as converting a PNG to WebP — use the Image Converter tool.",
      },
      {
        question: "What quality setting should I use for web images?",
        answer:
          "For photographs in blog posts or hero sections, 75–82 typically produces excellent results. For product images where detail matters commercially, 85–90 is a safer range. For UI elements and icons, use lossless mode.",
      },
      {
        question: "How much file size reduction can I expect?",
        answer:
          "Typical reductions range from 30–70%. A 1.2MB PNG can often be reduced to under 400KB with no visible quality change. Process additional batches in a second pass if you need more than twenty files at once.",
      },
    ],
    relatedSlugs: ["image-resizer", "image-converter", "word-counter"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortDescription:
      "Resize images with aspect lock, social presets, and canvas-based export.",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    icon: "📐",
    schemaDescription:
      "Client-side image resizer with presets for HD, social, and custom dimensions.",
    metaTitle: "Free Image Resizer Online",
    metaDescription:
      "Resize JPG, PNG, or WebP locally. Lock aspect ratio, use social presets, preview output, and download instantly.",
    howToUseParagraphs: [
      paragraph(
        "The Image Resizer helps designers and marketers produce correctly dimensioned assets without desktop software. ",
        "Upload a single file, review the original width, height, and byte size, then enter target dimensions or tap a preset. ",
        "Aspect ratio lock keeps proportions when you adjust width or height—turn it off only when you intentionally need to stretch.",
      ),
      paragraph(
        "Presets cover common HD sizes plus Instagram, Twitter, and Facebook cover formats so campaign teams can move quickly. ",
        "The preview updates after each change, confirming crop behaviour before download. ",
        "Export uses the HTML Canvas API locally; nothing leaves your browser, aligning with privacy expectations for brand imagery.",
      ),
      paragraph(
        "After resizing, run the Image Compressor if you still need smaller files for mobile networks. ",
        "Document final dimensions in your content playbook so writers request consistent hero ratios. ",
        "Re-export whenever templates change to avoid blurry upscaling in responsive layouts.",
      ),
    ],
    faqs: [
      {
        question: "Will resizing reduce quality?",
        answer:
          "Downscaling generally looks sharp. Upscaling can soften details—supply the largest source file available.",
      },
      {
        question: "Which formats can I export?",
        answer:
          "The tool targets JPG and PNG-friendly workflows in the canvas; upload JPG, PNG, or WebP sources for best results.",
      },
      {
        question: "How do presets map to real platforms?",
        answer:
          "Sizes follow commonly cited specs but platforms change—verify current guidelines before publishing.",
      },
      {
        question: "Can I resize animated images?",
        answer:
          "Animated GIFs may lose motion when rasterised to canvas; use dedicated GIF tools for animation.",
      },
      {
        question: "Is EXIF data kept?",
        answer:
          "Canvas export typically strips EXIF metadata—ideal for privacy, but keep originals if you need embedded colour profiles.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-converter", "meta-title-description-checker"],
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription:
      "Convert between PNG, JPEG, and WebP locally — format compatibility problems solved in seconds, nothing uploaded.",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    icon: "🔄",
    schemaDescription:
      "Convert images between PNG, JPEG, and WebP formats using local canvas processing. Private, instant, no server upload.",
    metaTitle: "Image Converter — Convert Between WebP, PNG, JPG, and More",
    metaDescription:
      "Convert images between WebP, PNG, and JPG directly in your browser. No plugins, no cloud queues, no account required. Instant download.",
    howToUseParagraphs: [
      paragraph(
        "Format compatibility problems cost time. You have a PNG that needs to be WebP ",
        "for your site's performance budget, or a WebP that needs to be JPG for a client's CMS ",
        "that still doesn't support modern formats. ",
        "This tool converts between the most common web image formats directly in your browser — ",
        "no plugins, no cloud queues, no waiting.",
      ),
      paragraph(
        "Upload your source image, choose the output format from the dropdown, ",
        "and optionally set quality for lossy outputs like JPG. ",
        "Preview the converted output and download immediately — processing stays on-device. ",
        "WebP offers superior compression over PNG and JPG with full transparency support; ",
        "use it as your default format for most web use cases.",
      ),
      paragraph(
        "Use this in SEO workflows when migrating CMS templates or cleaning legacy asset folders. ",
        "Consistent formats simplify caching rules and reduce transformation overhead at the CDN edge. ",
        "Always validate colour accuracy for brand-critical artwork after conversion, ",
        "and pair with the Image Compressor when you need both format migration and byte savings.",
      ),
    ],
    faqs: [
      {
        question: "Should I use WebP or PNG for my website?",
        answer:
          "WebP for almost everything. It offers better lossless and lossy compression than both PNG and JPG, with full transparency support. Use PNG only when you need maximum compatibility for older environments.",
      },
      {
        question: "Does converting to WebP affect image quality?",
        answer:
          "Not with lossless WebP — the image is mathematically identical to the source. Lossy WebP at 80–90 quality produces results most viewers cannot distinguish from the original at significantly smaller file sizes.",
      },
      {
        question: "What is the difference between JPG and WebP compression?",
        answer:
          "Both are lossy formats, but WebP's algorithm is more efficient — typically 25–35% smaller files at equivalent visual quality. WebP also supports lossless mode and transparency, which JPG does not.",
      },
      {
        question: "Does conversion remove transparency?",
        answer:
          "JPEG does not support transparency — transparent areas will flatten to white. WebP and PNG both support transparency. Preview carefully before exporting to JPEG from a file with an alpha channel.",
      },
      {
        question: "Can I batch convert multiple images?",
        answer:
          "This tool focuses on single-file conversion. For bulk work, run files individually or use the Image Compressor which supports batches of up to twenty files.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-resizer", "word-counter"],
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    shortDescription:
      "Count characters with and without spaces for social posts, meta fields, and UI copy — instant, private.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "🔢",
    schemaDescription:
      "Character counter for social posts, paid search copy, SMS, and UI microcopy — with and without spaces, real-time.",
    metaTitle: "Free Character Counter Online",
    metaDescription:
      "Count characters with and without spaces, lines, and paragraphs. Perfect for tweets, titles, and ads.",
    howToUseParagraphs: [],
    faqs: [],
    relatedSlugs: ["word-counter", "case-converter", "meta-title-description-checker"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription:
      "Create strong random passwords with length and character set controls.",
    category: "developer",
    categoryLabel: "Developer Tools",
    categoryPath: "/developer-tools",
    icon: "🔐",
    schemaDescription:
      "Generate secure passwords with custom length and symbol options in the browser.",
    metaTitle: "Free Strong Password Generator",
    metaDescription:
      "Generate secure passwords locally. Control length, uppercase, numbers, and symbols — copy in one click.",
    howToUseParagraphs: [
      paragraph(
        "The Password Generator helps developers and marketers produce strong credentials for staging sites, service accounts, and shared tools. ",
        "Adjust the length slider, toggle character classes, and press generate to create a new random string using browser cryptography where available. ",
        "Copy the result into your password manager rather than storing it in chat logs.",
      ),
      paragraph(
        "Favour at least sixteen characters for sensitive systems, mixing uppercase, lowercase, digits, and symbols when the platform allows. ",
        "If a legacy application forbids certain characters, disable symbols to avoid lockouts. ",
        "Regenerate until you meet complexity policies, then rotate passwords on a schedule defined by your security team.",
      ),
      paragraph(
        "This utility complements SEO and content operations when you provision API keys dashboards or CMS invites. ",
        "Never reuse passwords across sites; unique secrets limit blast radius if one vendor leaks data. ",
        "Review our Terms for acceptable use and keep generated secrets confidential.",
      ),
    ],
    faqs: [
      {
        question: "Are passwords sent to your servers?",
        answer:
          "No. Generation uses client-side logic in your browser session.",
      },
      {
        question: "Is this suitable for banking passwords?",
        answer:
          "Use your bank’s official recommendations and hardware tokens where required; this tool is a general-purpose helper.",
      },
      {
        question: "Can I exclude ambiguous characters?",
        answer:
          "Toggle symbol sets as needed and regenerate until the output matches your policy.",
      },
      {
        question: "What length should I pick?",
        answer:
          "Sixteen or more characters is a practical baseline for modern web services.",
      },
      {
        question: "Do you store generated values?",
        answer:
          "No. Refreshing or closing the page clears the textarea unless you copy it elsewhere.",
      },
    ],
    relatedSlugs: ["case-converter", "word-counter", "image-compressor"],
  },
];

export const TOOL_BY_SLUG: Record<string, ToolDefinition> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);

export function getRelatedTools(slugs: string[]): ToolDefinition[] {
  return slugs
    .map((s) => TOOL_BY_SLUG[s])
    .filter((t): t is ToolDefinition => Boolean(t));
}
