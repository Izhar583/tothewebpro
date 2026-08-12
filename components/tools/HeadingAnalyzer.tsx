"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Globe, Search, Check, AlertTriangle, X, Hash, Layers, Copy, CheckCircle2 } from "lucide-react";

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
  const [tagFilter, setTagFilter] = useState<"all" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6">("all");
  const [copied, setCopied] = useState(false);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setTagFilter("all");

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

      if (mode === "url") {
        let cleanUrl = inputUrl.trim();
        if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = `https://${cleanUrl}`;

        const res = await fetch(`/api/seo-audit?url=${encodeURIComponent(cleanUrl)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch webpage headings.");
        
        const extractedHeadings: HeadingItem[] = json.headings?.items || [];

        const counts = {
          h1: json.headings?.h1Count || 0,
          h2: json.headings?.h2Count || 0,
          h3: json.headings?.h3Count || 0,
          h4: json.headings?.h4Count || 0,
          h5: json.headings?.h5Count || 0,
          h6: json.headings?.h6Count || 0,
        };

        const issues: { type: "pass" | "warn" | "fail"; title: string; detail: string }[] = [];
        if (counts.h1 === 1) {
          issues.push({ type: "pass", title: "Single H1 Tag Found", detail: "Perfect! The page contains exactly one main H1 header tag." });
        } else if (counts.h1 === 0) {
          issues.push({ type: "fail", title: "Missing H1 Tag", detail: "Critical: No H1 tag detected. Search engines rely on H1 to understand main page topic." });
        } else {
          issues.push({ type: "warn", title: `Multiple H1 Tags (${counts.h1} found)`, detail: "Warning: Multiple H1 tags detected. Consider using a single H1 and H2-H6 for subheadings." });
        }

        if (counts.h2 > 0) {
          issues.push({ type: "pass", title: `${counts.h2} H2 Subheadings Found`, detail: "Good section partitioning with H2 tags." });
        } else {
          issues.push({ type: "warn", title: "No H2 Subheadings Found", detail: "Consider organizing long content into logical sections with H2 headings." });
        }

        const emptyHeadings = extractedHeadings.filter((h) => !h.text);
        if (emptyHeadings.length > 0) {
          issues.push({ type: "fail", title: `${emptyHeadings.length} Empty Heading Tags`, detail: "Remove empty <hX></hX> tags without visible text." });
        } else if (extractedHeadings.length > 0) {
          issues.push({ type: "pass", title: "No Empty Headings", detail: "All detected heading tags contain text content." });
        }

        setResult({
          url: cleanUrl,
          totalHeadings: json.headings?.total || extractedHeadings.length,
          counts,
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

  function handleCopyOutline() {
    if (!result) return;
    const textLines = result.headings.map(
      (h) => `[${h.tag.toUpperCase()}] ${h.text}`
    );
    navigator.clipboard.writeText(textLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredHeadings = result
    ? tagFilter === "all"
      ? result.headings
      : result.headings.filter((h) => h.tag === tagFilter)
    : [];

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
          {/* SEO Pro Extension Header Tag Counter Bar */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Heading Tag Counts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              <button
                type="button"
                onClick={() => setTagFilter("all")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  tagFilter === "all"
                    ? "border-orange-500 bg-orange-50 shadow-xs"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-100"
                }`}
              >
                <span className="block text-xl font-bold text-slate-900">{result.totalHeadings}</span>
                <span className="text-[11px] font-bold uppercase text-slate-500">All Tags</span>
              </button>

              {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((tag) => {
                const count = result.counts[tag];
                const active = tagFilter === tag;
                const tagColorClass =
                  tag === "h1"
                    ? "text-red-600"
                    : tag === "h2"
                    ? "text-amber-600"
                    : tag === "h3"
                    ? "text-blue-600"
                    : tag === "h4"
                    ? "text-purple-600"
                    : tag === "h5"
                    ? "text-emerald-600"
                    : "text-slate-600";

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTagFilter(tag)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      active
                        ? "border-orange-500 bg-orange-50 shadow-xs"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`block text-xl font-bold ${tagColorClass}`}>{count}</span>
                    <span className="text-[11px] font-bold uppercase text-slate-600">{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heading Health Diagnostics */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-orange-600" /> Heading Diagnostics
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

          {/* SEO Pro Extension Visual Heading Outline Tree */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Hash className="h-5 w-5 text-orange-600" /> Complete Heading Outline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted in exact document order with tag levels (H1 - H6)
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyOutline}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Outline</span>
                  </>
                )}
              </button>
            </div>

            {filteredHeadings.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4 text-center">
                No headings found matching filter &quot;{tagFilter.toUpperCase()}&quot;.
              </p>
            ) : (
              <div className="space-y-2.5">
                {filteredHeadings.map((item, idx) => {
                  const tagBadge =
                    item.tag === "h1"
                      ? "bg-red-600 text-white font-black"
                      : item.tag === "h2"
                      ? "bg-amber-600 text-white font-bold"
                      : item.tag === "h3"
                      ? "bg-blue-600 text-white font-bold"
                      : item.tag === "h4"
                      ? "bg-purple-600 text-white font-semibold"
                      : item.tag === "h5"
                      ? "bg-emerald-600 text-white font-semibold"
                      : "bg-slate-600 text-white font-semibold";

                  const depthMargin =
                    item.tag === "h1"
                      ? "ml-0 border-l-4 border-l-red-500 bg-red-50/20"
                      : item.tag === "h2"
                      ? "ml-2 sm:ml-4 border-l-2 border-l-amber-400 bg-amber-50/10"
                      : item.tag === "h3"
                      ? "ml-4 sm:ml-8 border-l-2 border-l-blue-400 bg-blue-50/10"
                      : item.tag === "h4"
                      ? "ml-6 sm:ml-12 border-l border-l-purple-300 bg-purple-50/10"
                      : item.tag === "h5"
                      ? "ml-8 sm:ml-16 border-l border-l-emerald-300 bg-emerald-50/10"
                      : "ml-10 sm:ml-20 border-l border-l-slate-300 bg-slate-50/10";

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-xl border border-slate-100 p-3 text-xs transition-all hover:bg-slate-50 ${depthMargin}`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <span className={`uppercase text-[10px] tracking-wider px-2 py-0.5 rounded shadow-2xs shrink-0 ${tagBadge}`}>
                          {item.tag}
                        </span>
                        <span className="font-semibold text-slate-800 break-words min-w-0">
                          {item.text || <em className="text-red-500 font-normal">(Empty Heading Tag)</em>}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        {item.length} chars
                      </span>
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
