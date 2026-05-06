"use client";

import { useEffect, useState } from "react";
import { usePasswordGenerator } from "@/hooks/usePasswordGenerator";
import { copyToClipboard } from "@/lib/clipboard";

export function PasswordGenerator() {
  const {
    length,
    setLength,
    useUpper,
    setUseUpper,
    useLower,
    setUseLower,
    useDigits,
    setUseDigits,
    useSymbols,
    setUseSymbols,
    password,
    error,
    generate,
  } = usePasswordGenerator();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generate();
  }, [generate]);

  async function copy() {
    if (!password) return;
    const ok = await copyToClipboard(password);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-slate-200 bg-surface/80 p-4">
        <label htmlFor="pwd-out" className="text-sm font-medium text-navy">
          Generated password
        </label>
        <textarea
          id="pwd-out"
          readOnly
          value={error ? "" : password}
          rows={3}
          className="mt-2 w-full rounded-input border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-navy"
          aria-label="Generated password output"
        />
        {error ? (
          <p role="alert" className="mt-2 text-sm text-error">
            {error}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => generate()}
            className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            aria-label="Generate new password"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!password || Boolean(error)}
            className="rounded-input border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={copied ? "Password copied" : "Copy password"}
            aria-live="polite"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="pwd-len" className="text-sm font-medium text-navy">
          Length: {length}
        </label>
        <input
          id="pwd-len"
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="mt-2 w-full accent-primary"
          aria-valuemin={8}
          aria-valuemax={64}
          aria-valuenow={length}
          aria-label="Password length"
        />
      </div>

      <fieldset className="space-y-3 rounded-card border border-slate-200 p-4">
        <legend className="text-sm font-semibold text-navy">Character sets</legend>
        <Toggle
          id="pwd-lower"
          label="Lowercase (a–z)"
          checked={useLower}
          onChange={setUseLower}
        />
        <Toggle
          id="pwd-upper"
          label="Uppercase (A–Z)"
          checked={useUpper}
          onChange={setUseUpper}
        />
        <Toggle
          id="pwd-digits"
          label="Digits (0–9)"
          checked={useDigits}
          onChange={setUseDigits}
        />
        <Toggle
          id="pwd-sym"
          label="Symbols (!@#…)"
          checked={useSymbols}
          onChange={setUseSymbols}
        />
      </fieldset>
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-body">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      {label}
    </label>
  );
}
