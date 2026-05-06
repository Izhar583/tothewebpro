"use client";

import { useCharacterCounter } from "@/hooks/useCharacterCounter";
import { X } from "lucide-react";

export function CharacterCounter() {
  const { text, setText, stats } = useCharacterCounter();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="char-input" className="text-sm font-medium text-navy">
            Your text
          </label>
          {text && (
            <button
              type="button"
              onClick={() => setText("")}
              className="flex items-center gap-1.5 text-xs font-semibold text-body hover:text-error transition-colors"
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
          rows={10}
          className="mt-2 min-h-[240px] w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          placeholder="Paste copy for ads, meta fields, or social posts…"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Characters" value={stats.chars} />
        <Stat label="Characters (no spaces)" value={stats.noSpaces} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-body">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-navy">{value}</p>
    </div>
  );
}
