import type { ToolDefinition } from "./types";

const paragraph = (...parts: string[]) => parts.join(" ");

export const TOOLS: ToolDefinition[] = [
  {
    slug: "meta-title-description-checker",
    name: "Meta Title & Description Checker",
    shortDescription:
      "Paste a URL or raw HTML and get a pixel-accurate SERP preview with character counts, truncation risk flags, and Open Graph completeness checks for your title, description, and social tags.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "🔎",
    schemaDescription:
      "Free meta tag checker with pixel-width simulation for title and description truncation, Open Graph and Twitter Card audit, canonical tag detection, and robots directive display. 100% client-side, no data transmitted.",
    metaTitle:
      "Free Meta Tag Checker: Pixel-Accurate SERP Preview & Open Graph Audit",
    metaDescription:
      "Audit your title tag, meta description, canonical, Open Graph, and Twitter Card tags in one pass. Pixel-accurate truncation preview, color-coded status flags, and zero server contact. Free, instant, no account needed.",
    howToUseParagraphs: [
      paragraph(
        "Choose between URL input and HTML source input at the top of the tool. ",
        "For live production pages, paste the full URL including https:// and click Check Meta Tags. ",
        "For staging builds or local drafts, copy the entire head block from your source and paste it directly into the HTML field.",
      ),
      paragraph(
        "The results panel shows each meta tag in its own card with the extracted value, character count, estimated rendered pixel width, and a color-coded status flag. ",
        "Green means optimal, amber means borderline, and red means the tag is missing or over the limit. ",
        "Google truncates title tags at approximately 600 rendered pixels, not a fixed character count, so pixel-width simulation is more reliable than a plain character counter alone.",
      ),
      paragraph(
        "The tool also audits Open Graph and Twitter Card completeness. ",
        "A page missing og:image renders as a blank preview card on LinkedIn and Facebook, directly suppressing share-driven traffic. ",
        "All seven core OG properties and all four core Twitter Card properties are checked in a single pass.",
      ),
      paragraph(
        "Edit your title or description, re-paste the updated HTML, and re-run the check. ",
        "Everything processes client-side so iteration is instant with no rate limits, no crawl queues, and no cooldown periods. ",
        "Treat it as a live scratchpad and re-check until every tag shows green.",
      ),
    ],
    faqs: [
      {
        question: "What is the ideal length for a title tag in 2025?",
        answer:
          "Google truncates title tags at approximately 600 rendered pixels on desktop SERPs, not at a fixed character count. In practical terms this corresponds to roughly 50 to 60 characters for mixed-case Latin text. Because pixel width depends on the specific characters used, the only reliable way to check is with a pixel-width simulation tool paired with a character count.",
      },
      {
        question: "Does Google always use my meta description in search results?",
        answer:
          "No. Research consistently shows Google rewrites or ignores authored meta descriptions in the majority of cases, pulling alternative text from the page body that better matches the search query. Despite this, writing a well-crafted meta description remains best practice: when Google does display it, it directly influences click-through rate and signals topical relevance to search quality evaluators.",
      },
      {
        question: "What happens if my page has no meta description tag?",
        answer:
          "Google auto-generates a snippet from the visible page body content, typically selecting text that appears most relevant to the specific query triggering the impression. This auto-generated snippet is often less compelling than a crafted description and may vary unpredictably across different queries. Missing meta descriptions are a controllable CTR risk and should be treated as a priority fix on any high-traffic page.",
      },
      {
        question: "What is a canonical tag and why does it matter for SEO?",
        answer:
          "A canonical tag tells search engines which URL is the preferred, authoritative version of a page when multiple URLs serve similar or identical content. Without it, or with an incorrect value, crawl budget is wasted, link equity is diluted across duplicate URLs, and ranking signals are split rather than consolidated. Self-referencing canonicals on unique pages are considered a confirmed best practice by Google.",
      },
      {
        question: "Is this meta tag checker completely free?",
        answer:
          "Yes. The Meta Tag Checker is free with no usage limits, no account requirement, and no premium tier. Because the tool runs entirely in your browser with no server processing, there is no infrastructure cost per check, and that saving is passed directly to the user as unlimited free access.",
      },
    ],
    relatedSlugs: ["word-counter", "character-counter", "case-converter"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription:
      "Paste your text and get a live analytics snapshot: word count, character count, reading time, speaking time, and keyword density. All updates on every keystroke, all private in your browser.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "📝",
    schemaDescription:
      "Free live word counter with real-time word, character, sentence, and paragraph counts, reading time, speaking time, and keyword frequency table. 100% client-side, no data sent to any server.",
    metaTitle:
      "Free Word Counter Online: Live Word, Character & Reading Time Analyzer",
    metaDescription:
      "Count words, characters, sentences, reading time, and keyword density in real time. Built for content writers, SEO professionals, and developers. Free, private, no account needed.",
    howToUseParagraphs: [
      paragraph(
        "Paste any volume of text directly into the input area — from a single tweet to a 10,000-word whitepaper. ",
        "Every metric updates on each keystroke with no page reload and no submit button. ",
        "Word count, character count, reading time, and keyword density are all visible simultaneously in the analytics dashboard.",
      ),
      paragraph(
        "The keyword frequency panel below the main metrics strips common stop words (a, the, and, of) before ranking your terms. ",
        "This gives you a semantically accurate density signal rather than a raw frequency table cluttered with function words. ",
        "If your target keyword appears at 0.4% density in a 1,200-word article, you have a concrete, actionable signal to add a few more natural mentions.",
      ),
      paragraph(
        "Reading time is estimated at 238 words per minute — the median adult silent reading speed from a 2019 Brysbaert meta-analysis covering 17,887 participants. ",
        "Speaking time uses 130 WPM for conversational speech. ",
        "Use the speaking time estimate when writing podcast scripts or presentation notes where duration calibration matters.",
      ),
      paragraph(
        "Click Reset to clear the input and restart your analysis from zero. ",
        "All processing runs entirely in your browser — no text is transmitted to any server, no session data is logged, and your content is invisible outside your own browser tab. ",
        "Works offline after the page loads.",
      ),
    ],
    faqs: [
      {
        question: "What is the most accurate online word counter?",
        answer:
          "The most accurate word counters use regex-based tokenization rather than simple whitespace splitting. Accurate tools handle hyphenated compound words, punctuation boundaries, and multi-script text correctly. They also provide character counts in both variants (with and without spaces), as these serve different use cases. ToTheWebPro's word counter uses Unicode-aware boundary detection to count words correctly regardless of text complexity.",
      },
      {
        question: "How is reading time calculated?",
        answer:
          "Reading time is calculated by dividing the total word count by 238 words per minute — the median adult silent reading speed from a 2019 meta-analysis by Brysbaert covering 17,887 participants across 190 studies. A 1,000-word article has an estimated reading time of approximately 4 minutes and 12 seconds. Speaking time uses 130 WPM for average conversational speech pace.",
      },
      {
        question: "Does character count include spaces?",
        answer:
          "The tool shows both variants. Character count with spaces counts every character including whitespace, matching the behavior of string.length in JavaScript and most platform character limit validators. Character count without spaces strips all whitespace before counting and is used for linguistic analysis and certain academic submission requirements. Always confirm which variant the target platform uses before relying on either figure.",
      },
      {
        question: "What is a good keyword density percentage for SEO?",
        answer:
          "There is no universally mandated keyword density percentage. Google has explicitly stated it does not use keyword density as a direct ranking factor. Practical content analysis suggests a primary keyword appearing at 1% to 2% of total content words achieves natural-sounding placement without over-optimization signals. Density below 0.5% in a 1,500-word article often suggests the topic is underdeveloped; density above 3% frequently indicates forced repetition that degrades readability.",
      },
      {
        question: "Is this word counter completely free with no word limit?",
        answer:
          "Yes. ToTheWebPro's Word Counter is entirely free with no word count cap, no session limit, and no registration requirement. Because the tool runs entirely in your browser with no server-side processing, there is no compute cost per analysis and therefore no basis for a usage limit. The tool has been tested on inputs exceeding 50,000 words without performance degradation on modern hardware.",
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
      "Paste your text, pick your case, and copy it clean to clipboard in one click. Eight casing transformations including camelCase, snake_case, Title Case, and more; all running privately in your browser.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "🔠",
    schemaDescription:
      "Free online case converter and string manipulator with eight transformations: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case. Runs entirely client-side with no server logging.",
    metaTitle:
      "Free Online Case Converter: Smart Text Case & String Manipulator",
    metaDescription:
      "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more in one click. 100% client-side, no data sent to any server. Free, instant, and private.",
    howToUseParagraphs: [
      paragraph(
        "Paste your text into the input area and pick any of the eight case transformation buttons below it. ",
        "The result appears instantly in the output panel. Click Copy to Clipboard and the transformed string is ready to paste wherever you need it: your IDE, CMS, spreadsheet, or email client. ",
        "No registration, no settings panel, no file to download.",
      ),
      paragraph(
        "The input area accepts any volume of text: a single variable name, a 500-row CSV header row, a multi-paragraph article, or a block of mixed-case code comments. ",
        "Line breaks, tab indentation, and multi-paragraph spacing are all preserved exactly as entered. ",
        "The tool transforms character case only — your document structure exits intact.",
      ),
      paragraph(
        "For developers, the code-safe casing engine handles mixed input formats automatically. ",
        "Whether your input is space-delimited natural language, an existing camelCase string, a hyphenated slug, or an underscore-delimited variable, ",
        "the engine normalises all four formats to a canonical word array before applying the target schema. ",
        "This means converting user_first_name to userFirstName or UserFirstName produces the correct output regardless of source format.",
      ),
      paragraph(
        "To run a second transformation on the same input, click a different case button without re-pasting. ",
        "Each transformation is non-destructive and the input stays unchanged. ",
        "Click Clear to wipe both panels and start fresh. ",
        "Every transformation runs 100% client-side in your browser: your strings, variable names, API payloads, and editorial copy never leave your machine and are never logged on any server.",
      ),
    ],
    faqs: [
      {
        question: "What is the difference between camelCase and PascalCase?",
        answer:
          "Both camelCase and PascalCase strip spaces and capitalize the first letter of each subsequent word. The single difference is the first word: camelCase lowercases it entirely (userProfileCard), while PascalCase capitalizes it (UserProfileCard). camelCase is the convention for JavaScript variables, JSON keys, and React props. PascalCase is the convention for class names, React components, and TypeScript interfaces.",
      },
      {
        question: "How do I convert text to title case online?",
        answer:
          "Paste your text and click the Title Case button. A correctly implemented title case engine capitalizes the first letter of each major word while lowercasing articles (a, an, the), short prepositions (at, by, in, of, on, to), and coordinating conjunctions (and, but, or, nor) unless they appear as the first or last word. This matches AP Style and Chicago Manual of Style conventions.",
      },
      {
        question: "What is sentence case and when should I use it?",
        answer:
          "Sentence case capitalizes only the first character of the first word in each sentence, plus proper nouns, treating the rest as lowercase. Use it for body copy, product descriptions, UI button labels, meta descriptions, and email subject lines. Google Material Design and Apple Human Interface Guidelines both specify sentence case as the default for interface labels and CTAs.",
      },
      {
        question: "Can I use this tool to convert variable names between coding conventions?",
        answer:
          "Yes. The tool accepts variable names already written in any casing convention including existing camelCase, PascalCase, snake_case, or kebab-case strings and correctly converts them to any other convention. For example, user_first_name converts correctly to userFirstName or UserFirstName because the engine normalises all input to a canonical word array before applying the target schema.",
      },
      {
        question: "Does the case converter work on multi-line text and code blocks?",
        answer:
          "Yes. The converter processes multi-line input by splitting on line boundaries, applying the transformation to each line independently, and then rejoining with the original delimiters. Paragraph breaks, blank lines, bullet list indentation, and code block structure are fully preserved through every transformation.",
      },
    ],
    relatedSlugs: ["word-counter", "character-counter", "password-generator"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortDescription:
      "Reduce JPG, PNG, WebP, and GIF file size in your browser, lossless or lossy, with a quality slider and ZIP download.",
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
      "Resize images by exact pixel width or percentage scale, with aspect ratio lock, social media presets, and instant download. All processing stays in your browser.",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    icon: "📐",
    schemaDescription:
      "Free batch image resizer supporting exact pixel width, percentage scaling, and aspect ratio lock. Supports JPEG, PNG, WebP, and GIF. 100% client-side via Canvas API, no server upload.",
    metaTitle:
      "Free Image Resizer Online: Resize Images by Pixels or Percentage",
    metaDescription:
      "Resize JPEG, PNG, WebP, and GIF images in your browser by exact pixel width or percentage scale. Aspect ratio lock, social media presets, batch ZIP export. No upload, no account, no watermarks.",
    howToUseParagraphs: [
      paragraph(
        "Drop one or more image files onto the upload area or click to browse. ",
        "Accepted formats are JPEG, PNG, WebP, and GIF. ",
        "The tool immediately reads each file's intrinsic pixel dimensions and shows them alongside a live preview thumbnail.",
      ),
      paragraph(
        "Choose your resize mode: Exact Pixel Width or Percentage Scale. ",
        "In pixel width mode, type your target width and the height auto-populates based on the locked aspect ratio. ",
        "In percentage mode, enter a value like 75 to scale down to 75% of the original, or 200 to double the size. ",
        "The aspect ratio lock is on by default — toggle it off only when you intentionally need to set both dimensions independently.",
      ),
      paragraph(
        "Click Resize Image to process. ",
        "The browser transforms the image locally using the Canvas API with no server upload. ",
        "Download the resized file immediately, or for batch jobs, download all outputs as a ZIP archive. ",
        "Your original files remain unchanged in the queue for re-processing at different settings.",
      ),
      paragraph(
        "A key point on display resolution: a 2x retina display renders images at twice the hardware pixel density. ",
        "If your layout container is 600px wide, you need a 1200px source image to avoid blurry rendering on high-DPI screens. ",
        "Use exact pixel mode to hit these targets precisely. ",
        "Google PageSpeed Insights flags images as properly sized only when served dimensions are within 4KB of the rendered size.",
      ),
    ],
    faqs: [
      {
        question: "Does resizing an image online reduce its quality?",
        answer:
          "Downscaling (reducing dimensions) typically has minimal visible quality loss when done correctly. Upscaling beyond the original resolution introduces pixelation because the tool must interpolate pixel data that does not exist in the source. For best results, always resize down from a high-resolution source rather than up from a low-resolution one.",
      },
      {
        question: "What is the difference between resizing and cropping?",
        answer:
          "Resizing changes the total pixel dimensions while keeping all image content visible. Cropping removes a portion of the image to change its dimensions and aspect ratio, discarding content outside the crop boundary. Both operations can change an image's final pixel dimensions but through fundamentally different mechanisms.",
      },
      {
        question: "How do I resize an image without distorting it?",
        answer:
          "Enable the aspect ratio lock before entering your target dimensions. When locked, changing the width automatically recalculates the height to maintain the original proportional relationship between both axes. This prevents horizontal or vertical stretching.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "The tool accepts JPEG, PNG, WebP, and GIF as input. Output is available as JPEG or PNG. For web delivery, PNG is recommended for images requiring transparency; JPEG is more efficient for photographs.",
      },
      {
        question: "Is it safe to resize confidential images using an online tool?",
        answer:
          "Yes, because ToTheWebPro's resizer processes all images exclusively within your browser's memory using the HTML5 Canvas API. No data is sent to any external server. Your files are never uploaded, logged, or accessible to anyone other than you during your active browser session.",
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
    metaTitle: "Image Converter: Convert Between WebP, PNG, JPG, and More",
    metaDescription:
      "Convert images between WebP, PNG, and JPG directly in your browser. No plugins, no cloud queues, no account required. Instant download.",
    howToUseParagraphs: [
      paragraph(
        "Format compatibility problems cost time. You have a PNG that needs to be WebP ",
        "for your site's performance budget, or a WebP that needs to be JPG for a client's CMS ",
        "that still doesn't support modern formats. ",
        "This tool converts between the most common web image formats directly in your browser (no plugins, no cloud queues, no waiting).",
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
      "Type or paste your text and get live character counts with real-time threshold warnings for Twitter/X, LinkedIn, Instagram, and SMS (all running privately in your browser).",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "🔢",
    schemaDescription:
      "Free live character counter with real-time platform threshold indicators for Twitter/X, LinkedIn, Instagram, Facebook, and SMS. Shows characters with spaces, without spaces, word count, and UTF-8 byte count. 100% client-side.",
    metaTitle:
      "Free Character Counter Online: Live Twitter/X, SMS & Social Media Limit Tracker",
    metaDescription:
      "Count characters in real time with threshold warnings for Twitter/X (280), LinkedIn (3,000), Instagram (2,200), and SMS. Shows characters with and without spaces, word count, and byte count. Free and private.",
    howToUseParagraphs: [
      paragraph(
        "Paste your text into the input area and the metrics dashboard updates on every keystroke. ",
        "Total character count with spaces, character count without spaces, word count, and UTF-8 byte count are all displayed simultaneously with sub-10ms latency. ",
        "No submit button, no page reload, no wait state.",
      ),
      paragraph(
        "A row of platform indicator bars tracks your character count against the published limit for each platform. ",
        "Each bar shows your current count versus the limit (for example, 247 of 280 for Twitter/X) and changes color as you approach the threshold: green under 80%, amber between 80% and 99%, red at or over the limit. ",
        "Platform limits covered include Twitter/X (280), LinkedIn Post (3,000), LinkedIn Headline (220), Instagram (2,200), and SMS.",
      ),
      paragraph(
        "For SMS copy, the tool automatically detects when your text contains any character outside the GSM-7 alphabet — including curly apostrophes, em dashes, accented characters, or emoji. ",
        "When this happens, the SMS indicator switches from GSM-7 mode (160 characters per segment) to UCS-2 mode (70 characters per segment) and recalculates your segment count. ",
        "A visible encoding mode flag makes the switch impossible to miss.",
      ),
      paragraph(
        "When your copy is within all target limits, click Copy to Clipboard to copy the full text in one click. ",
        "All processing runs entirely in your browser — no text is transmitted to any server, nothing is logged, and your message drafts stay in your browser tab and nowhere else.",
      ),
    ],
    faqs: [
      {
        question: "How do I count characters online accurately?",
        answer:
          "Paste your text into a live character counter. Accurate counters provide two figures: character count with spaces (matching most platform validators) and character count without spaces (used for linguistic analysis and some CMS field validators). For social media copy, the tool must also apply the correct encoding model for the target platform. Twitter/X counts emoji as two characters using Unicode surrogate pair detection, not the standard string.length value.",
      },
      {
        question: "How many characters are allowed in a tweet on Twitter/X?",
        answer:
          "Twitter/X allows 280 characters per tweet for standard accounts. Characters outside the Basic Multilingual Plane (including most emoji) are counted as two characters each. URLs in tweets are always shortened to a t.co link of exactly 23 characters, regardless of the original URL length, and that count is deducted from your 280-character budget.",
      },
      {
        question: "Why does adding one emoji change my SMS from 1 segment to 3?",
        answer:
          "SMS messages default to GSM-7 encoding, which supports 160 characters per single segment. Emoji are not part of the GSM-7 character set; adding any emoji forces the entire message to UCS-2 encoding, which reduces the single-segment limit to 70 characters. If your message was 155 characters before adding the emoji, it now requires three UCS-2 segments (67 plus 67 plus 21 characters), each billed as a separate SMS. Curly apostrophes and em dashes trigger the same encoding switch.",
      },
      {
        question: "What is the character limit for a LinkedIn post?",
        answer:
          "LinkedIn posts have a hard character limit of 3,000 characters. However, the practical visibility threshold is approximately 210 characters — LinkedIn's feed UI truncates post body text at this point and adds a See more link. For maximum engagement, the first 210 characters must work as a self-contained hook. LinkedIn headlines have a separate limit of 220 characters and connection request notes are capped at 300 characters.",
      },
      {
        question: "What is the difference between character count and byte count?",
        answer:
          "Character count measures the number of individual characters in a string regardless of storage size. Byte count measures the actual storage size in a specific encoding. In ASCII text, one character equals one byte. In UTF-8, basic Latin characters occupy 1 byte each, accented characters occupy 2 bytes, most non-Latin scripts occupy 3 bytes, and emoji occupy 4 bytes. For database field constraints, API payload limits, and SMS billing, byte count is the operationally relevant figure.",
      },
    ],
    relatedSlugs: ["word-counter", "case-converter", "meta-title-description-checker"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription:
      "Generate cryptographically strong passwords using your browser's native CSPRNG. Control length, character classes, and entropy score. Nothing is sent to any server.",
    category: "developer",
    categoryLabel: "Developer Tools",
    categoryPath: "/developer-tools",
    icon: "🔐",
    schemaDescription:
      "Free secure password generator powered by window.crypto.getRandomValues(). Control length, character classes, and custom exclusions. Shows real-time entropy score. 100% client-side, zero server contact.",
    metaTitle:
      "Free Secure Password Generator Online: Cryptographic Entropy & Zero Data Exposure",
    metaDescription:
      "Generate strong, cryptographically secure passwords in your browser. Control length, character classes, and see a real-time entropy score. No data is ever sent to any server. Free and instant.",
    howToUseParagraphs: [
      paragraph(
        "Use the length slider or input field to set your required character count. ",
        "For general account passwords, 16 characters is a safe starting point. ",
        "For API keys, SSH secrets, or database credentials, aim for 32 to 64 characters. ",
        "The entropy score updates in real time as you adjust the slider.",
      ),
      paragraph(
        "Toggle uppercase letters, lowercase letters, digits, and special characters on or off using the checkbox panel. ",
        "If a legacy system prohibits certain symbols, remove them from the pool before generating. ",
        "The tool recalculates the available character pool and entropy estimate immediately so you can see the exact security impact of any restriction.",
      ),
      paragraph(
        "Click Generate Password to produce a result. ",
        "Each click fires a fresh call to window.crypto.getRandomValues(), which draws entropy from your operating system's kernel-level randomness pool — the same source used in TLS handshakes. ",
        "Every result is statistically independent from the previous one. Regenerate as many times as needed at no cost.",
      ),
      paragraph(
        "Copy the generated password immediately and paste it into your password manager. ",
        "Avoid storing it in a plain-text file or an unencrypted note. ",
        "The value exists only in your browser's working memory for the duration of your session — nothing is transmitted to any server and nothing is retained after you close the tab.",
      ),
    ],
    faqs: [
      {
        question: "Is a browser-based password generator actually secure?",
        answer:
          "Yes, provided it uses window.crypto.getRandomValues() rather than Math.random(). The Web Cryptography API is a W3C standard backed by your operating system's kernel-level entropy pool, making it cryptographically indistinguishable from hardware random number generators for practical purposes. ToTheWebPro uses only this CSPRNG path and makes zero network requests during generation.",
      },
      {
        question: "How many bits of entropy do I need for a strong password?",
        answer:
          "NIST SP 800-63B recommends at least 112 bits for high-value accounts. A randomly generated 20-character password using all four character classes produces approximately 131 bits — well above that threshold. For critical infrastructure credentials such as SSH keys or root accounts, target 160 bits or more.",
      },
      {
        question: "Can this tool generate passwords that work with systems that have strict character rules?",
        answer:
          "Yes. Remove any specific characters from the character pool before generating. For example, if a legacy system rejects @ or backslash, remove them from the special character subset and the tool generates from the constrained pool while recalculating entropy so you can see the exact security cost of those restrictions.",
      },
      {
        question: "What length should I pick?",
        answer:
          "Sixteen or more characters is a practical baseline for modern web services. For API keys, database credentials, and any secret stored in an environment variable, use 32 characters or more. The entropy meter shows you the exact bit strength at each length so you can make an informed decision based on your specific risk context.",
      },
      {
        question: "Does Vercel or ToTheWebPro see my generated passwords?",
        answer:
          "No. Vercel serves the static HTML, CSS, and JavaScript files to your browser. Password generation happens entirely after that file delivery, inside your browser's JavaScript engine. Vercel's servers are never contacted during generation. There is no API endpoint, no serverless function, and no telemetry call triggered at generation time.",
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
