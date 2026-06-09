"use client";

import { useCallback, useMemo, useState } from "react";
import type { FetchMetaResponse } from "@/lib/types";
import {
  scoreDescription,
  scoreTitle,
  getTextWidth,
} from "@/lib/metaScore";

export type InputMode = "text" | "url";

export function useMetaChecker() {
  const [mode, setMode] = useState<InputMode>("text");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [h1s, setH1s] = useState<string[]>([]);
  const [robots, setRobots] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const titlePixelWidth = useMemo(() => {
    return getTextWidth(title, "20px Arial");
  }, [title]);

  const descPixelWidth = useMemo(() => {
    return getTextWidth(description, "13px Arial");
  }, [description]);

  const titleScore = useMemo(() => scoreTitle(title.length, titlePixelWidth), [title, titlePixelWidth]);
  const descriptionScore = useMemo(
    () => scoreDescription(description.length, descPixelWidth),
    [description, descPixelWidth],
  );

  const fetchMeta = useCallback(async (rawUrl: string) => {
    setLoading(true);
    setError(null);
    setH1s([]);
    setRobots("");
    setOgImage("");
    setWordCount(0);
    try {
      let target = rawUrl.trim();
      if (!target) {
        setError("Enter a URL to fetch.");
        return null;
      }
      if (!/^https?:\/\//i.test(target)) {
        target = `https://${target}`;
      }
      const res = await fetch(
        `/api/fetch-meta?url=${encodeURIComponent(target)}`,
      );
      const data = (await res.json()) as
        | (FetchMetaResponse & { h1s: string[]; robots: string; ogImage: string; wordCount: number })
        | { error: string };
      if (!res.ok || "error" in data) {
        setError(
          "error" in data
            ? data.error
            : "Could not fetch URL. Check if the site is accessible.",
        );
        return null;
      }
      setTitle(data.title);
      setDescription(data.description);
      setH1s(data.h1s || []);
      setRobots(data.robots || "");
      setOgImage(data.ogImage || "");
      setWordCount(data.wordCount || 0);
      return target;
    } catch {
      setError("Could not fetch URL. Check if the site is accessible.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
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
  };
}
