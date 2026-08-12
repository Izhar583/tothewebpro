"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Globe, Search, Check, AlertTriangle, X, FileText, ChevronRight, Hash, Layers } from "lucide-react";

interface HeadingItem {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text: string;
  length: number;
}

interface AnalysisResult {
  url?: string;
  totalHeadings: number;
  counts: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
  headings: HeadingItem[];
  issues: { type: "pass" | "warn" | "fail"; title: string; detail: string }[];
}

export function HeadingAnalyzer() {
  const [inputUrl, setInputUrl] = useState("");
  const [rawHtml, setRawHtml] = useState("");
  const [mode, setMode] = useState<"url" | "html">("url");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (mode === "url" && !inputUrl.trim()) {
      setError("Please enter a valid website URL.");
      return;
    }
    if (mode === "html" && !rawHtml.trim()) {
      setError("Please paste raw HTML code to analyze.");
      return;
    }

    setLoading(true);

    try {
      let targetHtml = rawHtml;
      let targetUrl = inputUrl;

      if (mode === "url") {
        let cleanUrl = inputUrl.trim();
        if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = `https://${cleanUrl}`;
        targetUrl = cleanUrl;

        const res = await fetch(`/api/seo-audit?url=${encodeURIComponent(cleanUrl)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch webpage headings.");
        
        // If meta response provides headings from cheerio:
        const extractedHeadings: HeadingItem[] = [];
        if (json.headings?.h1s) {
          json.headings.h1s.forEach((h1: string) => extractedHeadings.push({ tag: "h1", text: h1, length: h1.length }));
        }

        // Run client fetch fallback if needed or build structured result
        const issues: { type: "pass" | "warn" | "fail"; title: string; detail: string }[] = [];
        const h1Count = json.headings?.h1Count || 0;
        
        if (h1Count === 1) {
          issues.push({ type: "pass", title: "Single H1 Tag Found", detail: "Perfect! The page contains exactly one main H1 header tag." });
        } else if (h1Count === 0) {
          issues.push({ type: "fail", title: "Missing H1 Tag", detail: "Critical: No H1 tag detected. Search engines rely on H1 to understand main page topic." });
        } else {
          issues.push({ type: "warn", title: `Multiple H1 Tags (${h1Count} found)`, detail: "Warning: Multiple H1 tags detected. Consider using a single H1 and H2-H6 for subheadings." });
        }

        if (json.headings?.h2Count > 0) {
          issues.push({ type: "pass", title: `${json.headings.h2Count} H2 Subheadings Found`, detail: "Good section partitioning with H2 tags." });
        } else {
          issues.push({ type: "warn", title: "No H2 Subheadings Found", detail: "Consider organizing long content into logical sections with H2 headings." });
        }

        setResult({
          url: cleanUrl,
          totalHeadings: (json.headings?.h1Count || 0) + (json.headings?.h2Count || 0) + (json.headings?.h3Count || 0),
          counts: {
            h1: json.headings?.h1Count || 0,
            h2: json.headings?.h2Count || 0,
            h3: json.headings?.h3Count || 0,
            h4: 0,
            h5: 0,
            h6: 0,
          },
          headings: extractedHeadings,
          issues,
        });
      } else {
        // Client-side HTML parsing via DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, "text/html");
        const elements = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));

        const headings: HeadingItem[] = elements.map((el) => ({
          tag: el.tagName.toLowerCase() as HeadingItem["tag"],
          text: el.textContent?.trim() || "",
          length: (el.textContent?.trim() || "").length,
        }));

        const counts = {
          h1: headings.filter((h) => h.tag === "h1").length,
          h2: headings.filter((h) => h.tag === "h2").length,
          h3: headings.filter((h) => h.tag === "h3").length,
          h4: headings.filter((h) => h.tag === "h4").length,
          h5: headings.filter((h) => h.tag === "h5").length,
          h6: headings.filter((h) => h.tag === "h6").length,
        };

        const issues: { type: "pass" | "warn" | "fail"; title: string; detail: string }[] = [];
        if (counts.h1 === 1) {
          issues.push({ type: "pass", title: "Single H1 Tag Found", detail: "Great job! Exactly 1 main H1 header tag." });
        } else if (counts.h1 === 0) {
          issues.push({ type: "fail", title: "Missing H1 Header", detail: "Page is missing an H1 tag. Add one main heading." });
        } else {
          issues.push({ type: "warn", title: `${counts.h1} H1 Headers Found`, detail: "Multiple H1 tags detected in HTML block." });
        }

        const emptyHeadings = headings.filter((h) => !h.text);
        if (emptyHeadings.length > 0) {
          issues.push({ type: "fail", title: `${emptyHeadings.length} Empty Heading Tags`, detail: "Remove empty <hX></hX> tags without visible text." });
        } else {
          issues.push({ type: "pass", title: "No Empty Headings", detail: "All detected heading tags contain text content." });
        }

        setResult({
          totalHeadings: headings.length,
          counts,
          headings,
          issues,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to analyze headings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Box */}
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-orange-100 pb-4">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "url" ? "bg-orange-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            URL Input
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "html" ? "bg-orange-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Paste Raw HTML
          </button>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          {mode === "url" ? (
            <div className="space-y-2">
              <label htmlFor="heading-url-input" className="block text-sm font-bold text-slate-800">
                Enter Website URL to Analyze Heading Hierarchy (H1 - H6)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Globe className="h-5 w-5" />
                </div>
                <input
                  id="heading-url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full rounded-2xl border border-orange-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="raw-html-input" className="block text-sm font-bold text-slate-800">
                Paste HTML Code Snippet
              </label>
              <textarea
                id="raw-html-input"
                rows={6}
                placeholder="<html><body><h1>Main Title</h1><h2>Subsection</h2></body></html>"
                value={rawHtml}
                onChange={(e) => setRawHtml(e.target.value)}
                className="w-full rounded-2xl border border-orange-200 bg-white p-4 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? <Spinner label="Analyzing headings..." /> : <Search className="h-4 w-4" />}
            <span>Analyze Heading Structure</span>
          </button>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Banner */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm text-center">
              <span className="block text-2xl font-black text-orange-600">{result.totalHeadings}</span>
              <span className="text-xs font-bold text-slate-600">Total Headings</span>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm text-center">
              <span className={`block text-2xl font-black ${result.counts.h1 === 1 ? "text-emerald-600" : "text-amber-600"}`}>
                {result.counts.h1}
              </span>
              <span className="text-xs font-bold text-slate-600">H1 Tag Count</span>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm text-center">
              <span className="block text-2xl font-black text-slate-900">{result.counts.h2 + result.counts.h3}</span>
              <span className="text-xs font-bold text-slate-600">H2 & H3 Subheadings</span>
            </div>
          </div>

          {/* Heading Health Issues */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-orange-600" /> Heading Structure Diagnostics
            </h3>

            <div className="space-y-3">
              {result.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-2xl p-4 border ${
                    issue.type === "pass"
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                      : issue.type === "warn"
                      ? "bg-amber-50/60 border-amber-200 text-amber-900"
                      : "bg-red-50/60 border-red-200 text-red-900"
                  }`}
                >
                  {issue.type === "pass" && <Check className="h-5 w-5 text-emerald-600 mt-0.5" />}
                  {issue.type === "warn" && <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />}
                  {issue.type === "fail" && <X className="h-5 w-5 text-red-600 mt-0.5" />}
                  <div>
                    <h4 className="text-sm font-bold">{issue.title}</h4>
                    <p className="text-xs mt-0.5 opacity-90">{issue.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Heading Hierarchy Tree */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Hash className="h-5 w-5 text-orange-600" /> Heading Outline Tree
            </h3>

            {result.headings.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No heading tags (H1-H6) detected in this input.</p>
            ) : (
              <div className="space-y-2">
                {result.headings.map((item, idx) => {
                  const depthMargin =
                    item.tag === "h1"
                      ? "ml-0 bg-orange-50 border-orange-200 text-orange-950 font-bold"
                      : item.tag === "h2"
                      ? "ml-4 bg-slate-50 border-slate-200 text-slate-900 font-semibold"
                      : item.tag === "h3"
                      ? "ml-8 bg-slate-50/70 border-slate-200 text-slate-800"
                      : "ml-12 bg-slate-50/40 border-slate-100 text-slate-700";

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs transition ${depthMargin}`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="uppercase text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-200">
                          {item.tag}
                        </span>
                        <span className="truncate">{item.text || <em className="text-red-500">(Empty Heading Tag)</em>}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.length} chars</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
