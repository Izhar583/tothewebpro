"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Check, AlertTriangle, X, Code, Copy, Globe, Search, Layers, FileCode } from "lucide-react";

interface SchemaItem {
  type: string;
  rawJson: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  parsedObject: Record<string, unknown> | null;
}

export function SchemaValidator() {
  const [inputUrl, setInputUrl] = useState("");
  const [jsonCode, setJsonCode] = useState("");
  const [mode, setMode] = useState<"code" | "url">("code");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemas, setSchemas] = useState<SchemaItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSchemas([]);

    if (mode === "code" && !jsonCode.trim()) {
      setError("Please enter JSON-LD code to validate.");
      return;
    }
    if (mode === "url" && !inputUrl.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "code") {
        // Parse raw JSON-LD text directly
        let text = jsonCode.trim();
        // Remove <script type="application/ld+json"> wrapper if present
        text = text.replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "").trim();

        const extractedItems: SchemaItem[] = [];
        try {
          const parsed = JSON.parse(text);
          const itemsToProcess = Array.isArray(parsed) ? parsed : [parsed];

          itemsToProcess.forEach((obj) => {
            const schemaType = String(obj["@type"] || obj["type"] || "Unknown Schema");
            const errors: string[] = [];
            const warnings: string[] = [];

            if (!obj["@context"]) errors.push("Missing '@context': 'https://schema.org'");
            if (!obj["@type"]) errors.push("Missing required '@type' attribute.");

            // Common schema checks
            if (schemaType.toLowerCase().includes("article")) {
              if (!obj.headline && !obj.name) warnings.push("Recommended property 'headline' is missing.");
              if (!obj.author) warnings.push("Recommended property 'author' is missing.");
              if (!obj.publisher) warnings.push("Recommended property 'publisher' is missing.");
            }
            if (schemaType.toLowerCase().includes("product")) {
              if (!obj.name) errors.push("Product schema missing required 'name' property.");
              if (!obj.offers) warnings.push("Recommended property 'offers' (Price, Currency) missing.");
            }
            if (schemaType.toLowerCase().includes("faqpage")) {
              if (!Array.isArray(obj.mainEntity)) errors.push("FAQPage requires 'mainEntity' array of Question objects.");
            }

            extractedItems.push({
              type: schemaType,
              rawJson: JSON.stringify(obj, null, 2),
              isValid: errors.length === 0,
              errors,
              warnings,
              parsedObject: obj,
            });
          });
        } catch (jsonErr: unknown) {
          extractedItems.push({
            type: "Invalid JSON Syntax",
            rawJson: text,
            isValid: false,
            errors: [`Syntax Error: ${jsonErr instanceof Error ? jsonErr.message : "Invalid JSON syntax"}`],
            warnings: [],
            parsedObject: null,
          });
        }

        setSchemas(extractedItems);
      } else {
        // URL validation via API route
        let cleanUrl = inputUrl.trim();
        if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = `https://${cleanUrl}`;

        const res = await fetch(`/api/seo-audit?url=${encodeURIComponent(cleanUrl)}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Failed to fetch webpage for schema validation.");

        if (json.schemaList && json.schemaList.length > 0) {
          const items: SchemaItem[] = json.schemaList.map((sc: Record<string, unknown>) => {
            const schemaType = String(sc["@type"] || "Unknown Schema");
            return {
              type: schemaType,
              rawJson: JSON.stringify(sc, null, 2),
              isValid: Boolean(sc["@context"] && sc["@type"]),
              errors: sc["@context"] ? [] : ["Missing '@context'"],
              warnings: [],
              parsedObject: sc,
            };
          });
          setSchemas(items);
        } else {
          setError("No JSON-LD structured data tags found on the specified webpage.");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to validate schema.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(jsonText: string, index: number) {
    navigator.clipboard.writeText(jsonText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Form Box */}
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-orange-100 pb-4">
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "code" ? "bg-orange-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Paste JSON-LD Code
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "url" ? "bg-orange-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Fetch URL Schema
          </button>
        </div>

        <form onSubmit={handleValidate} className="space-y-4">
          {mode === "code" ? (
            <div className="space-y-2">
              <label htmlFor="json-ld-input" className="block text-sm font-bold text-slate-800">
                Paste JSON-LD Structured Data Code
              </label>
              <textarea
                id="json-ld-input"
                rows={8}
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Example Article Title"\n}`}
                value={jsonCode}
                onChange={(e) => setJsonCode(e.target.value)}
                className="w-full rounded-2xl border border-orange-200 bg-slate-900 p-4 font-mono text-xs text-orange-300 placeholder:text-slate-600 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                disabled={loading}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="schema-url-input" className="block text-sm font-bold text-slate-800">
                Enter Website URL to Extract and Validate Embedded Schemas
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Globe className="h-5 w-5" />
                </div>
                <input
                  id="schema-url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full rounded-2xl border border-orange-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? <Spinner label="Validating schema markup..." /> : <Search className="h-4 w-4" />}
            <span>Validate Schema Markup</span>
          </button>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Validation Results */}
      {schemas.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-orange-600" /> Detected Schemas ({schemas.length})
          </h3>

          <div className="space-y-6">
            {schemas.map((sc, idx) => (
              <div key={idx} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900 bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">
                      {sc.type}
                    </span>
                    {sc.isValid ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Check className="h-3.5 w-3.5" /> Valid Schema
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                        <X className="h-3.5 w-3.5" /> Errors Found
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopy(sc.rawJson, idx)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedIndex === idx ? "Copied!" : "Copy JSON"}
                  </button>
                </div>

                {/* Errors List */}
                {sc.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-600">Validation Errors</h4>
                    {sc.errors.map((err, eIdx) => (
                      <div key={eIdx} className="flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
                        <X className="h-4 w-4 shrink-0 text-red-600" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings List */}
                {sc.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600">Recommendations & Warnings</h4>
                    {sc.warnings.map((warn, wIdx) => (
                      <div key={wIdx} className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 border border-amber-200">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* JSON Code Viewer */}
                <div className="relative">
                  <pre className="max-h-60 overflow-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
                    {sc.rawJson}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
