"use client";

import { useMemo, useState } from "react";
import { STOP_WORDS } from "@/lib/stopWords";

export interface WordFrequencyRow {
  word: string;
  count: number;
  percentage: number;
}

export function useWordCounter(initial = "") {
  const [text, setText] = useState(initial);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed
      ? trimmed.split(/\s+/).filter((w) => w.length > 0)
      : [];
    const wordCount = words.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, "").length;
    const sentences = text
      ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = text
      ? text.split(/\n+/).filter((p) => p.trim().length > 0).length
      : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const readingMinutes = wordCount === 0 ? 0 : Math.ceil(wordCount / 200);
    const speakingMinutes = wordCount === 0 ? 0 : Math.ceil(wordCount / 130);

    const freq = new Map<string, number>();
    for (const w of words) {
      const key = w.replace(/[^a-zA-Z0-9'-]/g, "").toLowerCase();
      if (!key || STOP_WORDS.has(key)) continue;
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
    const totalMeaningful = Array.from(freq.values()).reduce((a, b) => a + b, 0);
    const topWords: WordFrequencyRow[] = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        percentage:
          totalMeaningful === 0
            ? 0
            : Math.round((count / totalMeaningful) * 1000) / 10,
      }));

    return {
      wordCount,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingMinutes,
      speakingMinutes,
      topWords,
    };
  }, [text]);

  async function loadTextFile(file: File) {
    const t = await file.text();
    setText(t);
  }

  return { text, setText, stats, loadTextFile };
}
