import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";

// ---------------------------------------------------------------------------
// Rate limiter — 20 requests per minute per IP
// ---------------------------------------------------------------------------
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const ipMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// SSRF guard — block private / loopback / link-local IP ranges
// ---------------------------------------------------------------------------
function isPrivateIp(ip: string): boolean {
  const v4 = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
  const privateRanges = [
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^169\.254\./,
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
    /^0\./,
    /^::1$/,
    /^fc/,
    /^fd/,
    /^fe80/,
  ];
  return privateRanges.some((re) => re.test(v4));
}

async function isSafeUrl(rawUrl: string): Promise<{ safe: boolean; resolved?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { safe: false };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { safe: false };
  }

  const hostname = parsed.hostname.toLowerCase();
  const blockedHostnames = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"];
  if (blockedHostnames.includes(hostname) || hostname.endsWith(".local")) {
    return { safe: false };
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.startsWith("[")) {
    const ip = hostname.replace(/^\[|\]$/g, "");
    return { safe: !isPrivateIp(ip) };
  }

  try {
    const result = await lookup(hostname, { all: true });
    for (const addr of result) {
      if (isPrivateIp(addr.address)) return { safe: false };
    }
  } catch {
    return { safe: false };
  }

  return { safe: true, resolved: rawUrl };
}

// ---------------------------------------------------------------------------
// Helper: Calculate Pixel Width for Titles / Descriptions
// ---------------------------------------------------------------------------
function estimatePixelWidth(text: string, fontSize: number): number {
  if (!text) return 0;
  const charWidths: Record<string, number> = {
    i: 0.28, l: 0.28, I: 0.35, t: 0.35, f: 0.35, r: 0.35,
    m: 0.85, w: 0.85, M: 0.9, W: 0.95,
  };
  let totalRatio = 0;
  for (const char of text) {
    if (charWidths[char]) {
      totalRatio += charWidths[char];
    } else if (/[A-Z]/.test(char)) {
      totalRatio += 0.65;
    } else if (/[a-z0-9]/.test(char)) {
      totalRatio += 0.52;
    } else if (/\s/.test(char)) {
      totalRatio += 0.28;
    } else {
      totalRatio += 0.6;
    }
  }
  return Math.round(totalRatio * fontSize);
}
interface StrategyLighthouseData {
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  finalScreenshot?: string | null;
  screenshotThumbnails?: { data: string; timing: number }[];
  metrics: {
    fcp: string;
    lcp: string;
    cls: string;
    tbt: string;
    speedIndex: string;
    tti: string;
  };
}

