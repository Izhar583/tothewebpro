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
import { X, Copy, Check, ChevronDown, ChevronUp, ShieldCheck, HelpCircle, Cpu, BookOpen, ListChecks, UserCheck, Globe, Search, Share2, Sparkles, FileText, Link as LinkIcon } from "lucide-react";

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
              serpVariant === "desktop" ? "w-[600px] max-w-[600px]" : "w-[400px] max-w-[400px]"
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
              className="hover:underline cursor-pointer transition-all"
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

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-orange-100 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-sm hover:border-orange-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-orange-600 transition-colors"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange-500 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
        )}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-orange-50/50" : "max-h-0"
        }`}
      >
        <div className="p-5 text-sm text-slate-600 leading-relaxed font-medium bg-orange-50/10">
          {answer}
        </div>
      </div>
    </div>
  );
}

function MetaCheckerLandingPage() {
  return (
    <div className="mt-16 pt-16 border-t border-orange-100 space-y-16">
      {/* H1 Section */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Professional SEO Tool
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight md:text-4xl">
          Free Online Meta Tag Checker: Instantly Audit Your SEO Meta Tags
        </h2>
        <div className="max-w-4xl text-slate-600 space-y-4 font-medium leading-relaxed">
          <p>
            Stop guessing whether your title tags and meta descriptions are optimized. Paste a URL or raw HTML into ToTheWebPro&apos;s Meta Tag Checker and get a pixel-accurate, character-accurate breakdown in under two seconds, with no login, no API key, and no nonsense.
          </p>
          <p>
            Broken or over-length meta tags silently destroy click-through rates. Most developers only catch these errors after a page has already been indexed incorrectly.
          </p>
        </div>

        {/* Quick Value Hook Alert */}
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/55 to-amber-50/35 p-6 flex gap-4 shadow-sm items-start">
          <div className="p-2.5 bg-white rounded-xl border border-orange-100 text-orange-600 shadow-lift shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Secure Client-Side Processing</h4>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed font-medium">
              <strong>ToTheWebPro&apos;s Meta Tag Checker runs 100% client-side</strong>. Your URL, HTML source, and meta content never leave your browser, never touch a server, and are never logged. Unlike cloud-based SEO crawlers that queue your requests and retain your data, this tool processes everything locally at native browser speed.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - What is a Meta Tag Checker */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          What Is a Meta Tag Checker and How Does It Work?
        </h3>
        <div className="max-w-4xl text-slate-600 font-medium leading-relaxed">
          <p>
            A <strong>meta tag checker</strong> is a diagnostic tool that parses the <code>&lt;head&gt;</code> section of an HTML document and extracts, evaluates, and validates the SEO-critical metadata, specifically the <code>&lt;title&gt;</code> tag, <code>&lt;meta name=&quot;description&quot;&gt;</code>, canonical tags, Open Graph tags, Twitter Card tags, and robots directives. The tool then measures each value against known search engine rendering limits and flags anything outside the acceptable range.
          </p>
          <p className="mt-4">
            Google does not truncate meta tags by raw character count. It truncates by <strong>rendered pixel width</strong>, a critical distinction most generic tools get wrong. A 60-character title using wide glyphs (W, M, uppercase letters) can overflow the SERP snippet just as easily as a 70-character title built from narrow characters (i, l, t, 1).
          </p>
        </div>

        {/* Input/Output Mechanics Table */}
        <div className="mt-6 space-y-3">
          <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-orange-500" />
            Input/Output Mechanics
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/50 border-b border-orange-100">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Input</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3">What the Tool Reads</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-5/12">Output / Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 text-sm font-medium text-slate-700">
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Live URL</td>
                  <td className="p-4">Fetches raw HTML source, parses <code>&lt;head&gt;</code></td>
                  <td className="p-4">Extracted tag values + status flags</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Pasted HTML</td>
                  <td className="p-4">Parses the <code>&lt;head&gt;</code> block directly</td>
                  <td className="p-4">Extracted tag values + status flags</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Title Tag</td>
                  <td className="p-4"><code>&lt;title&gt;</code> content</td>
                  <td className="p-4 text-slate-600">Character count, estimated pixel width, <span className="text-emerald-600 font-bold">Optimal</span> / <span className="text-amber-500 font-bold">Too Long</span> / <span className="text-red-500 font-bold">Too Short</span> status</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Meta Description</td>
                  <td className="p-4"><code>&lt;meta name=&quot;description&quot; content=&quot;...&quot;&gt;</code></td>
                  <td className="p-4 text-slate-600">Character count, pixel width estimate, truncation risk flag</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Canonical Tag</td>
                  <td className="p-4"><code>&lt;link rel=&quot;canonical&quot; href=&quot;...&quot;&gt;</code></td>
                  <td className="p-4 text-slate-600">Present / Missing / Self-referencing</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Robots Meta</td>
                  <td className="p-4"><code>&lt;meta name=&quot;robots&quot; content=&quot;...&quot;&gt;</code></td>
                  <td className="p-4 text-slate-600">Indexing directive (index/noindex, follow/nofollow)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Open Graph Tags</td>
                  <td className="p-4"><code>og:title</code>, <code>og:description</code>, <code>og:image</code></td>
                  <td className="p-4 text-slate-600">Present / Missing per property</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Twitter Card Tags</td>
                  <td className="p-4"><code>twitter:card</code>, <code>twitter:title</code>, <code>twitter:description</code></td>
                  <td className="p-4 text-slate-600">Present / Missing per property</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* H2 - Step-by-Step Guide */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange-500" />
          Step-by-Step Guide: How to Use the ToTheWebPro Meta Tag Checker
        </h3>
        <p className="max-w-3xl text-slate-600 font-medium">
          The tool is designed for zero-friction auditing. No account. No extension. No crawl delay. Here is the exact workflow:
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              1
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Choose Your Input Method</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Navigate to the Meta Tag Checker on ToTheWebPro. You will see two input modes: <strong>URL Input</strong> and <strong>HTML Source Input</strong>. If you want to check a live, publicly accessible page, select URL. If you are auditing a page in staging, a local build, or a client&apos;s draft, paste the raw HTML directly.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              2
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Enter Your URL or Paste Your HTML</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              For URL mode: type or paste the full URL including <code>https://</code>. For HTML mode: copy the entire <code>&lt;head&gt;...&lt;/head&gt;</code> block from your source code and paste it into the text area. You do not need the full page; just the <code>&lt;head&gt;</code> is sufficient.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              3
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Run the Audit</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Click the <strong>&quot;Check Meta Tags&quot;</strong> button. The tool parses the input locally in your browser using the native DOM parser API. Results appear within milliseconds, with no server round-trip, no spinner, and no wait.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              4
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Read Your Results Panel</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              The results panel displays each meta tag in its own card. Each card shows the extracted raw value, the character count, the estimated rendered pixel width, and a color-coded status: <strong>Green (Optimal)</strong>, <strong>Yellow (Warning)</strong>, <strong>Red (Critical)</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              5
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Fix and Re-Check</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Edit your title or description, re-paste the updated HTML, and re-run the check. Because everything processes client-side, iteration is instant. Treat it as a live scratchpad until every tag shows green.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - Why Technical Accuracy Matters */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-orange-500" />
          Why Technical Accuracy Matters for Meta Tag Optimization
        </h3>
        <p className="max-w-3xl text-slate-600 font-medium">
          Most developers rely on the &quot;60 characters for title, 160 for description&quot; rule. That rule is a useful shortcut — but it is not what Google actually enforces, and treating it as gospel leads to optimization errors at scale.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Google&apos;s Pixel-Width Threshold, Not Character Limit</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Google&apos;s desktop SERP title truncation threshold is approximately <strong>600px</strong> of rendered width, using a proportional-width font (Google uses Arial in its rendering engine for truncation calculations). This means a title like &quot;WWW Multimedia Web Development&quot; (31 characters, wide glyphs) can render wider than &quot;A Technical Introduction to SEO Principles and Metadata&quot; (54 characters, mixed-width glyphs). The only way to accurately predict truncation is to simulate pixel rendering, which is exactly what ToTheWebPro&apos;s checker does via an off-screen <code>&lt;canvas&gt;</code> measurement.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Meta Descriptions and CTR Economics</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Google rewrites meta descriptions approximately <strong>62.78% of the time</strong> (according to Portent&apos;s 2020 meta description study, the most cited figure in the SEO industry). However, when Google <em>does</em> display your authored description, its pixel threshold sits around <strong>920px</strong> on desktop. A description that gets cut off mid-sentence performs demonstrably worse in click-through rate than one ending cleanly.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <LinkIcon className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Canonical Tags and Duplicate Content</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              A missing or incorrect <code>rel=canonical</code> tag is one of the top causes of unintentional duplicate content indexing. Canonical tags must use absolute URLs and not relative paths. A relative canonical (<code>/page</code>) is technically valid per the HTML spec but introduces parser ambiguity in some Googlebot versions. The checker flags relative canonicals as warnings for this reason.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Robots Meta and Crawl Logic</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              A single <code>&lt;meta name=&quot;robots&quot; content=&quot;noindex&quot;&gt;</code> on a page overrides any <code>Allow</code> directive in <code>robots.txt</code>. Developers frequently add noindex to staging pages and ship those pages to production unchanged. The checker surfaces the robots directive prominently so this class of error is impossible to miss.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <Share2 className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Open Graph and Twitter Card Completeness</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Social media previews are controlled entirely by OG and Twitter Card tags and not by your title or description. A page missing <code>og:image</code> will render a blank preview card on LinkedIn and Facebook, directly suppressing share-driven traffic. The checker audits all seven core OG properties and all four core Twitter Card properties so you never publish a socially invisible page.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - Key Features */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Key Features of Our Free Online Meta Tag Checker
        </h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Pixel-Width Simulation</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Uses an off-screen Canvas API rendering pass to approximate Google&apos;s actual SERP truncation behavior, not a raw character count heuristic.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Dual Input: URL + Raw HTML</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Check live production pages or audit staging builds without deploying. Paste any valid HTML fragment from a local file, CMS preview, or build pipeline output.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Client-Side Processing</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                The entire parsing, rendering simulation, and validation logic executes in your browser. Zero data is transmitted to any server, zero requests are logged on Vercel&apos;s infrastructure, and zero meta content is ever stored or analyzed remotely.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Full Social Tag Audit</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Covers Open Graph (<code>og:title</code>, <code>og:description</code>, <code>og:image</code>, <code>og:type</code>, <code>og:url</code>, <code>og:site_name</code>) and Twitter Card (<code>twitter:card</code>, <code>twitter:title</code>, <code>twitter:description</code>, <code>twitter:image</code>) in a single pass.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Instant Re-Check Iteration</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                No rate limits, no crawl queues, no cooldown periods. Check the same page 50 times in a row while you refine your copy. It costs zero requests.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Mobile-Responsive Interface</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Works accurately on any screen size. Run quick audits from a phone or tablet without UI degradation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H2 - Semantic Context & Use Cases */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-orange-500" />
          Semantic Context &amp; Use Cases: Who Needs a Meta Tag Checker?
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">SEO Professionals and Consultants</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              On-page audits across multi-hundred-page sites require a reliable, repeatable spot-check workflow. Use the checker during content briefs to pre-validate titles before publishing, during technical audits to surface missing canonicals, and during post-migration QA to confirm that noindex tags were not accidentally carried over from staging.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Web Developers and Front-End Engineers</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              You build the templates, but CMS content editors populate the title and description fields. The checker lets you validate that your meta tag implementation renders correctly with real content values, not just your placeholder copy. It is the fastest way to confirm that a dynamic title tag built in Next.js, Nuxt, or a custom CMS template is producing correct output before deployment.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Content Writers and Editors</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Writing a 65-character title that gets truncated to 58 characters on the SERP is a copywriting loss, not just an SEO loss. Use the tool as a real-time character and pixel counter while drafting titles and descriptions, the same way a designer uses a ruler. No SEO expertise required to interpret the color-coded results.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">E-Commerce Managers and Product Teams</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Product pages at scale, across hundreds or thousands of SKUs, are particularly vulnerable to auto-generated meta titles that overflow. Check template outputs against real product names, especially for long-tail product titles. A single broken title template replicated across 500 product pages is a significant SERP presentation problem.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Digital Marketing Agencies</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Client deliverables need a verifiable audit trail. Screenshot the results panel for each priority page and include it in your monthly SEO report. The clean, card-based output is designed to be legible to non-technical stakeholders without requiring explanation.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - FAQs */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-orange-500" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4 max-w-4xl mt-6">
          <FaqAccordionItem
            question="What is the ideal length for a title tag in 2025?"
            answer="The technically accurate answer is that Google truncates title tags at approximately 600 rendered pixels on desktop SERPs, not at a fixed character count. In practical terms, this corresponds to roughly 50–60 characters for mixed-case Latin text. However, because pixel width depends on the specific characters used, the only reliable way to check is with a pixel-width simulation tool and not a character counter alone."
          />
          <FaqAccordionItem
            question="Does Google always use my meta description in search results?"
            answer="No. Research consistently shows Google rewrites or ignores authored meta descriptions in the majority of cases, pulling alternative text from the page body that better matches the search query. Despite this, writing a well-crafted meta description remains best practice: when Google does display it, it directly influences click-through rate, and it signals topical relevance to search quality evaluators."
          />
          <FaqAccordionItem
            question="What happens if my page has no meta description tag?"
            answer="Google will auto-generate a snippet from the visible page body content, typically selecting text that appears most relevant to the specific query triggering the impression. This auto-generated snippet is often less compelling than a crafted description and may vary unpredictably across different queries. Missing meta descriptions are a controllable CTR risk and should be treated as a P1 fix on any high-traffic page."
          />
          <FaqAccordionItem
            question="What is a canonical tag and why does it matter for SEO?"
            answer="A canonical tag (<link rel=&quot;canonical&quot; href=&quot;...&quot;>) tells search engines which URL is the preferred, authoritative version of a page when multiple URLs serve similar or identical content. Without it, or with an incorrect value, crawl budget is wasted, link equity is diluted across duplicate URLs, and ranking signals are split rather than consolidated. Self-referencing canonicals on unique pages are considered a confirmed best practice by Google."
          />
          <FaqAccordionItem
            question="Is this meta tag checker tool completely free?"
            answer="Yes. ToTheWebPro's Meta Tag Checker is free with no usage limits, no account requirement, and no premium tier. Because the tool runs entirely in your browser with no server processing, there is no infrastructure cost per check, and that saving is passed directly to the user as unlimited free access."
          />
        </div>
      </section>
    </div>
  );
}