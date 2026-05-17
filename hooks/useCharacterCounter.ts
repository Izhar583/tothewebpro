"use client";

import { useMemo, useState } from "react";

export function useCharacterCounter(initial = "") {
  const [text, setText] = useState(initial);

  const stats = useMemo(() => {
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\n/).length : 0;
    const paragraphs = text
      ? text.split(/\n+/).filter((p) => p.trim().length > 0).length
      : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readingMinutes = Math.ceil(words / 225);
    const speakingMinutes = Math.ceil(words / 130);
    return { chars, noSpaces, lines, paragraphs, words, readingMinutes, speakingMinutes };
  }, [text]);

  return { text, setText, stats };
}
