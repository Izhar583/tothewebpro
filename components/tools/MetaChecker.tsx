"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  descriptionCharClass,
  titleCharClass,
} from "@/lib/metaScore";
import { useMetaChecker } from "@/hooks/useMetaChecker";
import { Spinner } from "@/components/ui/Spinner";
import { copyToClipboard } from "@/lib/clipboard";
import { X, Copy, Check } from "lucide-react";

type SerpVariant = "desktop" | "mobile";

export function MetaChecker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    mode,
    setMode,
    title,
    setTitle,
    description,
    setDescription,
    urlInput,
    setUrlInput,
    loading,
    error,
    setError,
    fetchMeta,
    titleScore,
    descriptionScore,
    h1s,
    robots,
    ogImage,
    wordCount,
  } = useMetaChecker();

  const [serpVariant, setSerpVariant] = useState<SerpVariant>("desktop");
  const [copied, setCopied] = useState<"title" | "description" | null>(null);
  const processedUrl = useRef<string | null>(null);

  const urlParam = searchParams.get("url");

  useEffect(() => {
    if (!urlParam) return;
    if (processedUrl.current === urlParam) return;

    setMode("url");
    setUrlInput(urlParam);

    void (async () => {
      const ok = await fetchMeta(urlParam);
      if (ok) {
        processedUrl.current = urlParam;
      }
    })();
  }, [urlParam, fetchMeta, setMode, setUrlInput]);

  const previewWidth = serpVariant === "desktop" ? "max-w-[600px]" : "max-w-[360px]";
  const titleSize =
    serpVariant === "desktop" ? "text-xl leading-7" : "text-lg leading-6";

  const displayUrl = useMemo(() => {
    try {
      if (mode === "url" && urlInput) {
        const u = new URL(
          /^https?:\/\//i.test(urlInput) ? urlInput : `https://${urlInput}`,
        );
        return u.hostname + u.pathname.replace(/\/$/, "");
      }
    } catch {
      /* ignore */
    }
    return "www.example.com/page";
  }, [mode, urlInput]);

  async function onFetch() {
    setError(null);
    const fetched = await fetchMeta(urlInput);
    if (fetched) {
      processedUrl.current = fetched;
      router.push(
        `/tools/meta-title-description-checker?url=${encodeURIComponent(fetched)}`,
      );
    }
  }

  async function copyField(field: "title" | "description") {
    const value = field === "title" ? title : description;
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  function onClear() {
    setTitle("");
    setDescription("");
    setError(null);
    if (mode === "url") {
      setUrlInput("");
      processedUrl.current = null;
      router.push("/tools/meta-title-description-checker");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              mode === "text"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                : "border border-orange-100 bg-white text-slate-600 hover:bg-orange-50 hover:border-orange-200"
            }`}
            aria-pressed={mode === "text"}
            aria-label="Manual text input mode"
          >
            Manual input
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              mode === "url"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                : "border border-orange-100 bg-white text-slate-600 hover:bg-orange-50 hover:border-orange-200"
            }`}
            aria-pressed={mode === "url"}
            aria-label="Fetch from URL mode"
          >
            Fetch from URL
          </button>
        </div>

        {(title || description || urlInput) && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {mode === "url" ? (
        <div className="space-y-3">
          <label htmlFor="meta-url" className="block text-sm font-bold text-slate-700">
            Page URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="meta-url"
              type="url"
              inputMode="url"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full flex-1 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
            />
            <button
              type="button"
              onClick={() => void onFetch()}
              disabled={loading}
              className="rounded-xl bg-orange-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-all"
              aria-label="Fetch meta tags from URL"
            >
              {loading ? "Fetching..." : "Fetch"}
            </button>
          </div>
          {loading ? <Spinner label="Fetching page meta tags..." /> : null}
          {error ? (
            <p className="text-sm text-red-600 font-medium" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="meta-title" className="text-sm font-bold text-slate-700">
                Meta title
              </label>
              <span
                className={`text-sm font-bold ${titleCharClass(title.length)}`}
              >
                {title.length} chars &middot; {titleScore.score}/100
              </span>
            </div>
            <textarea
              id="meta-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
              placeholder="Enter page title..."
            />
            <p className="text-xs text-slate-500 font-medium">{titleScore.message}</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="display-url" className="text-sm font-bold text-slate-700">
              Display URL (for preview)
            </label>
            <input
              id="display-url"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
              placeholder="www.example.com/page-path"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="meta-desc" className="text-sm font-bold text-slate-700">
              Meta description
            </label>
            <span
              className={`text-sm font-bold ${descriptionCharClass(description.length)}`}
            >
              {description.length} chars &middot; {descriptionScore.score}/100
            </span>
          </div>
          <textarea
            id="meta-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
            placeholder="Enter meta description..."
          />
          <p className="text-xs text-slate-500 font-medium">{descriptionScore.message}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void copyField("title")}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all ${
              copied === "title"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-orange-100 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-200"
            }`}
            aria-label="Copy meta title to clipboard"
          >
            {copied === "title" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === "title" ? "Copied" : "Copy title"}
          </button>
          <button
            type="button"
            onClick={() => void copyField("description")}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all ${
              copied === "description"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-orange-100 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-200"
            }`}
            aria-label="Copy meta description to clipboard"
          >
            {copied === "description" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === "description" ? "Copied" : "Copy description"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-slate-800">SERP preview</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSerpVariant("desktop")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                serpVariant === "desktop"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-slate-500 hover:text-orange-600 border border-orange-100"
              }`}
              aria-pressed={serpVariant === "desktop"}
              aria-label="Desktop SERP preview"
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setSerpVariant("mobile")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                serpVariant === "mobile"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-slate-500 hover:text-orange-600 border border-orange-100"
              }`}
              aria-pressed={serpVariant === "mobile"}
              aria-label="Mobile SERP preview"
            >
              Mobile
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className={`rounded-xl border border-orange-100 bg-white p-6 shadow-sm ${previewWidth}`}
          >
            <p
              className={`line-clamp-2 font-[Arial,sans-serif] text-xl leading-7 ${titleSize} ${title ? "text-blue-700" : "text-slate-400"}`}
            >
              {title || "Your title appears here"}
            </p>
            <p className="mt-1 truncate text-sm text-green-700">{displayUrl}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {description || "Your meta description will appear here — aim for 120–160 characters."}
            </p>
          </div>
        </div>
      </div>

      {(h1s.length > 0 || robots || ogImage) && (
        <div className="space-y-6 pt-8 border-t border-orange-100">
          <h3 className="text-xl font-black text-slate-900">Extended SEO Analysis</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {h1s.length > 0 && (
              <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">H1 Headings ({h1s.length})</h4>
                <ul className="space-y-3">
                  {h1s.map((h1, i) => (
                    <li key={i} className="text-sm font-bold text-slate-800 flex gap-3">
                      <span className="text-orange-500">H1</span>
                      {h1}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-6">
              <>
                {robots && (
                  <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Robots Meta</h4>
                    <p className="text-sm font-black text-orange-600">{robots}</p>
                  </div>
                )}
                {wordCount > 0 && (
                  <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Word Count</h4>
                    <p className="text-sm font-black text-orange-600">{wordCount} words</p>
                  </div>
                )}
              </>
              {ogImage && (
                <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Social Preview Image</h4>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ogImage} alt="OG Preview" className="rounded-xl border border-orange-100 w-full h-auto max-h-48 object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}