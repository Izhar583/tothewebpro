"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Check, AlertTriangle, X, Copy, Globe, Search, Layers, CheckCircle2 } from "lucide-react";

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
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"code" | "url">("code");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemas, setSchemas] = useState<SchemaItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function validateSchemaObject(obj: Record<string, unknown>): SchemaItem {
    const rawType = obj["@type"] || obj["type"];
    const schemaType = typeof rawType === "string" ? rawType : Array.isArray(rawType) ? rawType.join(", ") : "Unknown Schema";
    
    const errors: string[] = [];
    const warnings: string[] = [];

    // Core Schema.org Requirements
    const contextStr = String(obj["@context"] || "");
    if (!obj["@context"]) {
      errors.push("Missing '@context' attribute (expected 'https://schema.org').");
    } else if (!contextStr.toLowerCase().includes("schema.org")) {
      warnings.push(`Non-standard '@context' value: "${contextStr}". Recommended: 'https://schema.org'.`);
    }

    if (!rawType) {
      errors.push("Missing required '@type' property.");
    }

    const typeLower = schemaType.toLowerCase();

    // Type-specific Schema.org Validation Rules
    if (typeLower.includes("organization") || typeLower.includes("localbusiness")) {
      if (!obj.name) errors.push("Organization/LocalBusiness missing required 'name' property.");
      if (!obj.url) warnings.push("Recommended property 'url' is missing.");
      if (!obj.logo) warnings.push("Recommended property 'logo' is missing for brand recognition.");
    }

    if (typeLower.includes("website")) {
      if (!obj.name) errors.push("WebSite schema missing required 'name' property.");
      if (!obj.url) errors.push("WebSite schema missing required 'url' property.");
    }

    if (typeLower.includes("article") || typeLower.includes("blogposting") || typeLower.includes("newsarticle")) {
      if (!obj.headline && !obj.name) errors.push("Article schema missing required 'headline' or 'name' property.");
      if (!obj.author) warnings.push("Recommended property 'author' is missing.");
      if (!obj.publisher) warnings.push("Recommended property 'publisher' is missing for Google News / Discover eligibility.");
      if (!obj.datePublished) warnings.push("Recommended property 'datePublished' is missing.");
      if (!obj.image) warnings.push("Recommended property 'image' is missing for Rich Results.");
    }

    if (typeLower.includes("product")) {
      if (!obj.name) errors.push("Product schema missing required 'name' property.");
      if (!obj.offers) warnings.push("Recommended property 'offers' (Price & Currency) is missing.");
      if (!obj.image) warnings.push("Recommended property 'image' is missing.");
      if (!obj.brand) warnings.push("Recommended property 'brand' is missing.");
    }

    if (typeLower.includes("faqpage")) {
      if (!obj.mainEntity || !Array.isArray(obj.mainEntity)) {
        errors.push("FAQPage schema missing required 'mainEntity' array of Question objects.");
      } else {
        obj.mainEntity.forEach((q: Record<string, unknown>, idx: number) => {
          if (!q || typeof q !== "object" || !q.name) {
            warnings.push(`FAQ Question #${idx + 1} is missing a 'name' property.`);
          }
        });
      }
    }

    if (typeLower.includes("breadcrumblist")) {
      if (!obj.itemListElement || !Array.isArray(obj.itemListElement)) {
        errors.push("BreadcrumbList missing required 'itemListElement' array.");
      }
    }

    return {
      type: schemaType,
      rawJson: JSON.stringify(obj, null, 2),
      isValid: errors.length === 0,
      errors,
      warnings,
      parsedObject: obj,
    };
  }

  function extractSchemasFromText(text: string): SchemaItem[] {
    const items: SchemaItem[] = [];
    const trimmed = text.trim();

    // 1. Try parsing whole text as JSON or JSON-LD
    try {
      // Clean leading HTML script tags if present
      const cleanJson = trimmed
        .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi, "")
        .replace(/<\/script>/gi, "")
        .trim();

      const parsed = JSON.parse(cleanJson);
      const listToProcess = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === "object" && Array.isArray(parsed["@graph"])
        ? parsed["@graph"]
        : [parsed];

      listToProcess.forEach((obj) => {
        if (obj && typeof obj === "object") {
          items.push(validateSchemaObject(obj as Record<string, unknown>));
        }
      });
      return items;
    } catch {
      /* If direct JSON parsing fails, extract all <script type="application/ld+json"> blocks from HTML */
    }

    // 2. Extract script tags from raw HTML
    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(trimmed)) !== null) {
      try {
        const jsonContent = match[1].trim();
        if (jsonContent) {
          const parsed = JSON.parse(jsonContent);
          const listToProcess = Array.isArray(parsed)
            ? parsed
            : parsed && typeof parsed === "object" && Array.isArray(parsed["@graph"])
            ? parsed["@graph"]
            : [parsed];

          listToProcess.forEach((obj) => {
            if (obj && typeof obj === "object") {
              items.push(validateSchemaObject(obj as Record<string, unknown>));
            }
          });
        }
      } catch (jsonErr) {
        items.push({
          type: "Invalid JSON-LD Syntax",
          rawJson: match[1].trim(),
          isValid: false,
          errors: [`JSON Syntax Error: ${jsonErr instanceof Error ? jsonErr.message : "Malformed JSON"}`],
          warnings: [],
          parsedObject: null,
        });
      }
    }

    if (items.length === 0) {
      // Check if it's invalid syntax
      items.push({
        type: "Invalid JSON / HTML Input",
        rawJson: trimmed.slice(0, 300),
        isValid: false,
        errors: ["Could not parse valid JSON-LD structured data. Please verify your JSON or HTML script tags."],
        warnings: [],
        parsedObject: null,
      });
    }

    return items;
  }

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSchemas([]);

    if (mode === "code" && !inputText.trim()) {
      setError("Please paste JSON-LD code or full HTML snippet containing schema markup.");
      return;
    }
    if (mode === "url" && !inputUrl.trim()) {
      setError("Please enter a valid website URL.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "code") {
        const extracted = extractSchemasFromText(inputText);
        setSchemas(extracted);
      } else {
        // Fetch via URL API endpoint
        let cleanUrl = inputUrl.trim();
        if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = `https://${cleanUrl}`;

        const res = await fetch(`/api/seo-audit?url=${encodeURIComponent(cleanUrl)}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Failed to fetch webpage for schema validation.");

        if (json.schemaList && Array.isArray(json.schemaList) && json.schemaList.length > 0) {
          const validated = json.schemaList.map((obj: Record<string, unknown>) =>
            validateSchemaObject(obj)
          );
          setSchemas(validated);
        } else {
          setError("No JSON-LD structured data (<script type=\"application/ld+json\">) found on the specified webpage.");
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
      {/* Input Form Box */}
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-orange-100 pb-4">
         
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "url" ? "bg-orange-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Fetch Website URL Schemas
          </button>
           <button
            type="button"
            onClick={() => setMode("code")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "code" ? "bg-orange-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Paste JSON-LD / HTML Code
          </button>
        </div>

        <form onSubmit={handleValidate} className="space-y-4">
          {mode === "code" ? (
            <div className="space-y-2">
              <label htmlFor="json-ld-input" className="block text-sm font-bold text-slate-800">
                Paste JSON-LD or Full HTML Code
              </label>
              <textarea
                id="json-ld-input"
                rows={8}
                placeholder={`Paste your JSON-LD snippet or full HTML page:\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "ToTheWebPro",\n  "url": "https://tothewebpro.com"\n}`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
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
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-orange-600" /> Detected Schemas ({schemas.length})
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Validated against Schema.org Standards
            </span>
          </div>

          <div className="space-y-6">
            {schemas.map((sc, idx) => (
              <div key={idx} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
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
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Validation Errors List */}
                {sc.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-600">Validation Errors</h4>
                    {sc.errors.map((err, eIdx) => (
                      <div key={eIdx} className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3 text-xs text-red-800 border border-red-200">
                        <X className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings / Recommendations List */}
                {sc.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600">Recommendations & Warnings</h4>
                    {sc.warnings.map((warn, wIdx) => (
                      <div key={wIdx} className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* JSON Code Display */}
                <div className="relative">
                  <pre className="max-h-80 overflow-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
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
