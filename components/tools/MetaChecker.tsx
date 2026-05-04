"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  descriptionCharClass,
  titleCharClass,
} from "@/lib/metaScore";
import { useMetaChecker } from "@/hooks/useMetaChecker";
import { Spinner } from "@/components/ui/Spinner";

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
  } = useMetaChecker();

  const [serpVariant, setSerpVariant] = useState<SerpVariant>("desktop");
  const [copied, setCopied] = useState<"title" | "description" | null>(null);
  const processedUrl = useRef<string | null>(null);

  const urlParam = searchParams.get("url");

  useEffect(() => {
    if (!urlParam) return;
    setMode("url");
    setUrlInput(urlParam);
    if (processedUrl.current === urlParam) return;
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
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for HTTP / iframe / old Safari where clipboard API is blocked
      const el = document.createElement("textarea");
      el.value = value;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(el);
      }
    }
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`rounded-input px-4 py-2 text-sm font-medium ${
            mode === "text"
              ? "bg-primary text-white"
              : "border border-slate-200 bg-white text-navy"
          }`}
          aria-pressed={mode === "text"}
          aria-label="Manual text input mode"
        >
          Manual input
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`rounded-input px-4 py-2 text-sm font-medium ${
            mode === "url"
              ? "bg-primary text-white"
              : "border border-slate-200 bg-white text-navy"
          }`}
          aria-pressed={mode === "url"}
          aria-label="Fetch from URL mode"
        >
          Fetch from URL
        </button>
      </div>

      {mode === "url" ? (
        <div className="space-y-3">
          <label htmlFor="meta-url" className="block text-sm font-medium text-navy">
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
              className="w-full flex-1 rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
            />
            <button
              type="button"
              onClick={() => void onFetch()}
              disabled={loading}
              className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              aria-label="Fetch meta tags from URL"
            >
              {loading ? "Fetching…" : "Fetch"}
            </button>
          </div>
          {loading ? <Spinner label="Fetching page meta tags…" /> : null}
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="meta-title" className="text-sm font-medium text-navy">
              Meta title
            </label>
            <span
              className={`text-sm font-semibold ${titleCharClass(title.length)}`}
            >
              {title.length} chars · {titleScore.score}/100
            </span>
          </div>
          <textarea
            id="meta-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            className="w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          />
          <p className="text-sm text-body">{titleScore.message}</p>
          <button
            type="button"
            onClick={() => void copyField("title")}
            className="rounded-input border border-slate-200 px-3 py-1.5 text-xs font-semibold text-primary"
            aria-label="Copy meta title to clipboard"
          >
            {copied === "title" ? "Copied" : "Copy title"}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="meta-description"
              className="text-sm font-medium text-navy"
            >
              Meta description
            </label>
            <span
              className={`text-sm font-semibold ${descriptionCharClass(description.length)}`}
            >
              {description.length} chars · {descriptionScore.score}/100
            </span>
          </div>
          <textarea
            id="meta-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          />
          <p className="text-sm text-body">{descriptionScore.message}</p>
          <button
            type="button"
            onClick={() => void copyField("description")}
            className="rounded-input border border-slate-200 px-3 py-1.5 text-xs font-semibold text-primary"
            aria-label="Copy meta description to clipboard"
          >
            {copied === "description" ? "Copied" : "Copy description"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-navy">SERP preview</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSerpVariant("desktop")}
              className={`rounded-badge px-3 py-1 text-xs font-semibold ${
                serpVariant === "desktop"
                  ? "bg-primary text-white"
                  : "bg-surface text-navy"
              }`}
              aria-pressed={serpVariant === "desktop"}
              aria-label="Desktop SERP preview"
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setSerpVariant("mobile")}
              className={`rounded-badge px-3 py-1 text-xs font-semibold ${
                serpVariant === "mobile"
                  ? "bg-primary text-white"
                  : "bg-surface text-navy"
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
            className={`rounded-card border border-slate-200 bg-white p-4 shadow-sm ${previewWidth}`}
          >
            <p
              className={`line-clamp-2 font-[Arial,sans-serif] text-serpTitle ${titleSize}`}
            >
              {title || "Your title appears here"}
            </p>
            <p className="mt-1 truncate text-sm text-body">{displayUrl}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body">
              {description || "Your meta description will appear here — aim for 120–160 characters."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
