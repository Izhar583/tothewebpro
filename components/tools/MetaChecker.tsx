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
import { MetaCheckerLandingPage } from "./MetaCheckerLandingPage";

type SerpVariant = "desktop" | "mobile";

function StatusCircleIcon({ type }: { type: "green" | "amber" | "red" }) {
  if (type === "green") {
    return (
      <svg className="h-5 w-5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
      </svg>
    );
  }
  if (type === "amber") {
    return (
      <svg className="h-5 w-5 text-amber-500 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
}

function truncateTextByPixels(text: string, font: string, maxPixels: number): string {
  if (typeof window === "undefined" || !text) return text || "";
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return text;
    ctx.font = font;
    if (ctx.measureText(text).width <= maxPixels) {
      return text;
    }
    const words = text.split(/\s+/);
    let currentText = "";
    for (let i = 0; i < words.length; i++) {
      const testText = currentText ? `${currentText} ${words[i]}` : words[i];
      const testWidth = ctx.measureText(`${testText} ...`).width;
      if (testWidth > maxPixels) {
        if (currentText === "") {
          let charIndex = words[i].length;
          while (charIndex > 0) {
            const charTest = words[i].substring(0, charIndex) + "...";
            if (ctx.measureText(charTest).width <= maxPixels) {
              return charTest;
            }
            charIndex--;
          }
          return "...";
        }
        break;
      }
      currentText = testText;
    }
    return currentText + " ...";
  } catch {
    return text;
  }
}

function PixelProgressBar({ value, max, color }: { value: number; max: number; color: "green" | "amber" | "red" }) {
  const percentage = Math.min(100, (value / max) * 100);
  const barColor = color === "green" 
    ? "bg-emerald-500" 
    : color === "amber"
    ? "bg-amber-500"
    : "bg-red-500";
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5 relative">
      <div 
        className={`h-full transition-all duration-300 ease-out ${barColor}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

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
    titlePixelWidth,
    descPixelWidth,
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

  // Title and Description State computed directly from the hook scoring
  const titlePixelState = useMemo(() => {
    const w = titlePixelWidth;
    const scoreColor = titleScore.color;
    const colorClass = scoreColor === "green" 
      ? "text-emerald-600 font-medium flex items-center gap-2" 
      : scoreColor === "amber"
      ? "text-amber-500 font-medium flex items-center gap-2"
      : "text-red-500 font-medium flex items-center gap-2";
    return {
      color: colorClass,
      message: `Page title is ${w} pixel(s) long — ${titleScore.message}`,
      type: scoreColor
    };
  }, [titlePixelWidth, titleScore]);

  const descPixelState = useMemo(() => {
    const w = descPixelWidth;
    const scoreColor = descriptionScore.color;
    const colorClass = scoreColor === "green" 
      ? "text-emerald-600 font-medium flex items-center gap-2" 
      : scoreColor === "amber"
      ? "text-amber-500 font-medium flex items-center gap-2"
      : "text-red-500 font-medium flex items-center gap-2";
    return {
      color: colorClass,
      message: `Meta description is ${w} pixel(s) long — ${descriptionScore.message}`,
      type: scoreColor
    };
  }, [descPixelWidth, descriptionScore]);

  // Word-boundary truncated text for desktop and mobile preview rendering
  const previewTitleDesktop = useMemo(() => {
    return truncateTextByPixels(title || "Your title appears here", "20px Arial", 580);
  }, [title]);

  const previewTitleMobile = useMemo(() => {
    return truncateTextByPixels(title || "Your title appears here", "20px Arial", 640);
  }, [title]);

  const previewDescDesktop = useMemo(() => {
    return truncateTextByPixels(description || "Your meta description will appear here — aim for 120–160 characters.", "13px Arial", 920);
  }, [description]);

  const previewDescMobile = useMemo(() => {
    return truncateTextByPixels(description || "Your mobile meta description will appear here...", "13px Arial", 680);
  }, [description]);

  const formattedBreadcrumb = useMemo(() => {
    const domainAndPath = displayUrl || "www.example.com";
    return domainAndPath.split("/").join(" › ");
  }, [displayUrl]);

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
          {/* Title Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="meta-title" className="text-sm font-bold text-slate-700">
                Meta title
              </label>
              <span
                className={`text-xs font-bold ${titleCharClass(title.length, titlePixelWidth)}`}
              >
                {title.length} chars &middot; {titlePixelWidth}px / 580px limit &middot; Score: {titleScore.score}/100
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
            {title && (
              <PixelProgressBar 
                value={titlePixelWidth} 
                max={580} 
                color={titleScore.color} 
              />
            )}
            {/* Visual Pixel Indicator */}
            {title && (
              <div className={`mt-2 flex items-start gap-2 text-sm ${titlePixelState.color}`} role="status">
                <StatusCircleIcon type={titlePixelState.type} />
                <span>
                  Page title is <strong className="font-extrabold">{titlePixelWidth}</strong> pixel(s) long — {titlePixelState.message.split(" — ")[1]}
                </span>
              </div>
            )}
            <p className="text-xs text-slate-500 font-semibold mt-1">{titleScore.message}</p>
          </div>

          {/* Display URL */}
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

        {/* Description Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="meta-desc" className="text-sm font-bold text-slate-700">
              Meta description
            </label>
            <span
              className={`text-xs font-bold ${descriptionCharClass(description.length, descPixelWidth)}`}
            >
              {description.length} chars &middot; {descPixelWidth}px / 920px limit &middot; Score: {descriptionScore.score}/100
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
          {description && (
            <PixelProgressBar 
              value={descPixelWidth} 
              max={920} 
              color={descriptionScore.color} 
            />
          )}
          {/* Visual Pixel Indicator */}
          {description && (
            <div className={`mt-2 flex items-start gap-2 text-sm ${descPixelState.color}`} role="status">
              <StatusCircleIcon type={descPixelState.type} />
              <span>
                Meta description is <strong className="font-extrabold">{descPixelWidth}</strong> pixel(s) long — {descPixelState.message.split(" — ")[1]}
              </span>
            </div>
          )}
          <p className="text-xs text-slate-500 font-semibold mt-1">{descriptionScore.message}</p>
        </div>

        {/* Copy Controls */}
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

      {/* SERP Preview Area */}
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
            className={`rounded-xl border border-orange-100 bg-white p-6 shadow-sm transition-all duration-300 ${
              serpVariant === "desktop" ? "w-[648px] max-w-[648px]" : "w-[400px] max-w-[400px]"
            }`}
          >
            {/* Title */}
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "20px",
                color: title ? "#1a0dab" : "#94a3b8",
                lineHeight: "1.3",
                fontWeight: "normal",
              }}
              className={`hover:underline cursor-pointer transition-all ${
                serpVariant === "desktop" ? "whitespace-nowrap overflow-hidden text-ellipsis" : "line-clamp-2 overflow-hidden"
              }`}
            >
              {serpVariant === "desktop" ? previewTitleDesktop : previewTitleMobile}
            </p>

            {/* URL/breadcrumb */}
            <p
              className="mt-1 truncate"
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                color: "#202124",
              }}
            >
              {formattedBreadcrumb}
            </p>

            {/* Description */}
            <p
              className="mt-2"
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "13px",
                color: description ? "#4d5156" : "#94a3b8",
                lineHeight: "1.57",
              }}
            >
              {serpVariant === "desktop" ? previewDescDesktop : previewDescMobile}
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

      <MetaCheckerLandingPage />
    </div>
  );
}