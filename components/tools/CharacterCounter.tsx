"use client";

import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";

export function CharacterCounter() {
  const [text, setText] = useState("");

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

  useEffect(() => {
    console.log("DEBUG: Component State Updated:", text);
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-orange-100 rounded-xl text-xs font-mono text-orange-900 break-all">
        DEBUG STATE: &quot;{text}&quot;
      </div>
      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="char-input" className="text-sm font-bold text-slate-700">
            Your text
          </label>
          {text && (
            <button
              type="button"
              onClick={() => setText("")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
        <textarea
          id="char-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="mt-2 min-h-[200px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all resize-y"
          placeholder="Paste copy for ads, meta fields, or social posts..."
        />
      </div>

      <div aria-live="polite" aria-atomic="false" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No Spaces" value={stats.noSpaces} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Reading" value={`${stats.readingMinutes} min`} />
        <Stat label="Speaking" value={`${stats.speakingMinutes} min`} />
      </div>

      <div className="pt-8 border-t border-orange-100">
        <h3 className="text-lg font-black text-slate-800 mb-6">Social Media Limits</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <SocialLimit label="Twitter / X" current={stats.chars} max={280} />
          <SocialLimit label="Instagram Bio" current={stats.chars} max={150} />
          <SocialLimit label="LinkedIn Post" current={stats.chars} max={3000} />
        </div>
      </div>
    </div>
  );
}

function SocialLimit({ label, current, max }: { label: string; current: number; max: number }) {
  const percent = Math.min(100, (current / max) * 100);
  const isOver = current > max;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className={isOver ? "text-red-500" : "text-orange-600"}>
          {current} / {max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-orange-100">
        <div
          className={`h-full transition-all duration-500 ${
            isOver ? "bg-red-500" : "bg-orange-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string; color?: string }) {
  return (
    <div className={`rounded-xl border border-orange-100 bg-white p-5 shadow-sm`}>
      <p className={`text-xs font-bold uppercase tracking-wider text-orange-600`}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}