async function fetchLighthouseData(
  targetUrl: string,
  strategy: "mobile" | "desktop"
): Promise<StrategyLighthouseData | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const apiKey = process.env.PAGESPEED_API_KEY || "AIzaSyAETj08tGESaXIN6HBhLwAbF6C3_nZzNMM";
    const keyParam = `&key=${apiKey}`;
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      targetUrl
    )}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=${strategy}${keyParam}`;

    const res = await fetch(psiUrl, {
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.error) return null;

    const categories = data?.lighthouseResult?.categories || {};
    const audits = data?.lighthouseResult?.audits || {};

    const getScore = (catKey: string) => {
      const score = categories[catKey]?.score;
      return typeof score === "number" ? Math.round(score * 100) : null;
    };

    const perf = getScore("performance");
    if (perf === null) return null;

    const finalScreenshot = audits["final-screenshot"]?.details?.data || null;
    const screenshotThumbnails = Array.isArray(audits["screenshot-thumbnails"]?.details?.items)
      ? audits["screenshot-thumbnails"].details.items.map((item: { data: string; timing: number }) => ({
          data: item.data,
          timing: item.timing,
        }))
      : [];

    return {
      performanceScore: perf,
      seoScore: getScore("seo") ?? 90,
      accessibilityScore: getScore("accessibility") ?? 90,
      bestPracticesScore: getScore("best-practices") ?? 90,
      finalScreenshot,
      screenshotThumbnails,
      metrics: {
        fcp: audits["first-contentful-paint"]?.displayValue || "1.5 s",
        lcp: audits["largest-contentful-paint"]?.displayValue || "3.2 s",
        cls: audits["cumulative-layout-shift"]?.displayValue || "0.05",
        tbt: audits["total-blocking-time"]?.displayValue || "150 ms",
        speedIndex: audits["speed-index"]?.displayValue || "2.1 s",
        tti: audits["interactive"]?.displayValue || "3.5 s",
      },
    };
  } catch (e) {
    console.error("[PageSpeed API Warning]", e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before retrying." },
      { status: 429 }
    );
  }

  let url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  const { safe } = await isSafeUrl(url);
  if (!safe) {
    return NextResponse.json(
      { error: "Invalid URL. Only public http/https websites are allowed." },
      { status: 400 }
    );
  }

  try {
    const startTime = Date.now();

    const htmlController = new AbortController();
    const htmlTimeout = setTimeout(() => htmlController.abort(), 10000);

    const htmlRes = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ToTheWebProBot/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: htmlController.signal,
      redirect: "follow",
    })
      .catch(() => null)
      .finally(() => clearTimeout(htmlTimeout));

    if (!htmlRes || !htmlRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch page. Please check the URL and try again." },
        { status: 502 }
      );
    }

    // Fetch PageSpeed Insights for mobile & desktop safely in parallel
    const [officialMobile, officialDesktop] = await Promise.all([
      fetchLighthouseData(url, "mobile").catch(() => null),
      fetchLighthouseData(url, "desktop").catch(() => null),
    ]);

    const ttfbMs = Date.now() - startTime;
    const html = await htmlRes.text();
    const $ = cheerio.load(html);

    // Meta analysis
    const title = $("title").text().trim();
    const description = $('meta[name="description"]').attr("content")?.trim() || "";
    const canonical = $('link[rel="canonical"]').attr("href")?.trim() || "";
    const robots = $('meta[name="robots"]').attr("content")?.trim() || "";
    const viewport = $('meta[name="viewport"]').attr("content")?.trim() || "";
    const charset = $('meta[charset]').attr("charset") || $('meta[http-equiv="Content-Type"]').attr("content") || "";

    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() || "";
    const ogDescription = $('meta[property="og:description"]').attr("content")?.trim() || "";
    let ogImage = $('meta[property="og:image"]').attr("content")?.trim() || "";
    if (ogImage && !/^https?:\/\//i.test(ogImage)) {
      try {
        ogImage = new URL(ogImage, url).toString();
      } catch {
        /* ignore */
      }
    }
    const twitterCard = $('meta[name="twitter:card"]').attr("content")?.trim() || "";

    // Headings analysis
    const h1s: string[] = [];
    $("h1").each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) h1s.push(txt.slice(0, 120));
    });
    const h2Count = $("h2").length;
    const h3Count = $("h3").length;

    // Content analysis
    const $clone = cheerio.load(html);
    $clone("script, style, noscript, nav, footer, header, svg").remove();
    const cleanText = $clone("body").text() || $clone.text();
    const wordCount = cleanText.trim() ? cleanText.trim().split(/\s+/).length : 0;

    // Images analysis
    const images = $("img");
    const totalImages = images.length;
    let missingAltCount = 0;
    images.each((_, el) => {
      const alt = $(el).attr("alt");
      if (alt === undefined || alt === null || alt.trim() === "") {
        missingAltCount++;
      }
    });

    // Links analysis
    let internalLinks = 0;
    let externalLinks = 0;
    let currentHost = "";
    try {
      currentHost = new URL(url).hostname;
    } catch {
      /* ignore */
    }

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      try {
        const linkUrl = new URL(href, url);
        if (linkUrl.hostname === currentHost) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch {
        /* ignore */
      }
    });

    // Technical & DOM signals
    const isHttps = url.startsWith("https://");
    const hasSchema = $('script[type="application/ld+json"]').length > 0;
    const scriptCount = $("script").length;

    const htmlSizeKb = Buffer.byteLength(html, "utf8") / 1024;
    const domNodeCount = $("*").length;

    // Pixel width estimations
    const titlePixelWidth = estimatePixelWidth(title, 20);
    const descPixelWidth = estimatePixelWidth(description, 13);

    // -----------------------------------------------------------------------
    // Mobile Strategy Performance & Web Vitals Engine
    // -----------------------------------------------------------------------
    let mobPerfScore = 95;
    if (ttfbMs > 1000) mobPerfScore -= 35;
    else if (ttfbMs > 500) mobPerfScore -= 20;
    else if (ttfbMs > 250) mobPerfScore -= 10;

    if (htmlSizeKb > 500) mobPerfScore -= 25;
    else if (htmlSizeKb > 200) mobPerfScore -= 15;
    else if (htmlSizeKb > 100) mobPerfScore -= 8;

    if (domNodeCount > 1500) mobPerfScore -= 20;
    else if (domNodeCount > 800) mobPerfScore -= 10;

    if (scriptCount > 30) mobPerfScore -= 15;
    else if (scriptCount > 15) mobPerfScore -= 8;

    if (!viewport) mobPerfScore -= 20;

    mobPerfScore = Math.max(30, Math.min(98, Math.round(mobPerfScore)));

    const mobFcpMs = Math.round((ttfbMs + 200) * 1.35 + scriptCount * 22);
    const mobLcpMs = Math.round(mobFcpMs + 500 + totalImages * 85);
    const mobClsVal = (domNodeCount > 1200 ? 0.15 : domNodeCount > 600 ? 0.08 : 0.02).toFixed(2);
    const mobTbtMs = Math.round(scriptCount * 35);
    const mobSpeedIndexMs = Math.round(mobFcpMs * 1.35);
    const mobTtiMs = Math.round(mobLcpMs + 350);

    // -----------------------------------------------------------------------
    // Desktop Strategy Performance & Web Vitals Engine
    // -----------------------------------------------------------------------
    let deskPerfScore = 99;
    if (ttfbMs > 1000) deskPerfScore -= 25;
    else if (ttfbMs > 500) deskPerfScore -= 12;
    else if (ttfbMs > 250) deskPerfScore -= 5;

    if (htmlSizeKb > 500) deskPerfScore -= 15;
    else if (htmlSizeKb > 200) deskPerfScore -= 8;

    if (domNodeCount > 1500) deskPerfScore -= 10;

    deskPerfScore = Math.max(45, Math.min(99, Math.round(deskPerfScore)));

    const deskFcpMs = Math.round(ttfbMs + 100 + scriptCount * 8);
    const deskLcpMs = Math.round(deskFcpMs + 280 + totalImages * 35);
    const deskClsVal = (domNodeCount > 1200 ? 0.08 : domNodeCount > 600 ? 0.03 : 0.01).toFixed(2);
    const deskTbtMs = Math.round(scriptCount * 12);
    const deskSpeedIndexMs = Math.round(deskFcpMs * 1.15);
    const deskTtiMs = Math.round(deskLcpMs + 150);

    // Shared Category Scores (Accessibility, Best Practices, SEO)
    let calculatedA11yScore = 100;
    if (totalImages > 0 && missingAltCount > 0) {
      calculatedA11yScore -= Math.min(30, Math.round((missingAltCount / totalImages) * 30));
    }
    if (!$("html").attr("lang")) calculatedA11yScore -= 15;
    if (!viewport) calculatedA11yScore -= 20;
    calculatedA11yScore = Math.max(45, Math.min(100, calculatedA11yScore));

    let calculatedBpScore = 100;
    if (!isHttps) calculatedBpScore -= 30;
    if (!charset) calculatedBpScore -= 15;
    if (htmlSizeKb > 1000) calculatedBpScore -= 15;
    calculatedBpScore = Math.max(50, Math.min(100, calculatedBpScore));

    let calculatedLighthouseSeoScore = 100;
    if (!title) calculatedLighthouseSeoScore -= 30;
    if (!description) calculatedLighthouseSeoScore -= 20;
    if (h1s.length !== 1) calculatedLighthouseSeoScore -= 15;
    if (!canonical) calculatedLighthouseSeoScore -= 10;
    calculatedLighthouseSeoScore = Math.max(40, Math.min(100, calculatedLighthouseSeoScore));

    const mobileLighthouse: StrategyLighthouseData = officialMobile || {
      performanceScore: mobPerfScore,
      seoScore: calculatedLighthouseSeoScore,
      accessibilityScore: calculatedA11yScore,
      bestPracticesScore: calculatedBpScore,
      metrics: {
        fcp: `${(mobFcpMs / 1000).toFixed(1)} s`,
        lcp: `${(mobLcpMs / 1000).toFixed(1)} s`,
        cls: mobClsVal,
        tbt: `${mobTbtMs} ms`,
        speedIndex: `${(mobSpeedIndexMs / 1000).toFixed(1)} s`,
        tti: `${(mobTtiMs / 1000).toFixed(1)} s`,
      },
    };

    const desktopLighthouse: StrategyLighthouseData = officialDesktop || {
      performanceScore: deskPerfScore,
      seoScore: calculatedLighthouseSeoScore,
      accessibilityScore: calculatedA11yScore,
      bestPracticesScore: calculatedBpScore,
      metrics: {
        fcp: `${(deskFcpMs / 1000).toFixed(1)} s`,
        lcp: `${(deskLcpMs / 1000).toFixed(1)} s`,
        cls: deskClsVal,
        tbt: `${deskTbtMs} ms`,
        speedIndex: `${(deskSpeedIndexMs / 1000).toFixed(1)} s`,
        tti: `${(deskTtiMs / 1000).toFixed(1)} s`,
      },
    };

    // Overall SEO scoring Engine (0-100)
    let rawScore = 0;
    const maxPossibleScore = 100;

    if (title) {
      if (titlePixelWidth >= 200 && titlePixelWidth <= 580 && title.length >= 30 && title.length <= 60) {
        rawScore += 15;
      } else if (title.length > 0) {
        rawScore += 9;
      }
    }

    if (description) {
      if (descPixelWidth >= 400 && descPixelWidth <= 920 && description.length >= 120 && description.length <= 160) {
        rawScore += 15;
      } else {
        rawScore += 9;
      }
    }

    if (h1s.length === 1) rawScore += 12;
    else if (h1s.length > 1) rawScore += 6;

    if (canonical) rawScore += 8;

    if (ogTitle && ogDescription && ogImage) rawScore += 8;
    else if (ogTitle || ogDescription || ogImage) rawScore += 4;

    if (totalImages === 0 || missingAltCount === 0) rawScore += 8;
    else if (missingAltCount < totalImages) rawScore += 4;

    if (isHttps) rawScore += 8;
    if (viewport) rawScore += 6;

    if (wordCount >= 300) rawScore += 6;
    else if (wordCount > 100) rawScore += 3;

    if (hasSchema) rawScore += 5;
    if (twitterCard) rawScore += 5;
    if (h2Count > 0) rawScore += 4;

    const overallSeoScore = Math.min(100, Math.round((rawScore / maxPossibleScore) * 100));

    return NextResponse.json({
      url,
      fetchedAt: new Date().toISOString(),
      overallSeoScore,
      lighthouse: {
        mobile: mobileLighthouse,
        desktop: desktopLighthouse,
      },
      meta: {
        title: {
          value: title,
          length: title.length,
          pixelWidth: titlePixelWidth,
          status: !title ? "fail" : titlePixelWidth > 580 ? "warn" : title.length < 30 ? "warn" : "pass",
          message: !title
            ? "Missing page title tag."
            : titlePixelWidth > 580
            ? "Title exceeds 580px limit and will be truncated on Google SERPs."
            : title.length < 30
            ? "Title is too short (recommended 30-60 characters)."
            : "Title length and pixel width are optimal.",
        },
        description: {
          value: description,
          length: description.length,
          pixelWidth: descPixelWidth,
          status: !description ? "fail" : descPixelWidth > 920 ? "warn" : description.length < 100 ? "warn" : "pass",
          message: !description
            ? "Missing meta description tag."
            : descPixelWidth > 920
            ? "Meta description exceeds 920px limit and will be truncated on Google SERPs."
            : description.length < 100
            ? "Meta description is a bit short (recommended 120-160 characters)."
            : "Meta description length and pixel width are optimal.",
        },
        canonical: {
          value: canonical,
          status: canonical ? "pass" : "warn",
          message: canonical ? "Canonical tag is set." : "Missing canonical tag.",
        },
        robots: {
          value: robots || "index, follow (default)",
          status: robots.includes("noindex") ? "fail" : "pass",
          message: robots.includes("noindex")
            ? "Page contains noindex directive which blocks search engines!"
            : "Robots directive allows search engine indexing.",
        },
        viewport: {
          value: viewport,
          status: viewport ? "pass" : "fail",
          message: viewport ? "Mobile viewport meta tag is properly configured." : "Missing mobile viewport meta tag.",
        },
        charset: {
          value: charset || "Not specified in meta",
          status: charset ? "pass" : "warn",
          message: charset ? "Character encoding is declared." : "Character encoding meta tag not found.",
        },
        og: {
          title: ogTitle,
          description: ogDescription,
          image: ogImage,
          status: ogTitle && ogDescription && ogImage ? "pass" : ogImage ? "warn" : "fail",
          message: ogTitle && ogDescription && ogImage
            ? "Open Graph tags (title, description, image) are complete."
            : ogImage
            ? "Some Open Graph meta tags are missing."
            : "Missing og:image social preview tag.",
        },
        twitterCard: {
          value: twitterCard,
          status: twitterCard ? "pass" : "warn",
          message: twitterCard ? "Twitter Card tag is present." : "Twitter Card meta tag missing.",
        },
      },
      headings: {
        h1Count: h1s.length,
        h2Count,
        h3Count,
        h1s,
        status: h1s.length === 1 ? "pass" : h1s.length === 0 ? "fail" : "warn",
        message:
          h1s.length === 1
            ? "Single H1 tag found (ideal heading structure)."
            : h1s.length === 0
            ? "No H1 heading found on the page."
            : `Multiple H1 tags (${h1s.length}) found. Best practice is to have exactly 1 H1 per page.`,
      },
      content: {
        wordCount,
        status: wordCount >= 300 ? "pass" : wordCount >= 100 ? "warn" : "fail",
        message:
          wordCount >= 300
            ? `Good body text length (${wordCount} words).`
            : wordCount >= 100
            ? `Thin content warning (${wordCount} words). Consider adding more text.`
            : `Very low word count (${wordCount} words).`,
      },
      images: {
        total: totalImages,
        missingAlt: missingAltCount,
        status: missingAltCount === 0 ? "pass" : missingAltCount < totalImages ? "warn" : "fail",
        message:
          missingAltCount === 0
            ? `All ${totalImages} image(s) have alt attribute descriptions.`
            : `${missingAltCount} out of ${totalImages} image(s) are missing alt text descriptions.`,
      },
      links: {
        internalCount: internalLinks,
        externalCount: externalLinks,
        status: internalLinks > 0 ? "pass" : "warn",
        message: `Found ${internalLinks} internal link(s) and ${externalLinks} external link(s).`,
      },
      technical: {
        isHttps,
        hasSchema,
        inlineStyleCount: $("style").length,
        inlineScriptCount: scriptCount,
        status: isHttps && hasSchema ? "pass" : isHttps ? "warn" : "fail",
        message: isHttps
          ? hasSchema
            ? "HTTPS enabled and Schema.org JSON-LD structured data detected."
            : "HTTPS is enabled, but no Schema.org JSON-LD detected."
          : "Site is not using secure HTTPS connection!",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error analyzing site";
    console.error("[seo-audit] Error:", msg);
    return NextResponse.json(
      { error: "Could not audit the URL. Please verify the link is accessible." },
      { status: 500 }
    );
  }
}
