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
      "Meta Title Checker — Preview Your Title in Google Search Results | ToTheWebPro",
    metaDescription:
      "Write meta titles that work. Get a real-time pixel-width simulation that mirrors how Google renders titles in the SERP — catch truncation before your client does.",
    howToUseParagraphs: [
      paragraph(
        "A meta title is the first piece of copy your potential visitor reads in the SERP. ",
        "If it truncates at 'The Complete Guide to Optim...' you've already lost the click. ",
        "This tool simulates how Google renders your title tag down to the pixel-width, ",
        "so you can catch truncation before it hurts your click-through rate.",
      ),
      paragraph(
        "Choose your input mode: in manual mode, paste the title and description you plan to publish. ",
        "In URL mode, enter a public page address and click Fetch — the tool retrieves the HTML, ",
        "parses the title and description tags, and fills the fields for you. ",
        "URL fetching runs server-side to avoid browser CORS limits.",
      ),
      paragraph(
        "Watch the live SERP preview while you edit. Toggle desktop and mobile to compare layouts. ",
        "Google's display limit is approximately 600px — the pixel counter shows exactly where you stand. ",
        "Scores out of 100 summarise title and description length quality, ",
        "and the recommendation line explains whether to expand, trim, or keep your copy.",
      ),
      paragraph(
        "Use the copy buttons to move polished text into your CMS or spreadsheet. ",
        "Re-check after template changes, A/B tests, or internationalisation updates. ",
        "Pair this workflow with your canonical URL and on-page H1 to keep messaging consistent across surfaces.",
      ),
    ],
    faqs: [
      {
        question: "How long should a meta title be?",
        answer:
          "Google's SERP display limit is approximately 600px, which fits roughly 50–60 characters in most fonts. Because pixel width — not character count — determines truncation, use the pixel counter in this tool for an accurate read.",
      },
      {
        question: "Does Google rewrite meta titles?",
        answer:
          "Yes. Google may substitute alternatives from your on-page content, especially if your title is too long, keyword-stuffed, or mismatches the page content. This tool helps you present the strongest candidate title and reduce the chance of an unwanted rewrite.",
      },
      {
        question: "What happens if my title is too long for Google?",
        answer:
          "Google truncates it mid-sentence, often cutting off your brand name or key differentiator. The live preview shows exactly where the cut will happen so you can adjust before publishing.",
      },
      {
        question: "What is a meta title?",
        answer:
          "The meta title is the HTML title element and primary blue link text Google usually shows in search results. It should describe the page accurately and include the main keyword near the front.",
      },
      {
        question: "Will Google always show my description?",
        answer:
          "No. Google may substitute alternatives from on-page content. This tool helps you present the best candidate snippet and spot truncation risk before it reaches the SERP.",
      },
      {
        question: "Can I use this for localised pages?",
        answer:
          "Yes. Check each language variant separately and align titles with hreflang and local keyword intent for UK, US, and other markets.",
      },
    ],
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
    metaTitle: "Word Counter — Count Words, Characters, and Reading Time | ToTheWebPro",
    metaDescription:
      "Count words, characters, sentences, and reading time instantly. Built for SEO page targets, content briefs, and copy QA — free, private, no account needed.",
    howToUseParagraphs: [
      paragraph(
        "Every piece of content you publish has a performance context — SEO page targets, ",
        "social character limits, meta descriptions, email subject lines. ",
        "Paste content from your CMS, Google Docs, or email to see word count, character count, ",
        "reading time, and sentence density update in real time.",
      ),
      paragraph(
        "Below the editor you will see cards for words, characters with and without spaces, ",
        "sentences, paragraphs, and line breaks. ",
        "Reading time assumes roughly 200 words per minute; speaking time assumes 130 — useful for scripts and webinars. ",
        "The top words table filters stop words so you can spot accidental repetition or gaps in topical coverage.",
      ),
      paragraph(
        "Pair this tool with your editorial guidelines: set minimum depth for pillar pages, ",
        "cap intro length for news posts, or check character counts against social platform limits. ",
        "Everything runs in your session without server-side storage — client copy stays under your control.",
      ),
    ],
    faqs: [
      {
        question: "How many words should a blog post be for SEO?",
        answer:
          "There is no universal target. Content length should match search intent — some queries need concise 300-word answers, others reward comprehensive 2,000-word guides. Focus on topical coverage and depth rather than hitting an arbitrary word count.",
      },
      {
        question: "What is the character limit for a meta description?",
        answer:
          "A practical target is 120–160 characters on desktop. Mobile snippets are narrower, so shorter often performs better. Google may rewrite descriptions regardless, but a strong default improves relevance signals.",
      },
      {
        question: "Does word count affect Google rankings?",
        answer:
          "Not directly. Word count correlates with ranking on competitive queries because longer content tends to cover more sub-topics. The underlying driver is topical depth and information quality, not character volume.",
      },
      {
        question: "How accurate is reading time?",
        answer:
          "It is an estimate based on average adult reading speed of around 200 words per minute. Dense technical content may read slower; skim-friendly list posts may read faster.",
      },
      {
        question: "Does this check grammar or spelling?",
        answer:
          "No. The tool focuses on quantitative statistics. Use a dedicated grammar checker alongside this counter for copy quality review.",
      },
    ],
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
    metaTitle: "Free Case Converter Online | ToTheWebPro",
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
    metaTitle: "Free Image Compressor — Reduce File Size Without Losing Quality | ToTheWebPro",
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
    metaTitle: "Free Image Resizer Online | ToTheWebPro",
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
      "Convert between PNG, JPEG, and WebP locally with instant download.",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    icon: "🔄",
    schemaDescription:
      "Convert images across web formats using local canvas processing.",
    metaTitle: "Free PNG, JPG & WebP Converter | ToTheWebPro",
    metaDescription:
      "Convert images between PNG, JPG, and WebP in your browser. Fast, private, no uploads.",
    howToUseParagraphs: [
      paragraph(
        "The Image Converter helps teams standardise formats before upload. ",
        "Photography-heavy pages may prefer WebP for efficiency, while illustrations with transparency often remain PNG. ",
        "JPEG remains ubiquitous for photographic thumbnails when transparency is unnecessary.",
      ),
      paragraph(
        "Upload a file, choose the output format, and adjust JPEG quality when applicable. ",
        "Preview the converted output and download immediately—processing stays on-device for confidentiality. ",
        "Pair with the compressor when you need both format migration and byte savings.",
      ),
      paragraph(
        "Use this in SEO workflows when migrating CMS templates or cleaning legacy asset folders. ",
        "Consistent formats simplify caching rules and reduce transformation overhead at the edge. ",
        "Always validate colour accuracy for brand-critical artwork after conversion.",
      ),
    ],
    faqs: [
      {
        question: "Does conversion remove transparency?",
        answer:
          "JPEG does not support transparency; transparent areas may flatten to a background colour—preview carefully.",
      },
      {
        question: "Are files uploaded?",
        answer:
          "No. Canvas reads the file locally in your browser only.",
      },
      {
        question: "What is the best format for photos?",
        answer:
          "WebP or JPEG typically offers smaller sizes than PNG for photographic content.",
      },
      {
        question: "Can I batch convert?",
        answer:
          "This Phase 1 tool focuses on single files; run multiple conversions or pair with future batch utilities.",
      },
      {
        question: "Will colour profiles be preserved?",
        answer:
          "Browser canvas may normalise colours; compare against originals for critical design work.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-resizer", "word-counter"],
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    shortDescription:
      "Measure characters with and without spaces plus byte-style estimates for limits.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "🔢",
    schemaDescription:
      "Character counter for social limits, meta fields, and UX copy.",
    metaTitle: "Free Character Counter Online | ToTheWebPro",
    metaDescription:
      "Count characters with and without spaces, lines, and paragraphs. Perfect for tweets, titles, and ads.",
    howToUseParagraphs: [
      paragraph(
        "The Character Counter supports teams working against hard limits—social posts, paid search lines, SMS, and UI microcopy. ",
        "Paste your string to see counts update instantly, including characters excluding spaces for platforms that ignore whitespace. ",
        "Line and paragraph totals help when migrating content from spreadsheets or markdown.",
      ),
      paragraph(
        "Combine with the Meta Title & Description Checker when you tune SERP snippets: align character totals with the live preview. ",
        "For accessibility, shorter sentences often help comprehension even when limits allow more characters. ",
        "Everything processes locally, so drafts remain private while you iterate.",
      ),
      paragraph(
        "Document your house limits for writers: for example maximum button labels, notification text, or hero subheads. ",
        "Recount after localisation because translated strings frequently expand. ",
        "Export final copy to your CMS once counts meet governance rules.",
      ),
    ],
    faqs: [
      {
        question: "Does this count emojis as one character?",
        answer:
          "JavaScript string length may count some emoji sequences as multiple code units—verify on the target platform.",
      },
      {
        question: "Can I count selected fields only?",
        answer:
          "Paste exactly the text you need; the stats always reflect the textarea content.",
      },
      {
        question: "Is there a server upload?",
        answer:
          "No. Counting happens entirely in your browser.",
      },
      {
        question: "How is this different from the Word Counter?",
        answer:
          "This tool emphasises character-centric metrics and quick limits, while the Word Counter adds reading time and keyword tables.",
      },
      {
        question: "Can I count multi-language text?",
        answer:
          "Yes. Paste any Unicode text; counts reflect the string you provide.",
      },
    ],
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
    metaTitle: "Free Strong Password Generator | ToTheWebPro",
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
