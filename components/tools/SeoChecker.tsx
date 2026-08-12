"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Check, X, AlertTriangle, Globe, Zap, Search, ShieldCheck, FileText, ImageIcon, RefreshCw, Smartphone, Monitor } from "lucide-react";

interface StrategyData {
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  metrics: {
    fcp: string;
    lcp: string;
    cls: string;
    tbt: string;
    speedIndex: string;
    tti: string;
  };
}

interface AuditResult {
  url: string;
  fetchedAt: string;
  overallSeoScore: number;
  lighthouse: {
    mobile: StrategyData;
    desktop: StrategyData;
  };
  meta: {
    title: { value: string; length: number; pixelWidth: number; status: "pass" | "warn" | "fail"; message: string };
    description: { value: string; length: number; pixelWidth: number; status: "pass" | "warn" | "fail"; message: string };
    canonical: { value: string; status: "pass" | "warn" | "fail"; message: string };
    robots: { value: string; status: "pass" | "warn" | "fail"; message: string };
    viewport: { value: string; status: "pass" | "warn" | "fail"; message: string };
    charset: { value: string; status: "pass" | "warn" | "fail"; message: string };
    og: { title: string; description: string; image: string; status: "pass" | "warn" | "fail"; message: string };
    twitterCard: { value: string; status: "pass" | "warn" | "fail"; message: string };
  };
  headings: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h1s: string[];
    status: "pass" | "warn" | "fail";
    message: string;
  };
  content: {
    wordCount: number;
    status: "pass" | "warn" | "fail";
    message: string;
  };
  images: {
    total: number;
    missingAlt: number;
    status: "pass" | "warn" | "fail";
    message: string;
  };
  links: {
    internalCount: number;
    externalCount: number;
    status: "pass" | "warn" | "fail";
    message: string;
  };
  technical: {
    isHttps: boolean;
    hasSchema: boolean;
    inlineStyleCount: number;
    inlineScriptCount: number;
    status: "pass" | "warn" | "fail";
    message: string;
  };
}

function StatusBadge({ status }: { status: "pass" | "warn" | "fail" }) {
  if (status === "pass") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
        <Check className="h-3.5 w-3.5" /> Pass
      </span>
    );
  }
  if (status === "warn") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
        <AlertTriangle className="h-3.5 w-3.5" /> Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-200">
      <X className="h-3.5 w-3.5" /> Issue
    </span>
  );
}

