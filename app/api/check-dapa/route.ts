import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
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

interface CachedResult {
  data: DomainMetricResult;
  timestamp: number;
}
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const domainCache = new Map<string, CachedResult>();

export interface HistoryPoint {
  date: string;
  open_page_rank: number;
  estimated: boolean;
}

export interface DomainMetricResult {
  domain: string;
  found: boolean;
  domain_authority: number;
  page_authority: number;
  open_page_rank: number | null;
  rank: number | null;
  referring_domains: number | null;
  external_backlinks: number | null;
  spam_score: number;
  spam_rating: "Low" | "Medium" | "High";
  status: "High Authority" | "Good Authority" | "Average" | "Low / New";
  domain_age?: string | null;
  created_date?: string | null;
  expiry_date?: string | null;
  registrar?: string | null;
  history: HistoryPoint[];
  cached?: boolean;
}

function normalizeDomain(input: string): string {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//i, "");
  cleaned = cleaned.replace(/^www\./i, "");
  cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0];
  cleaned = cleaned.split(":")[0];
  return cleaned.trim();
}

function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false;
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  return domainRegex.test(domain);
}

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

async function isSafeDomain(domain: string): Promise<boolean> {
  const blockedHostnames = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"];
  if (blockedHostnames.includes(domain) || domain.endsWith(".local") || domain.endsWith(".internal")) {
    return false;
  }
  try {
    const result = await lookup(domain, { all: true });
    for (const addr of result) {
      if (isPrivateIp(addr.address)) return false;
    }
    return true;
  } catch {
    return true;
  }
}

async function getEnvVariable(key: string): Promise<string | undefined> {
  if (process.env[key]) return process.env[key];
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const regex = new RegExp(`${key}=["']?([^"'\\r\\n]+)["']?`);
      const match = envContent.match(regex);
      if (match) return match[1].trim();
    }
  } catch {
  }
  return undefined;
}
// Format human-friendly domain age
function formatDomainAge(createdDateStr: string): string {
  try {
    const created = new Date(createdDateStr);
    const now = new Date();
    if (isNaN(created.getTime())) return "Verified";

    let years = now.getFullYear() - created.getFullYear();
    let months = now.getMonth() - created.getMonth();
    const days = now.getDate() - created.getDate();
    if (days < 0) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years > 0) {
      return `${years} ${years === 1 ? "Year" : "Years"}${months > 0 ? `, ${months} ${months === 1 ? "Mo" : "Mos"}` : ""}`;
    }
    if (months > 0) {
      return `${months} ${months === 1 ? "Month" : "Months"}`;
    }
    return `New (< 1 Mo)`;
  } catch {
    return "Verified";
  }
}

interface RdapEntity {
  roles?: string[];
  vcardArray?: [string, Array<[string, Record<string, unknown>, string, string]>];
}

