"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Image as ImageIcon, Globe, Search, Check, AlertTriangle, X, ExternalLink, Copy, CheckCircle2 } from "lucide-react";

interface ImageItem {
  src: string;
  alt: string | null;
  hasAlt: boolean;
  isDecorative: boolean;
  length: number;
  status: "pass" | "warn" | "fail";
  message: string;
}

interface AnalysisResult {
  url?: string;
  totalImages: number;
  passedImages: number;
  missingAltCount: number;
  emptyAltCount: number;
  images: ImageItem[];
}

export function ImageAltChecker() {
  const [inputUrl, setInputUrl] = useState("");
  const [rawHtml, setRawHtml] = useState("");
  const [mode, setMode] = useState<"url" | "html">("url");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [filter, setFilter] = useState<"all" | "missing" | "valid" | "decorative">("all");
  const [copiedMissing, setCopiedMissing] = useState(false);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setFilter("all");

    if (mode === "url" && !inputUrl.trim()) {
      setError("Please enter a valid website URL.");
      return;
    }
    if (mode === "html" && !rawHtml.trim()) {
      setError("Please paste raw HTML code containing <img> tags.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "url") {
        let cleanUrl = inputUrl.trim();
        if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = `https://${cleanUrl}`;

        const res = await fetch(`/api/seo-audit?url=${encodeURIComponent(cleanUrl)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch webpage images.");

        const imgDetails = json.images || {};
        const extractedImages: ImageItem[] = imgDetails.items || [];

        setResult({
          url: cleanUrl,
          totalImages: imgDetails.total || extractedImages.length,
          passedImages: imgDetails.validAlt || extractedImages.filter((i) => i.status === "pass").length,
          missingAltCount: imgDetails.missingAlt || extractedImages.filter((i) => i.status === "fail").length,
          emptyAltCount: imgDetails.emptyAlt || extractedImages.filter((i) => i.status === "warn").length,
          images: extractedImages,
        });
      } else {
        // Client-side DOMParser for raw HTML snippet
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, "text/html");
        const imgElements = Array.from(doc.querySelectorAll("img"));

        let passed = 0;
        let missing = 0;
        let empty = 0;

        const items: ImageItem[] = imgElements.map((img) => {
          const hasAltAttr = img.hasAttribute("alt");
          const altVal = img.getAttribute("alt");
          const src = img.getAttribute("src") || img.getAttribute("data-src") || "(inline/base64 image)";

          if (!hasAltAttr) {
            missing++;
            return {
              src,
              alt: null,
              hasAlt: false,
              isDecorative: false,
              length: 0,
              status: "fail",
              message: "Missing 'alt' attribute completely. Critical accessibility & SEO issue.",
            };
          }

          const trimmedAlt = altVal?.trim() || "";
          if (trimmedAlt.length === 0) {
            empty++;
            return {
              src,
              alt: "",
              hasAlt: true,
              isDecorative: true,
              length: 0,
              status: "warn",
              message: "Empty alt='' (Decorative image). Ensure this image contains no informative text.",
            };
          }

          passed++;
          return {
            src,
            alt: trimmedAlt,
            hasAlt: true,
            isDecorative: false,
            length: trimmedAlt.length,
            status: "pass",
            message: "Valid descriptive alt text.",
          };
        });

        setResult({
          totalImages: imgElements.length,
          passedImages: passed,
          missingAltCount: missing,
          emptyAltCount: empty,
          images: items,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to analyze images.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyMissing() {
    if (!result) return;
    const missingItems = result.images.filter((i) => i.status === "fail");
    if (missingItems.length === 0) return;

    const lines = missingItems.map((i) => i.src);
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedMissing(true);
    setTimeout(() => setCopiedMissing(false), 2000);
  }

  const filteredImages = result
    ? filter === "all"
      ? result.images
      : filter === "missing"
      ? result.images.filter((i) => i.status === "fail")
      : filter === "valid"
      ? result.images.filter((i) => i.status === "pass")
      : result.images.filter((i) => i.status === "warn")
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

        <form onSubmit={handleCheck} className="space-y-4">
          {mode === "url" ? (
            <div className="space-y-2">
              <label htmlFor="image-url-input" className="block text-sm font-bold text-slate-800">
                Enter Website URL to Audit Image Alt Tags & Image SEO
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Globe className="h-5 w-5" />
                </div>
                <input
                  id="image-url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full rounded-2xl border border-orange-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="image-html-input" className="block text-sm font-bold text-slate-800">
                Paste HTML Code Containing &lt;img&gt; Tags
              </label>
              <textarea
                id="image-html-input"
                rows={6}
                placeholder="<img src='banner.jpg' alt='Summer Sale Banner'>"
                value={rawHtml}
                onChange={(e) => setRawHtml(e.target.value)}
                className="w-full rounded-2xl border border-orange-200 bg-white p-4 text-xs font-mono text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? <Spinner label="Auditing page images..." /> : <Search className="h-4 w-4" />}
            <span>Check Image Alt Tags</span>
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
          {/* Summary Metric Cards */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-2xl border p-4 text-center transition-all ${
                filter === "all" ? "border-orange-500 bg-orange-50/50 shadow-xs" : "border-slate-100 bg-white hover:bg-slate-50"
              }`}
            >
              <span className="block text-2xl font-black text-slate-900">{result.totalImages}</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Total Images</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("valid")}
              className={`rounded-2xl border p-4 text-center transition-all ${
                filter === "valid" ? "border-emerald-500 bg-emerald-50 shadow-xs" : "border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/60"
              }`}
            >
              <span className="block text-2xl font-black text-emerald-600">{result.passedImages}</span>
              <span className="text-xs font-bold text-emerald-700 uppercase">Valid Alt Text</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("missing")}
              className={`rounded-2xl border p-4 text-center transition-all ${
                filter === "missing" ? "border-red-500 bg-red-50 shadow-xs" : "border-red-100 bg-red-50/30 hover:bg-red-50/60"
              }`}
            >
              <span className="block text-2xl font-black text-red-600">{result.missingAltCount}</span>
              <span className="text-xs font-bold text-red-700 uppercase">Missing Alt Tags</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("decorative")}
              className={`rounded-2xl border p-4 text-center transition-all ${
                filter === "decorative" ? "border-amber-500 bg-amber-50 shadow-xs" : "border-amber-100 bg-amber-50/30 hover:bg-amber-50/60"
              }`}
            >
              <span className="block text-2xl font-black text-amber-600">{result.emptyAltCount}</span>
              <span className="text-xs font-bold text-amber-700 uppercase">Decorative (alt=&quot;&quot;)</span>
            </button>
          </div>

          {/* Image List Container */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-orange-600" /> Extracted Webpage Images ({filteredImages.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filter === "all" ? "all images" : filter} extracted from the page source
                </p>
              </div>

              {result.missingAltCount > 0 && (
                <button
                  type="button"
                  onClick={handleCopyMissing}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-all"
                >
                  {copiedMissing ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied Missing URLs!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-red-600" />
                      <span>Copy Missing Alt Image URLs</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {filteredImages.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-6 text-center">
                No images found matching filter &quot;{filter}&quot;.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
                      img.status === "pass"
                        ? "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40"
                        : img.status === "warn"
                        ? "border-amber-200 bg-amber-50/20 hover:bg-amber-50/40"
                        : "border-red-200 bg-red-50/20 hover:bg-red-50/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="text-xs font-mono font-semibold text-slate-800 truncate" title={img.src}>
                            {img.src.split("/").pop() || img.src}
                          </span>
                        </div>

                        {img.status === "pass" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                            <Check className="h-3 w-3" /> Valid Alt
                          </span>
                        )}
                        {img.status === "warn" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full shrink-0">
                            <AlertTriangle className="h-3 w-3" /> Decorative
                          </span>
                        )}
                        {img.status === "fail" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full shrink-0">
                            <X className="h-3 w-3" /> Missing Alt
                          </span>
                        )}
                      </div>

                      {/* Image Source Link */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                        <span className="font-bold text-slate-600 shrink-0">URL:</span>
                        <a
                          href={img.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline truncate inline-flex items-center gap-1"
                        >
                          <span className="truncate">{img.src}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>

                      {/* Alt Attribute Value */}
                      <div className="text-xs bg-white/80 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-700">Alt Tag:</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {img.length} chars
                          </span>
                        </div>

                        <div>
                          {img.alt === null ? (
                            <span className="font-mono text-red-600 font-bold bg-red-100/60 px-2 py-0.5 rounded text-[11px]">
                              None (Missing Tag)
                            </span>
                          ) : img.alt === "" ? (
                            <span className="font-mono text-amber-600 font-bold bg-amber-100/60 px-2 py-0.5 rounded text-[11px]">
                              &quot;&quot; (Empty decorative string)
                            </span>
                          ) : (
                            <p className="font-medium text-slate-900 break-words text-xs">
                              &quot;{img.alt}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic pt-1">
                      {img.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
