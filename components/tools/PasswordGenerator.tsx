"use client";

import { useEffect, useState } from "react";
import { usePasswordGenerator } from "@/hooks/usePasswordGenerator";
import { copyToClipboard } from "@/lib/clipboard";
import { RefreshCw, Copy, Check, Shield } from "lucide-react";

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
      <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-orange-600" />
          <label htmlFor="pwd-out" className="text-sm font-bold text-slate-700">
            Generated password
          </label>
        </div>
        <textarea
          id="pwd-out"
          readOnly
          value={error ? "" : password}
          rows={2}
          className="mt-1 w-full rounded-xl border border-orange-200 bg-orange-50/50 px-4 py-3 font-mono text-lg text-slate-900 tracking-wider"
          aria-label="Generated password output"
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-600 font-medium">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => generate()}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all"
            aria-label="Generate new password"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!password || Boolean(error)}
            className={`flex items-center gap-2 rounded-xl border px-8 py-2.5 text-sm font-bold transition-all ${
              copied
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-orange-100 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
            aria-label={copied ? "Password copied" : "Copy password"}
            aria-live="polite"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-orange-100 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="pwd-len" className="text-sm font-bold text-slate-700">
            Password Length
          </label>
          <span className="px-3 py-1 rounded-lg bg-orange-100 text-orange-700 font-bold text-sm">
            {length} characters
          </span>
        </div>
        <input
          id="pwd-len"
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 rounded-full bg-orange-100 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-orange-500/30"
          aria-valuemin={8}
          aria-valuemax={64}
          aria-valuenow={length}
          aria-label="Password length"
        />
        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
          <span>8</span>
          <span>64</span>
        </div>
      </div>

      <fieldset className="space-y-4 rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
        <legend className="text-sm font-bold text-slate-700 mb-4">Character sets</legend>
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
    <label htmlFor={id} className="flex items-center gap-3 text-sm font-medium text-slate-600 cursor-pointer group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-orange-200 bg-white text-orange-600 focus:ring-orange-500/20"
      />
      <span className="group-hover:text-orange-600 transition-colors">{label}</span>
    </label>
  );
}