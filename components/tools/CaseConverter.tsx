"use client";

import { useCaseConverter, type CaseOutputs } from "@/hooks/useCaseConverter";
import { copyToClipboard } from "@/lib/clipboard";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

const LABELS: { key: keyof CaseOutputs; label: string }[] =
  [
    { key: "upper", label: "UPPERCASE" },
    { key: "lower", label: "lowercase" },
    { key: "title", label: "Title Case" },
    { key: "sentence", label: "Sentence case" },
    { key: "alternating", label: "aLtErNaTiNg" },
    { key: "camel", label: "camelCase" },
    { key: "snake", label: "snake_case" },
    { key: "kebab", label: "kebab-case" },
  ];

export function CaseConverter() {
  const { input, setInput, outputs } = useCaseConverter();

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="case-input" className="text-sm font-bold text-slate-700">
            Input Text
          </label>
          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
        <textarea
          id="case-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all resize-y"
          placeholder="Type or paste any text (all conversions update live)."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {LABELS.map(({ key, label }) => (
          <OutputBox
            key={key}
            label={label}
            value={outputs[key]}
            copyLabel={`Copy ${label}`}
          />
        ))}
      </div>
    </div>
  );
}

function OutputBox({
  label,
  value,
  copyLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-700">{label}</h3>
        <button
          type="button"
          onClick={() => void copy()}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            copied
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
          }`}
          aria-label={copyLabel}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-orange-50/50 p-4 text-sm text-slate-900 border border-orange-100 font-mono">
        {value || ""}
      </pre>
    </div>
  );
}