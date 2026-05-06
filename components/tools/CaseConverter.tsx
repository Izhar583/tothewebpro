"use client";

import { useCaseConverter, type CaseOutputs } from "@/hooks/useCaseConverter";
import { copyToClipboard } from "@/lib/clipboard";
import { X } from "lucide-react";

const LABELS: { key: keyof CaseOutputs; label: string }[] =
  [
    { key: "upper", label: "UPPERCASE" },
    { key: "lower", label: "lowercase" },
    { key: "title", label: "Title Case" },
    { key: "sentence", label: "Sentence case" },
    { key: "alternating", label: "aLtErNaTiNg CaSe" },
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
          <label htmlFor="case-input" className="text-sm font-medium text-navy">
            Input
          </label>
          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="flex items-center gap-1.5 text-xs font-semibold text-body hover:text-error transition-colors"
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
          rows={6}
          className="mt-2 w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          placeholder="Type or paste any text — all conversions update live."
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
  async function copy() {
    await copyToClipboard(value);
  }

  return (
    <div className="rounded-card border border-slate-200 bg-surface/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-navy">{label}</h3>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-badge bg-white px-2 py-1 text-xs font-semibold text-primary shadow-sm ring-1 ring-slate-200"
          aria-label={copyLabel}
        >
          Copy
        </button>
      </div>
      <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-input bg-white p-3 text-sm text-navy ring-1 ring-slate-100">
        {value}
      </pre>
    </div>
  );
}
