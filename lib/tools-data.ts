import type { ToolDefinition } from "./types";

const paragraph = (...parts: string[]) => parts.join(" ");

export const TOOLS: ToolDefinition[] = [
  {
    slug: "meta-title-description-checker",
    name: "Meta Title & Description Checker",
    shortDescription:
      "Fetch or paste titles and descriptions, see live SERP previews, scores, and character guidance.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "🔎",
    schemaDescription:
      "Free meta title and description checker with Google-style SERP preview, scoring, and URL fetch.",
    metaTitle:
      "Free Meta Title & Description Checker | ToTheWebPro",
    metaDescription:
      "Check your meta title and description for SEO. Live Google-style preview, character counts, scores, and URL fetch — free in your browser.",
    howToUseParagraphs: [
      paragraph(
        "The Meta Title & Description Checker helps you tune how your page appears in Google. ",
        "Strong titles and descriptions improve click-through rate, support your target keywords, and reduce unwanted rewrites in search results. ",
        "This tool is built for SEO executives, content strategists, and developers who need fast feedback without installing software.",
      ),
      paragraph(
        "Start by choosing your input mode. In manual mode, paste the title and meta description you plan to publish. ",
        "In URL mode, enter a public page address and select Fetch; our server retrieves the HTML, parses the title and description tags, and fills the fields for you. ",
        "URL fetching runs on the server to avoid browser CORS limits, and each successful fetch updates the address bar so you can bookmark or share the exact check.",
      ),
      paragraph(
        "Watch the live SERP preview while you edit. Toggle desktop and mobile to compare layouts: mobile snippets are narrower, so shorter lines often perform better. ",
        "Character counters use green, amber, and red states aligned with common SEO working ranges so you can spot issues instantly. ",
        "Scores out of 100 summarise title and description length quality, and the recommendation line explains whether to expand, trim, or keep your copy.",
      ),
      paragraph(
        "Use the copy buttons to move polished text into your CMS or spreadsheet. Pair this workflow with your canonical URL and on-page H1 to keep messaging consistent. ",
        "Re-check after template changes, A/B tests, or internationalisation updates. ",
        "ToTheWebPro keeps the interface minimal so you can iterate quickly and ship snippets that earn clicks in competitive UK and US SERPs.",
      ),
    ],
    faqs: [
      {
        question: "What is a meta title?",
        answer:
          "The meta title is the HTML title element and primary blue link text Google usually shows. It should describe the page accurately and include the main keyword near the front.",
      },
      {
        question: "How long should a meta description be?",
        answer:
          "A practical target is roughly 120–160 characters on desktop, with shorter lines often safer on mobile. Google may rewrite descriptions, but a strong default improves relevance signals.",
      },
      {
        question: "Why fetch meta tags from a URL?",
        answer:
          "Fetching saves time when auditing live pages, competitor snippets, or staging environments. It also reduces copy-paste errors when you validate production HTML.",
      },
      {
        question: "Will Google always show my title and description?",
        answer:
          "No. Google may substitute alternatives from on-page content. This tool helps you present the best candidate snippet and spot truncation risk early.",
      },
      {
        question: "Is my search data stored?",
        answer:
          "URL fetch requests are processed to return meta information only. Do not submit private URLs or credentials. Review our Privacy Policy for retention and cookies.",
      },
      {
        question: "Can I use this for localised pages?",
        answer:
          "Yes. Check each language variant separately and align titles with hreflang and local keyword intent for UK, US, and other English markets.",
      },
    ],
    relatedSlugs: ["word-counter", "character-counter", "case-converter"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription:
      "Count words, characters, sentences, and reading time with keyword-style frequency insights.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "📝",
    schemaDescription:
      "Free online word counter with reading time, speaking time, and top word frequency table.",
    metaTitle: "Free Word Counter & Reading Time | ToTheWebPro",
    metaDescription:
      "Count words, characters, sentences, paragraphs, and lines. See reading and speaking time plus top words — fast, free, private.",
    howToUseParagraphs: [
      paragraph(
        "The Word Counter gives editors and SEOs immediate statistics for drafts, briefs, and published articles. ",
        "Paste content from Google Docs, CMS fields, or email, or upload a plain text file to populate the editor. ",
        "Counts refresh in real time so you can trim fluff, hit brief targets, or verify deliverable length before hand-off.",
      ),
      paragraph(
        "Below the editor you will see cards for words, characters with and without spaces, sentences, paragraphs, and line breaks. ",
        "Reading time assumes roughly two hundred words per minute, while speaking time assumes about one hundred thirty words per minute—useful for scripts and webinars. ",
        "The top words table ignores common stop words so you can spot accidental repetition or missing topical coverage.",
      ),
      paragraph(
        "Pair this tool with your editorial guidelines: set minimum depth for pillar pages, cap intro length for news posts, or balance head terms with supporting phrases. ",
        "For SEO, compare word count against intent—some queries need concise answers, while others reward comprehensive guides. ",
        "Everything runs in your session without server-side text storage, keeping client copy under your control.",
      ),
    ],
    faqs: [
      {
        question: "How accurate is reading time?",
        answer:
          "It is an estimate based on average adult reading speed. Dense technical content may read slower; skim-friendly lists may read faster.",
      },
      {
        question: "Which file types are supported?",
        answer:
          "Upload .txt files for quick imports. Rich formats like PDF are not parsed here—paste extracted text instead.",
      },
      {
        question: "Why are some words excluded from frequency?",
        answer:
          "Stop words such as “the” and “and” are filtered so you can focus on meaningful terms and avoid noisy tables.",
      },
      {
        question: "Does this check grammar?",
        answer:
          "No. It focuses on quantitative stats. Use a dedicated grammar tool alongside this counter.",
      },
      {
        question: "Can I count selected text only?",
        answer:
          "Yes. Paste only the excerpt you need; the stats always reflect the full textarea contents.",
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
      "Shrink JPG, PNG, WebP, and GIF files in bulk with a quality slider and ZIP download.",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    icon: "🗜️",
    schemaDescription:
      "Browser-based image compression with previews, savings percentage, and ZIP export.",
    metaTitle: "Free Image Compressor (Client-Side) | ToTheWebPro",
    metaDescription:
      "Compress images locally in your browser. Batch up to twenty files, tune quality, preview savings, and download a ZIP.",
    howToUseParagraphs: [
      paragraph(
        "The Image Compressor reduces file weight for faster pages and better Core Web Vitals. ",
        "Large hero images and gallery assets often dominate LCP; shrinking them responsibly keeps detail while improving load times. ",
        "All compression uses your device CPU via modern browser APIs—files never upload to our servers, supporting GDPR-friendly workflows.",
      ),
      paragraph(
        "Drag up to twenty images into the drop zone or click to browse. Supported types include JPG, PNG, WebP, and GIF. ",
        "Adjust the quality slider between ten and one hundred percent; lower values save more bytes but may introduce artefacts. ",
        "Each row shows a thumbnail, original size, compressed size, and savings percentage with an individual download button.",
      ),
      paragraph(
        "Use Download All as ZIP when you need to hand assets to a developer or archive a batch. ",
        "Pair compression with responsive delivery in your CMS or CDN, and re-run checks after art direction changes. ",
        "The privacy badge reminds stakeholders that previews stay local, which helps when handling screenshots or pre-release creative.",
      ),
    ],
    faqs: [
      {
        question: "Do you upload my images?",
        answer:
          "No. Processing happens entirely in your browser; we never receive your files.",
      },
      {
        question: "Will transparency be preserved?",
        answer:
          "PNG and WebP transparency is respected where the format supports it. Some aggressive settings may flatten colours—preview before exporting.",
      },
      {
        question: "Why is GIF support limited for compression?",
        answer:
          "Animated GIFs are heavier; consider converting short clips to modern video formats for web when possible.",
      },
      {
        question: "What is a good quality setting?",
        answer:
          "Start around eighty percent for photos, then lower until artefacts appear. UI screenshots may tolerate higher values.",
      },
      {
        question: "Can I compress more than twenty files?",
        answer:
          "Process additional batches in a second pass to keep the interface responsive on typical devices.",
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
