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
    metaTitle: "Free Meta Title and Description Checker | Fix Length Instantly",
    metaDescription:
      "Paste your title & description, get instant character + pixel count, Google preview, and fixes. 100% free, no signup.",
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
    metaTitle: "Free Word Counter Online | Count Words & Characters Instantly",
    metaDescription:
      "Free online tool to count words, characters, sentences, and paragraphs for blogs, essays, SEO content, and social media writing.",
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
    metaTitle: "Free Case Converter Online | UPPER, lower, Title Case Tool",
    metaDescription:
      "Free online case converter tool to convert text to uppercase, lowercase, title case, and sentence case instantly with no signup required.",
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
    metaTitle: "Free Image Compressor Online | Reduce Image Size Without Quality Loss",
    metaDescription:
      "Free online tool to compress JPG, PNG, and WebP images. Reduce file size without losing quality for faster websites and SEO performance.",
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
    metaTitle: "Free Image Resizer Online | Resize Images to Any Dimension",
    metaDescription:
      "Free online image resizer to set custom width and height or maintain aspect ratio for web and social media optimization.",
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
    metaTitle: "Free Image Converter Online | Convert JPG, PNG, WebP & More",
    metaDescription:
      "Free online image converter to convert JPG, PNG, WebP, and other formats quickly without signing up.",
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
    metaTitle: "Free Character Counter Online | Count Letters and Spaces",
    metaDescription:
      "Free online character counter tool to instantly count characters, letters, spaces, and words for SEO and social media content.",
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
    metaTitle: "Free Strong Password Generator Online | Secure and Random",
    metaDescription:
      "Free online password generator to create strong, secure passwords with customizable length and characters for better account protection.",
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
  {
    slug: "text-to-html",
    name: "Text to HTML Converter",
    shortDescription:
      "Convert your formatted text into clean, semantic HTML instantly. Ideal for webmasters, developers, and content creators who need to export web-ready code without the mess.",
    category: "text",
    categoryLabel: "Text Tools",
    categoryPath: "/text-tools",
    icon: "📜",
    schemaDescription:
      "Free online text to HTML converter. Paste formatted text or write directly into the editor to generate clean, semantic HTML code. 100% client-side processing.",
    metaTitle: "Free Text to HTML Converter | Convert Text to HTML Online",
    metaDescription:
      "Easily convert formatted text into clean, semantic HTML code with our free online tool. Perfect for bloggers, developers, and SEO experts.",
    howToUseParagraphs: [
      paragraph(
        "Paste your formatted text directly into the visual editor or type from scratch. ",
        "The tool automatically identifies headings, lists, bold, and italic text, converting them into valid HTML tags in real-time. ",
        "Click the 'Show HTML' button to see the generated code instantly.",
      ),
      paragraph(
        "Our converter cleans up messy code often left behind by other word processors. ",
        "You get semantic tags like <h1>, <p>, <ul>, and <li> instead of inline styles or redundant <span> tags. ",
        "This is critical for SEO and accessibility compliance.",
      ),
      paragraph(
        "Once you are happy with the output, click Copy to Clipboard to grab the HTML code for your CMS, blog, or website. ",
        "Like all ToTheWebPro tools, your text stays 100% private in your browser.",
      ),
    ],
    faqs: [
      {
        question: "Does this tool produce clean HTML code?",
        answer:
          "Yes. Our engine is designed to strip away non-semantic formatting and produce clean, valid HTML tags. It focuses on structure (headings, lists, paragraphs) rather than complex layout styles, ensuring your code is lightweight and SEO-friendly.",
      },
      {
        question: "Can I paste text from Word or Google Docs?",
        answer:
          "Absolutely. Simply copy from your document and paste it into the editor. The tool will parse the formatting and translate it into the nearest HTML equivalent.",
      },
      {
        question: "Is there a limit on how much text I can convert?",
        answer:
          "No. Since the processing happens entirely on your machine, there is no technical limit to the length of the document you can convert. It remains fast even for long articles.",
      },
    ],
    relatedSlugs: ["word-counter", "case-converter", "character-counter"],
  },
  {
    slug: "background-remover",
    name: "AI Background Remover",
    shortDescription:
      "Remove image backgrounds automatically in seconds with a single click. Powered by on-device AI for maximum speed and privacy.",
    category: "image",
    categoryLabel: "Image Tools",
    categoryPath: "/image-tools",
    icon: "🎭",
    schemaDescription:
      "Free AI-powered background remover. Remove backgrounds from JPG, PNG, and WebP images instantly in your browser. Private, secure, and pro-quality results.",
    metaTitle: "Free AI Background Remover Online | Remove BG Instantly",
    metaDescription:
      "Remove backgrounds from any image for free with our AI background remover. High-quality results in seconds without uploading files to a server.",
    howToUseParagraphs: [
      paragraph(
        "Upload your image (JPEG, PNG, or WebP) by dragging it into the drop zone or clicking to browse. ",
        "For best results, use images with a clear subject (people, products, animals) and a relatively contrasting background.",
      ),
      paragraph(
        "The AI model runs directly in your browser. It analyzes the image and isolates the foreground subject from the background automatically. ",
        "You can see a live preview of the transparent result immediately.",
      ),
      paragraph(
        "Download your high-resolution PNG with a transparent background in one click. ",
        "Since the model runs on your device, your images never touch a server, ensuring 100% privacy for your creative work.",
      ),
    ],
    faqs: [
      {
        question: "How does the AI Background Remover work without a server?",
        answer:
          "We use modern machine learning models (like Segment Anything or MODNet) optimized for the web. These models run using WASM or WebGL in your browser, allowing your computer's own hardware to perform the heavy lifting locally.",
      },
      {
        question: "Which image formats work best for background removal?",
        answer:
          "JPG and PNG are standard and work perfectly. High-contrast images where the subject is sharp and the background is slightly blurred (bokeh) produce the cleanest professional results.",
      },
      {
        question: "Is this tool free for commercial use?",
        answer:
          "Yes. ToTheWebPro provides these tools for free for all users. You can use the processed images for your business, social media, or personal projects without any attribution or cost.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-resizer", "image-converter"],
  },
  {
    slug: "seo-checker",
    name: "Website SEO & Speed Checker",
    shortDescription:
      "Audit any URL for SEO health, meta tag accuracy, heading structure, image alt tags, HTTPS status & Google Lighthouse speed — all in one free report.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "⚡",
    schemaDescription:
      "Audit any URL for SEO health, meta tag accuracy, heading structure, image alt tags, HTTPS status & Google Lighthouse speed — all in one free report.",
    metaTitle: "Free Website SEO & Speed Checker — Full Site Audit",
    metaDescription:
      "Audit any URL for SEO health, meta tag accuracy, heading structure, image alt tags, HTTPS status & Google Lighthouse speed — all in one free report.",
    howToUseParagraphs: [
      paragraph(
        "Enter any website URL into the audit box and click 'Run Free SEO Audit'. ",
        "The tool fetches the page HTML and runs an automated check against Google PageSpeed Insights API in parallel.",
      ),
      paragraph(
        "Review your results across three core areas: PageSpeed (mobile & desktop Lighthouse metrics), Meta & SERP preview accuracy, and Technical/On-page checks.",
      ),
      paragraph(
        "Page speed and SEO health aren't separate conversations anymore. Core Web Vitals are a confirmed ranking factor, and a title tag that gets pixel-truncated in the SERP loses clicks even when it ranks well. This checker treats both as one audit.",
      ),
      paragraph(
        "Prioritize your fixes using the itemized action list, starting with any red-flagged critical issues.",
      ),
    ],
    whyItMatters: [
      "Core Web Vitals (LCP, FCP, CLS) directly influence ranking and are measured separately for mobile vs. desktop.",
      "Pixel width, not character count, determines whether a title shows fully in search results.",
      "Missing alt tags and broken heading hierarchy are two of the most common issues found even on well-ranked sites.",
      "HTTPS and canonical tag errors can quietly split ranking signals across duplicate URLs.",
    ],
    keyFeatures: [
      "Google Lighthouse integration for real performance data",
      "Pixel-accurate title & meta description preview",
      "Heading hierarchy audit (H1 through H6)",
      "Image alt tag & optimization check",
      "HTTPS and Schema.org detection — all from a single URL, no sign-up",
    ],
    faqs: [
      {
        question: "What's the difference between this and Google PageSpeed Insights?",
        answer:
          "This checker layers PageSpeed's Lighthouse data together with meta tag accuracy, heading structure, and on-page technical checks, producing a full SEO picture rather than just a performance score, from a single audit.",
      },
      {
        question: "Why does my title tag look fine in the CMS but get cut off in Google's results?",
        answer:
          "Google truncates titles by pixel width, not character count. Wide letters like W or M use more pixels than narrow ones like i or l, so two titles with identical character counts can display very differently.",
      },
      {
        question: "How often should a site audit be run?",
        answer:
          "Monthly is reasonable for most sites, but re-audit immediately after a redesign, CMS migration, or major content update — these are when technical issues most often get introduced.",
      },
      {
        question: "Does slow page speed actually hurt rankings, or just user experience?",
        answer:
          "Both. Core Web Vitals are part of Google's Page Experience signals, and slow load times also increase bounce rate, which indirectly affects rankings by signaling weaker engagement.",
      },
    ],
    relatedSlugs: ["meta-title-description-checker", "performance-audit", "heading-analyzer"],
  },
  {
    slug: "heading-analyzer",
    name: "Heading Tag Analyzer (H1-H6)",
    shortDescription:
      "Analyze your page's heading hierarchy instantly. Detect missing H1s, multiple H1 tags, skipped levels & empty headings with a visual outline tree.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "📋",
    schemaDescription:
      "Analyze your page's heading hierarchy instantly. Detect missing H1s, multiple H1 tags, skipped levels & empty headings with a visual outline tree.",
    metaTitle: "Heading Tag Analyzer — Check H1–H6 Structure Free",
    metaDescription:
      "Analyze your page's heading hierarchy instantly. Detect missing H1s, multiple H1 tags, skipped levels & empty headings with a visual outline tree.",
    howToUseParagraphs: [
      paragraph(
        "Choose URL Input to analyze a live page, or Paste Raw HTML to check a draft before publishing.",
      ),
      paragraph(
        "Click 'Analyze Headings' to scan the markup. ",
        "Heading tags do double duty: they're how screen readers navigate a page for accessibility, and they're one of the clearest signals search engines use to understand a page's topic structure.",
      ),
      paragraph(
        "Review the visual outline tree showing every heading in hierarchical order. ",
        "Detect missing H1 tags, multiple competing H1s, skipped heading levels (like H1 straight to H3), and empty headings.",
      ),
      paragraph(
        "Fix flagged issues in your content and re-check until your outline represents a clean, logical document structure.",
      ),
    ],
    whyItMatters: [
      "A single, clear H1 remains one of the strongest on-page relevance signals for both traditional search and AI answer engines.",
      "Skipped heading levels (H1 straight to H3) break the logical outline that search engines and screen readers rely on.",
      "Multiple H1 tags dilute topical focus and can confuse which heading is treated as primary.",
      "Clean heading structure directly supports Featured Snippet and 'People Also Ask' eligibility, since Google frequently pulls snippet answers from well-structured H2/H3 sections.",
    ],
    keyFeatures: [
      "Visual heading outline tree with hierarchical nesting",
      "Missing and multiple H1 detection",
      "Skipped heading-level warnings",
      "Empty heading detection",
      "Works on live URLs or raw HTML without signup",
    ],
    faqs: [
      {
        question: "Is it ever okay to have more than one H1 on a page?",
        answer:
          "HTML5 technically permits multiple H1s, but for SEO purposes a single, clear H1 per page remains the safer, more widely recommended practice — it keeps the topical focus unambiguous for search engines.",
      },
      {
        question: "What counts as a 'skipped' heading level?",
        answer:
          "Jumping from an H1 directly to an H3 with no H2 in between, or from H2 to H4, breaks the logical nesting that both screen readers and search engines rely on to understand content structure.",
      },
      {
        question: "Do heading tags need to contain the exact target keyword?",
        answer:
          "They should reflect the topic naturally. Keyword-stuffed headings read poorly and can look manipulative to users and search engines alike — a natural, descriptive heading that includes relevant terms performs better long-term.",
      },
      {
        question: "Why does heading structure matter for accessibility, not just SEO?",
        answer:
          "Screen reader users often navigate by jumping between headings rather than reading linearly. A broken or skipped hierarchy makes that navigation confusing or impossible — which is both an accessibility failure and a signal search engines pick up on.",
      },
    ],
    relatedSlugs: ["seo-checker", "meta-title-description-checker", "word-counter"],
  },
  {
    slug: "schema-validator",
    name: "Schema Markup Validator (JSON-LD)",
    shortDescription:
      "Validate JSON-LD, Microdata & Schema.org markup from any URL or code snippet. Catch syntax errors and missing properties before Google does.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "🔍",
    schemaDescription:
      "Validate JSON-LD, Microdata & Schema.org markup from any URL or code snippet. Catch syntax errors and missing properties before Google does.",
    metaTitle: "JSON-LD Schema Validator — Test Structured Data Free",
    metaDescription:
      "Validate JSON-LD, Microdata & Schema.org markup from any URL or code snippet. Catch syntax errors and missing properties before Google does.",
    howToUseParagraphs: [
      paragraph(
        "Choose 'Fetch Website URL Schemas' to pull markup directly from a live page, or 'Paste JSON-LD / HTML Code' to check a snippet before it goes live.",
      ),
      paragraph(
        "Click 'Validate Schema' to run the validation check. ",
        "Adding schema markup is only half the job. One typo or missing required property can cause the entire block to silently fail without changing how the page looks.",
      ),
      paragraph(
        "Review flagged errors — missing required properties, malformed syntax, incorrect types, and nested entity trees.",
      ),
      paragraph(
        "Fix and re-check until the schema passes Schema.org specifications cleanly.",
      ),
    ],
    whyItMatters: [
      "Search Console's rich result reports can lag by days or weeks; this catches errors instantly.",
      "Broken schema is invisible in the browser, so most site owners never know it's failing.",
      "Multiple schema types on one page can conflict with each other in ways that are hard to spot manually.",
      "Clean, valid markup is a prerequisite — not a bonus — for eligibility in rich snippets, AI Overviews, and knowledge panel citations.",
    ],
    keyFeatures: [
      "Two input modes: live URL extraction or raw code snippet validation",
      "Checks against official Schema.org specifications",
      "Flags missing required properties by schema type",
      "Supports both JSON-LD and Microdata",
      "Instant client-side verification with detailed visual status badges",
    ],
    faqs: [
      {
        question: "Why does my schema look fine but not show up in Google Search Console?",
        answer:
          "Search Console only reports schema it has successfully crawled and parsed. If a required property is missing or a value is malformed, Google may discard the whole block instead of showing a partial error — which is why manual validation catches issues GSC won't.",
      },
      {
        question: "What's the difference between this and Google's Rich Results Test?",
        answer:
          "This tool focuses specifically on schema validity — syntax, structure, and required properties — and lets code be checked before it's live, without needing a published URL.",
      },
      {
        question: "Can Microdata be validated as well as JSON-LD?",
        answer:
          "Yes — the validator reads Schema.org markup in both formats.",
      },
      {
        question: "How often should schema be re-validated?",
        answer:
          "Any time page content that feeds into the markup changes — title, author, price, dates — since these fields commonly drift out of sync with the schema block over time.",
      },
    ],
    relatedSlugs: ["schema-generator", "seo-checker", "meta-title-description-checker"],
  },
  {
    slug: "schema-generator",
    name: "Schema Markup Generator (JSON-LD)",
    shortDescription:
      "Generate valid JSON-LD schema markup for Articles, FAQs, Products & more in seconds. Live preview, 1-click copy, 100% free — no sign-up needed.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "⚙️",
    schemaDescription:
      "Generate valid JSON-LD schema markup for Articles, FAQs, Products & more in seconds. Live preview, 1-click copy, 100% free — no sign-up needed.",
    metaTitle: "Free JSON-LD Schema Generator (No Sign-Up Required)",
    metaDescription:
      "Generate valid JSON-LD schema markup for Articles, FAQs, Products & more in seconds. Live preview, 1-click copy, 100% free — no sign-up needed.",
    howToUseParagraphs: [
      paragraph(
        "Pick a schema type — Article, FAQPage, Organization, Product, LocalBusiness, Event, Software Application, and more.",
      ),
      paragraph(
        "Fill in the fields: headline, author, URL, image, and other type-specific properties. ",
        "Structured data is the language search engines use to actually understand what's on a page — not just guess from the surrounding text.",
      ),
      paragraph(
        "Watch the JSON-LD build in real time in the output panel with automatic syntax formatting.",
      ),
      paragraph(
        "Copy the generated script tag with 1 click and paste it into the <head> of your webpage HTML.",
      ),
    ],
    whyItMatters: [
      "Rich results — star ratings, FAQ dropdowns, breadcrumbs — earn more clicks even at the same ranking position.",
      "AI Overviews and answer engines parse JSON-LD to decide what to cite and how to summarize a page.",
      "Schema doesn't guarantee rich results, but pages without valid markup are rarely eligible for them at all.",
      "Consistent schema across a site reinforces the topical trust signals search engines associate with authority.",
    ],
    keyFeatures: [
      "Multiple schema types in one tool (Article, FAQ, Product, Organization, Event, Software)",
      "Live JSON-LD preview as fields are filled in",
      "1-click copy of the finished script tag",
      "Runs entirely in the browser — nothing is sent to a server",
      "Works with any CMS (WordPress, Shopify, Webflow) or custom code",
    ],
    faqs: [
      {
        question: "What is JSON-LD and why does Google prefer it?",
        answer:
          "JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended structured data format because it sits in a single script block, separate from the visible HTML — making it easier to implement and less likely to break page layout.",
      },
      {
        question: "Will adding schema markup guarantee rich results?",
        answer:
          "No. Schema markup makes a page eligible for rich results; it doesn't guarantee them. Google still decides which eligible pages actually get enhanced in the SERP — but pages without valid markup are excluded from consideration entirely.",
      },
      {
        question: "Do I need a developer to add this to my site?",
        answer:
          "Not necessarily. Most CMS platforms allow a script to be pasted into the page header or a custom code field. On WordPress, a simple header/footer script plugin is enough.",
      },
      {
        question: "Is any data stored when the generator is used?",
        answer:
          "No. Everything runs client-side in the browser — the fields entered never leave the device or touch a server.",
      },
    ],
    relatedSlugs: ["schema-validator", "seo-checker", "meta-title-description-checker"],
  },
  {
    slug: "performance-audit",
    name: "PageSpeed Performance Audit (Lighthouse)",
    shortDescription:
      "Analyze mobile & desktop site speed with real Google PageSpeed Insights data — LCP, CLS, FCP, Speed Index, TBT scores, and screenshots, free.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "🚀",
    schemaDescription:
      "Analyze mobile & desktop site speed with real Google PageSpeed Insights data — LCP, CLS, FCP, Speed Index, TBT scores, and screenshots, free.",
    metaTitle: "PageSpeed Performance Audit — Core Web Vitals Checker",
    metaDescription:
      "Analyze mobile & desktop site speed with real Google PageSpeed Insights data — LCP, CLS, FCP, Speed Index, TBT scores, and screenshots, free.",
    howToUseParagraphs: [
      paragraph(
        "Enter the URL to be tested and click 'Analyze PageSpeed'. ",
        "The tool queries the Google PageSpeed Insights API directly, so the data shown is the exact data Google itself uses to evaluate your page.",
      ),
      paragraph(
        "Compare Mobile vs. Desktop results side by side with Core Web Vitals (LCP, CLS), supporting metrics (FCP, Speed Index, TBT), Field Data vs Lab Data, and rendered device screenshots.",
      ),
      paragraph(
        "Field Data reflects real Chrome visitor experience (CrUX report); Lab Data reflects a controlled simulated test run. Understanding both gives you an honest assessment of actual user experience.",
      ),
      paragraph(
        "Review Diagnostics and Passed Audits for specific, fixable causes — image sizing, render-blocking resources, and JS execution time — behind your score.",
      ),
    ],
    whyItMatters: [
      "Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) are the two Core Web Vitals with direct SEO weight.",
      "Mobile and desktop performance are scored independently — a page can pass on one and fail on the other.",
      "Field Data reflects real visitor experience; Lab Data reflects a controlled test, and the two can diverge significantly.",
      "Diagnostics and 'Passed Audits' point to specific, fixable causes behind a low score.",
    ],
    keyFeatures: [
      "Real Google PageSpeed Insights API data, not a simulation",
      "Separate Mobile and Desktop views with mockups",
      "Field Data vs. Lab Data comparison",
      "Live Base64 screenshots of page load stages",
      "Full Diagnostics and Passed Audits breakdown",
    ],
    faqs: [
      {
        question: "Why is the mobile score so much lower than the desktop score?",
        answer:
          "Mobile devices generally have less processing power, and Lighthouse's mobile test simulates a mid-tier device on a throttled connection — so render-heavy or JavaScript-heavy pages usually score lower on mobile even with identical code.",
      },
      {
        question: "What counts as a 'good' LCP, CLS, and FCP score?",
        answer:
          "Google's thresholds place LCP under 2.5 seconds, CLS under 0.1, and FCP under 1.8 seconds in the 'Good' range. Anything above these moves into 'Needs Improvement' or 'Poor.'",
      },
      {
        question: "Why does Field Data sometimes show worse results than Lab Data?",
        answer:
          "Lab Data is measured under ideal, controlled conditions on a single test run. Field Data aggregates real visitors on real networks and devices — including older phones and slower connections — so it often paints a more honest picture.",
      },
      {
        question: "Does a perfect Lighthouse score guarantee good rankings?",
        answer:
          "No. Speed is one of many ranking factors. A fast site with thin content still won't outrank a well-optimized page with strong content — but a slow site puts a ceiling on how well even great content can perform.",
      },
    ],
    relatedSlugs: ["seo-checker", "meta-title-description-checker", "image-alt-checker"],
  },
  {
    slug: "image-alt-checker",
    name: "Image Alt Text & Image SEO Checker",
    shortDescription:
      "Scan any webpage for missing alt attributes, empty alt text & oversized images. Get format and optimization tips to boost image SEO, free.",
    category: "seo",
    categoryLabel: "SEO Tools",
    categoryPath: "/seo-tools",
    icon: "🖼️",
    schemaDescription:
      "Scan any webpage for missing alt attributes, empty alt text & oversized images. Get format and optimization tips to boost image SEO, free.",
    metaTitle: "Image Alt Text Checker — Free Image SEO Audit Tool",
    metaDescription:
      "Scan any webpage for missing alt attributes, empty alt text & oversized images. Get format and optimization tips to boost image SEO, free.",
    howToUseParagraphs: [
      paragraph(
        "Choose URL Input to scan a live webpage, or Paste Raw HTML to check a draft before publishing.",
      ),
      paragraph(
        "Click 'Check Image Alt Tags' to run the scan. ",
        "Images are often the most neglected part of an SEO audit. Missing or empty alt text can sit unnoticed for years, even though alt text is a direct WCAG accessibility requirement and a key Google Images ranking factor.",
      ),
      paragraph(
        "Review the flagged list — missing alt attributes, empty alt text, oversized files, and format recommendations.",
      ),
      paragraph(
        "Fix each image's alt attribute and convert oversized graphics to modern formats (WebP/AVIF) before publishing.",
      ),
    ],
    whyItMatters: [
      "Alt text is a WCAG accessibility requirement, not an optional SEO extra — missing alt text is a compliance issue as much as a ranking one.",
      "Google Images is a meaningful traffic source for product, recipe, and visual-heavy content, and it relies almost entirely on alt text and file context.",
      "Oversized, unoptimized images are one of the most common causes of poor LCP scores in Core Web Vitals audits.",
      "Modern formats (WebP, AVIF) can cut file size significantly over legacy JPG/PNG with no visible quality loss.",
    ],
    keyFeatures: [
      "Full-page image scan with preview cards",
      "Missing and empty alt detection",
      "Decorative vs. informative image classification",
      "File size and modern format (WebP/AVIF) recommendations",
      "Works on live URLs or raw HTML with no sign-up",
    ],
    faqs: [
      {
        question: "Should every image on a page have alt text?",
        answer:
          "Purely decorative images (spacers, background flourishes) can intentionally use an empty alt=\"\" attribute, which tells screen readers to skip them. Every informative image, though, needs descriptive alt text.",
      },
      {
        question: "What makes alt text 'good' versus just present?",
        answer:
          "Good alt text describes what's actually in the image in plain language, specific enough to be useful to someone who can't see it — 'orange tabby cat sleeping on a windowsill' rather than just 'cat' or a stuffed keyword phrase.",
      },
      {
        question: "Does alt text help rankings for the page itself, or just for Google Images?",
        answer:
          "Both, to different degrees. It's a strong direct signal for Image Search rankings, and a smaller but real contextual signal for the page's overall topical relevance in regular search.",
      },
      {
        question: "How much does image file size actually affect page speed?",
        answer:
          "Significantly. Unoptimized images are consistently one of the top causes of poor Largest Contentful Paint scores, especially on mobile connections, since large files delay when the main visible content finishes loading.",
      },
    ],
    relatedSlugs: ["seo-checker", "meta-title-description-checker", "image-compressor"],
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