// Fetch registration and WHOIS data via RDAP
async function fetchDomainWhois(domain: string): Promise<{
  domainAge: string | null;
  createdDate: string | null;
  expiryDate: string | null;
  registrar: string | null;
}> {
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { domainAge: null, createdDate: null, expiryDate: null, registrar: null };

    const data = await res.json();
    const events: Array<{ eventAction: string; eventDate: string }> = data.events || [];
    const regEvent = events.find((e) => e.eventAction === "registration" || e.eventAction === "creation");
    const expEvent = events.find((e) => e.eventAction === "expiration");

    let createdDate: string | null = null;
    let domainAge: string | null = null;
    if (regEvent?.eventDate) {
      createdDate = new Date(regEvent.eventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      domainAge = formatDomainAge(regEvent.eventDate);
    }

    let expiryDate: string | null = null;
    if (expEvent?.eventDate) {
      expiryDate = new Date(expEvent.eventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    let registrar: string | null = null;
    const entities: RdapEntity[] = data.entities || [];
    const regEntity = entities.find((e) => e.roles?.includes("registrar"));
    if (regEntity) {
      const vcard = regEntity.vcardArray?.[1];
      const fnEntry = vcard?.find((v) => v[0] === "fn");
      if (fnEntry && typeof fnEntry[3] === "string") {
        registrar = fnEntry[3];
      }
    }

    return { domainAge, createdDate, expiryDate, registrar };
  } catch {
    return { domainAge: null, createdDate: null, expiryDate: null, registrar: null };
  }
}

// Fetch single domain metrics from RapidAPI Moz
async function fetchMozMetrics(
  domain: string,
  rapidApiKey: string,
  rapidApiHost: string = "moz-da-pa1.p.rapidapi.com"
): Promise<{
  da: number;
  pa: number;
  spamScore: number;
  backlinks: number;
} | null> {
  try {
    const res = await fetch(`https://${rapidApiHost}/v1/getDaPa`, {
      method: "POST",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": rapidApiHost,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: domain }),
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`Moz RapidAPI error for ${domain}:`, res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return {
      da: Number(data.domain_authority) || 0,
      pa: Number(data.page_authority) || 0,
      spamScore: Number(data.spam_score) || 1,
      backlinks: Number(data.external_urls_to_url) || 0,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`Error fetching Moz metrics for ${domain}:`, errMsg);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let rawDomains: string[] = [];

    if (Array.isArray(body.domains)) {
      rawDomains = body.domains;
    } else if (typeof body.domain === "string") {
      rawDomains = [body.domain];
    } else if (typeof body.url === "string") {
      rawDomains = [body.url];
    }

    if (rawDomains.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one domain or URL to analyze." },
        { status: 400 }
      );
    }

    const uniqueNormalized = Array.from(
      new Set(
        rawDomains
          .map(normalizeDomain)
          .filter((d) => d.length > 0 && isValidDomain(d))
      )
    ).slice(0, 20);

    if (uniqueNormalized.length === 0) {
      return NextResponse.json(
        { error: "Invalid domain format. Example: example.com or https://example.com" },
        { status: 400 }
      );
    }

    const rapidApiKey = await getEnvVariable("RAPIDAPI_KEY");
    const rapidApiHost = (await getEnvVariable("RAPIDAPI_MOZ_HOST")) || "moz-da-pa1.p.rapidapi.com";
    const oprApiKey = await getEnvVariable("OPENPAGERANK_API_KEY");

    const results: DomainMetricResult[] = [];
    const domainsToFetch: string[] = [];
    const now = Date.now();

    // Check Cache first
    for (const domain of uniqueNormalized) {
      const cached = domainCache.get(domain);
      if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        results.push({ ...cached.data, cached: true });
      } else {
        domainsToFetch.push(domain);
      }
    }

    if (domainsToFetch.length > 0) {
      interface OprDomainResult {
        domain?: string;
        open_page_rank?: number;
        rank?: number;
        referring_domains?: number;
        found?: boolean;
        history?: HistoryPoint[];
      }
      const oprResultsMap = new Map<string, OprDomainResult>();
      if (oprApiKey) {
        try {
          const oprRes = await fetch(
            "https://openpagerank.keywordseverywhere.com/v1/domains/bulk",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${oprApiKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                domains: domainsToFetch,
                include_history: true,
              }),
              next: { revalidate: 0 },
            }
          );
          if (oprRes.ok) {
            const oprData = await oprRes.json();
            const list: OprDomainResult[] = oprData.results || oprData.domains || [];
            for (const item of list) {
              if (item.domain) {
                oprResultsMap.set(item.domain.toLowerCase(), item);
              }
            }
          }
        } catch (e) {
          console.error("OpenPageRank batch error:", e);
        }
      }

      // 2. Fetch Moz metrics for each domain (Parallel execution)
      const fetchPromises = domainsToFetch.map(async (domain) => {
        const safe = await isSafeDomain(domain);
        if (!safe) {
          return {
            domain,
            found: false,
            domain_authority: 0,
            page_authority: 0,
            open_page_rank: 0,
            rank: null,
            referring_domains: null,
            external_backlinks: null,
            spam_score: 100,
            spam_rating: "High" as const,
            status: "Low / New" as const,
            history: [],
          };
        }

        let da = 0;
        let pa = 0;
        let spamScore = 1;
        let backlinks = 0;

        const [moz, whois] = await Promise.all([
          rapidApiKey ? fetchMozMetrics(domain, rapidApiKey, rapidApiHost) : Promise.resolve(null),
          fetchDomainWhois(domain),
        ]);

        if (moz) {
          da = moz.da;
          pa = moz.pa;
          spamScore = moz.spamScore;
          backlinks = moz.backlinks;
        }

        const oprData = oprResultsMap.get(domain.toLowerCase());
        const openPageRank = oprData?.open_page_rank
          ? Number(oprData.open_page_rank.toFixed(2))
          : da > 0
          ? Number((da / 10).toFixed(1))
          : 0;

        // If Moz failed or was 0, fall back to scaled OpenPageRank
        if (da === 0 && openPageRank > 0) {
          da = Math.min(100, Math.max(1, Math.round(openPageRank * 10)));
          pa = Math.min(100, Math.max(1, da - 2));
        }

        let spamRating: "Low" | "Medium" | "High" = "Low";
        if (spamScore >= 30) spamRating = "High";
        else if (spamScore >= 15) spamRating = "Medium";

        let status: "High Authority" | "Good Authority" | "Average" | "Low / New" = "Low / New";
        if (da >= 70) status = "High Authority";
        else if (da >= 45) status = "Good Authority";
        else if (da >= 20) status = "Average";

        const finalMetric: DomainMetricResult = {
          domain,
          found: da > 0 || (oprData && oprData.found) || Boolean(whois?.createdDate),
          domain_authority: da,
          page_authority: pa,
          open_page_rank: openPageRank,
          rank: oprData?.rank ?? null,
          referring_domains: oprData?.referring_domains ?? null,
          external_backlinks: backlinks || null,
          spam_score: spamScore,
          spam_rating: spamRating,
          status,
          domain_age: whois?.domainAge ?? null,
          created_date: whois?.createdDate ?? null,
          expiry_date: whois?.expiryDate ?? null,
          registrar: whois?.registrar ?? null,
          history: oprData?.history || [],
        };

        // Cache the result
        domainCache.set(domain.toLowerCase(), { data: finalMetric, timestamp: now });
        return finalMetric;
      });

      const fetchedResults = await Promise.all(fetchPromises);
      results.push(...fetchedResults);
    }

    // Preserve user query order
    const orderedResults = uniqueNormalized
      .map((d) => results.find((r) => r.domain.toLowerCase() === d.toLowerCase()))
      .filter(Boolean) as DomainMetricResult[];

    return NextResponse.json({
      success: true,
      total: orderedResults.length,
      results: orderedResults,
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("DA PA Checker API internal error:", errMsg);
    return NextResponse.json(
      { error: "An unexpected server error occurred while analyzing domain authority." },
      { status: 500 }
    );
  }
}
