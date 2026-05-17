import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";

// ---------------------------------------------------------------------------
// Rate limiter — 10 requests per minute per IP (in-memory, resets per worker)
// ---------------------------------------------------------------------------
const RATE_LIMIT = 10;
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
  // Normalise IPv6-mapped IPv4 (::ffff:1.2.3.4)
  const v4 = ip.startsWith("::ffff:") ? ip.slice(7) : ip;

  // IPv4 private ranges
  const privateRanges = [
    /^127\./,            // loopback
    /^10\./,             // RFC 1918
    /^192\.168\./,       // RFC 1918
    /^172\.(1[6-9]|2\d|3[01])\./,  // RFC 1918
    /^169\.254\./,       // link-local / AWS metadata
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,  // CGNAT
    /^0\./,              // "this" network
    /^::1$/,             // IPv6 loopback
    /^fc/,               // IPv6 unique-local
    /^fd/,               // IPv6 unique-local
    /^fe80/,             // IPv6 link-local
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

  // Only allow http and https
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { safe: false };
  }

  const hostname = parsed.hostname;

  // Block bare IP addresses that are private
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.startsWith("[")) {
    const ip = hostname.replace(/^\[|\]$/g, "");
    return { safe: !isPrivateIp(ip) };
  }

  // Resolve hostname and check address
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

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before retrying." },
      { status: 429 },
    );
  }

  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  // SSRF protection
  const { safe } = await isSafeUrl(url);
  if (!safe) {
    return NextResponse.json(
      { error: "URL not allowed. Only public http/https addresses are supported." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ToTheWebProBot/1.0 (+https://tothewebpro.com)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `The page returned HTTP ${res.status}.` },
        { status: 502 },
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "URL did not return an HTML page." },
        { status: 415 },
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Clean up non-visible content for a better word count
    const $clone = cheerio.load(html);
    $clone("script, style, noscript, nav, footer, header").remove();
    const cleanText = $clone("body").text() || $clone.text();
    const wordCount = cleanText.trim() ? cleanText.trim().split(/\s+/).length : 0;

    const h1s: string[] = [];
    $("h1").each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) h1s.push(txt.slice(0, 100)); // Limit long H1s
    });

    let ogImage = $('meta[property="og:image"]').attr("content") || "";
    if (ogImage && !/^https?:\/\//i.test(ogImage)) {
      try {
        ogImage = new URL(ogImage, url).toString();
      } catch {
        // stay relative if parse fails
      }
    }

    return NextResponse.json({
      title:
        $("title").text().trim() ||
        $('meta[property="og:title"]').attr("content") ||
        "",
      description:
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "",
      ogTitle: $('meta[property="og:title"]').attr("content") || "",
      ogImage,
      canonical: $('link[rel="canonical"]').attr("href") || "",
      robots: $('meta[name="robots"]').attr("content") || "index, follow",
      h1s: h1s.slice(0, 5),
      wordCount,
    });
  } catch (err) {
    console.error("Fetch meta error:", err);
    return NextResponse.json(
      { error: "Could not fetch the URL. Check it is publicly accessible." },
      { status: 500 },
    );
  }
}
