"use client";

import { useCallback, useMemo, useState } from "react";
import type { FetchMetaResponse } from "@/lib/types";
import {
  scoreDescription,
  scoreTitle,
} from "@/lib/metaScore";

export type InputMode = "text" | "url";

export function useMetaChecker() {
  const [mode, setMode] = useState<InputMode>("text");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleScore = useMemo(() => scoreTitle(title.length), [title]);
  const descriptionScore = useMemo(
    () => scoreDescription(description.length),
    [description],
  );

  const fetchMeta = useCallback(async (rawUrl: string) => {
    setLoading(true);
    setError(null);
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
        | FetchMetaResponse
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
  };
}