function ScoreGauge({ score, title }: { score: number; title: string }) {
  const numScore = Math.max(0, Math.min(100, score));

  const colorClass =
    numScore >= 90
      ? "text-emerald-500 stroke-emerald-500"
      : numScore >= 50
        ? "text-amber-500 stroke-amber-500"
        : "text-red-500 stroke-red-500";

  const strokeDash = `${(numScore / 100) * 220} 220`;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-orange-100 bg-white shadow-sm">
      <div className="relative flex items-center justify-center h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="35"
            className="stroke-slate-100"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="35"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            strokeWidth="3"
            strokeDasharray={strokeDash}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className={`absolute text-xl font-extrabold ${numScore >= 90 ? "text-emerald-600" : numScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
          {numScore}
        </span>
      </div>
      <span className="mt-2 text-xs font-bold text-slate-700 text-center">{title}</span>
    </div>
  );
}

export function SeoChecker() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [deviceStrategy, setDeviceStrategy] = useState<"mobile" | "desktop">("mobile");

  async function handleAudit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      setError("Please enter a valid website URL.");
      return;
    }

    setLoading(true);
    setError(null);

    let cleanUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const res = await fetch(`/api/seo-audit?url=${encodeURIComponent(cleanUrl)}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to audit website.");
      }

      setResult(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const currentLighthouse = result?.lighthouse[deviceStrategy];

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/60 via-white to-orange-50/30 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleAudit} className="space-y-4">
          <label htmlFor="seo-url-input" className="block text-sm sm:text-base text-slate-800">
            Enter Website URL for Instant Full SEO & Speed Audit
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Globe className="h-5 w-5" />
              </div>
              <input
                id="seo-url-input"
                type="url"
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full rounded-2xl border border-orange-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/20 focus:border-orange-500 focus:ring-4 transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-8 py-3.5 text-sm text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner label="" />
                  <span>Auditing Website...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Run Free SEO Audit</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>
      {loading && (
        <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm space-y-6 text-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Auditing Website & Running Lighthouse</h3>
            <p className="text-sm text-slate-500 mt-1">Analyzing meta tags, heading structure, images, HTTPS security, and fetching Google PageSpeed metrics for Mobile & Desktop...</p>
          </div>
          <Spinner label="Running full audit pass..." />
        </div>
      )}
      {result && !loading && currentLighthouse && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Header Card (Sticky below main navbar) */}
          <div className="sticky top-[84px] z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-orange-200 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-lg transition-all">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Audit Report for</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate max-w-xl">{result.url}</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Generated at {new Date(result.fetchedAt).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile / Desktop Toggle Switch */}
              <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setDeviceStrategy("mobile")}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${deviceStrategy === "mobile"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceStrategy("desktop")}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${deviceStrategy === "desktop"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </button>
              </div>

              <button
                onClick={() => handleAudit()}
                className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Re-audit
              </button>
            </div>
          </div>

          {/* Scores Overview Dashboard */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <ScoreGauge score={result.overallSeoScore} title="Overall SEO Score" />
            <ScoreGauge score={currentLighthouse.performanceScore} title={`${deviceStrategy === "mobile" ? "Mobile" : "Desktop"} Performance`} />
            <ScoreGauge score={currentLighthouse.seoScore} title="Lighthouse SEO" />
            <ScoreGauge score={currentLighthouse.accessibilityScore} title="Accessibility" />
            <ScoreGauge score={currentLighthouse.bestPracticesScore} title="Best Practices" />
          </div>

          {/* Core Web Vitals Card (PageSpeed / Lighthouse) */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Google Lighthouse Core Web Vitals
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Official Google PageSpeed performance timing signals for {deviceStrategy} users
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                {deviceStrategy === "mobile" ? <Smartphone className="h-4 w-4 text-orange-600" /> : <Monitor className="h-4 w-4 text-orange-600" />}
                <span>Active: {deviceStrategy.toUpperCase()} Mode</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <span className="text-xs font-bold text-slate-700">First Contentful Paint (FCP)</span>
                <p className="text-lg text-slate-900 mt-1">{currentLighthouse.metrics.fcp}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <span className="text-xs font-bold text-slate-700">Largest Contentful Paint (LCP)</span>
                <p className="text-lg text-slate-900 mt-1">{currentLighthouse.metrics.lcp}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <span className="text-xs font-bold text-slate-700">Cumulative Layout Shift (CLS)</span>
                <p className="text-lg text-slate-900 mt-1">{currentLighthouse.metrics.cls}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <span className="text-xs font-bold text-slate-700">Total Blocking Time (TBT)</span>
                <p className="text-lg text-slate-900 mt-1">{currentLighthouse.metrics.tbt}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <span className="text-xs font-bold text-slate-700">Speed Index</span>
                <p className="text-lg text-slate-900 mt-1">{currentLighthouse.metrics.speedIndex}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <span className="text-xs font-bold text-slate-700">Time to Interactive (TTI)</span>
                <p className="text-lg text-slate-900 mt-1">{currentLighthouse.metrics.tti}</p>
              </div>
            </div>
          </div>

          {/* Audit Category Details */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Meta Tags Audit */}
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Meta Tags & Search Preview</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Meta Title</span>
                    <StatusBadge status={result.meta.title.status} />
                  </div>
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">
                    {result.meta.title.value || "None"}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">{result.meta.title.message}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Meta Description</span>
                    <StatusBadge status={result.meta.description.status} />
                  </div>
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    {result.meta.description.value || "None"}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">{result.meta.description.message}</p>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-700 block">Canonical URL</span>
                    <span className="text-xs text-slate-500">{result.meta.canonical.message}</span>
                  </div>
                  <StatusBadge status={result.meta.canonical.status} />
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-700 block">Robots Directives</span>
                    <span className="text-xs text-slate-500">{result.meta.robots.message}</span>
                  </div>
                  <StatusBadge status={result.meta.robots.status} />
                </div>
              </div>
            </div>

            {/* Headings Audit */}
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Headings & Structure</h3>
                </div>
                <StatusBadge status={result.headings.status} />
              </div>

              <div className="space-y-4 text-sm">
                <p className="text-xs font-semibold text-slate-600">{result.headings.message}</p>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-xl font-black text-orange-600">{result.headings.h1Count}</span>
                    <span className="text-xs font-bold text-slate-600">H1 Tags</span>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-xl font-black text-slate-900">{result.headings.h2Count}</span>
                    <span className="text-xs font-bold text-slate-600">H2 Tags</span>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-xl font-black text-slate-900">{result.headings.h3Count}</span>
                    <span className="text-xs font-bold text-slate-600">H3 Tags</span>
                  </div>
                </div>

                {result.headings.h1s.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700">Detected H1 Text:</span>
                    {result.headings.h1s.map((h1, idx) => (
                      <div key={idx} className="text-xs bg-orange-50 text-orange-800 border border-orange-100 p-2.5 rounded-xl font-medium">
                        {h1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Images Audit */}
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Images & Alt Attributes</h3>
                </div>
                <StatusBadge status={result.images.status} />
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-xs font-semibold text-slate-600">{result.images.message}</p>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-xl font-black text-slate-900">{result.images.total}</span>
                    <span className="text-xs font-bold text-slate-600">Total Images</span>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className={`block text-xl font-black ${result.images.missingAlt === 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {result.images.missingAlt}
                    </span>
                    <span className="text-xs font-bold text-slate-600">Missing Alt Text</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical SEO Audit */}
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Technical SEO & Security</h3>
                </div>
                <StatusBadge status={result.technical.status} />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-1.5">
                  <span className="font-bold text-slate-700">HTTPS Security</span>
                  {result.technical.isHttps ? <StatusBadge status="pass" /> : <StatusBadge status="fail" />}
                </div>

                <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Schema.org JSON-LD</span>
                  {result.technical.hasSchema ? <StatusBadge status="pass" /> : <StatusBadge status="warn" />}
                </div>

                <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Mobile Viewport Tag</span>
                  <StatusBadge status={result.meta.viewport.status} />
                </div>

                <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Open Graph Social Image</span>
                  <StatusBadge status={result.meta.og.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Checker Educational & FAQ Content */}
      <div className="space-y-8 pt-8 border-t border-orange-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Why Use Our Free Website SEO & Speed Checker?</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Search engine optimization (SEO) and page load speed directly influence your organic traffic and Google rankings.
            Our free website audit tool tests page performance for both Mobile and Desktop devices, meta tags, title lengths, mobile responsiveness, heading structure, and Google Lighthouse metrics in seconds.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Mobile & Desktop PageSpeed</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Integrates directly with Google Lighthouse to measure First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS) separately for Mobile and Desktop.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Meta & SERP Preview Audit</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Checks title pixel widths, meta description thresholds, canonical tags, and Open Graph social tags to prevent SERP truncation.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Technical & On-Page Checks</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Audits image alt attributes, heading hierarchies (H1/H2), HTTPS status, and Schema.org JSON-LD structured data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
