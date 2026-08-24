"use client";

import React, { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import {
  Globe,
  Search,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import type { DomainMetricResult } from "@/app/api/check-dapa/route";

export function DaPaChecker() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DomainMetricResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const parsedDomains = inputText
    .split(/[\n,]+/)
    .map((d) => d.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0])
    .filter(Boolean);

  const domainCount = parsedDomains.length;

  const handleAnalyze = async (domainsToQuery?: string[]) => {
    setError(null);
    setCopied(false);

    const targetDomains = domainsToQuery || parsedDomains;

    if (!targetDomains || targetDomains.length === 0) {
      setError("Please enter at least one website domain or URL.");
      return;
    }

    if (targetDomains.length > 20) {
      setError("You can check up to 20 domains at once. Please reduce your list.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/check-dapa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: targetDomains }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to fetch authority metrics. Please try again.");
      } else if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError("No data could be retrieved for the specified domains.");
      }
    } catch {
      setError("Network connection error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setError(null);
    setResults([]);
  };

  const handleCopyReport = () => {
    if (results.length === 0) return;
    const header = "URL\tDA\tPA\tSpam Score\tDomain Age\tBacklinks\tStatus\n";
    const body = results
      .map(
        (r) =>
          `${r.domain}\t${r.domain_authority}\t${r.page_authority}\t${r.spam_score}%\t${r.domain_age || "N/A"}\t${r.external_backlinks || 0}\t${r.status}`
      )
      .join("\n");
    navigator.clipboard.writeText(header + body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    if (results.length === 0) return;
    const headers = "No,Domain URL,Domain Authority (DA),Page Authority (PA),Spam Score,Domain Age,Created Date,Expiry Date,Registrar,Total Backlinks,PageRank,Global Rank,Status\n";
    const rows = results
      .map((r, idx) => {
        return `${idx + 1},"${r.domain}",${r.domain_authority},${r.page_authority},"${r.spam_score}%","${r.domain_age || ""}",${r.created_date || ""},${r.expiry_date || ""},"${r.registrar || ""}",${r.external_backlinks || 0},${r.open_page_rank || 0},${r.rank || ""},"${r.status}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dapa_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = results.filter((r) =>
    r.domain.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-12">
      {/* PREPOSTSEO-STYLE INPUT CARD */}
      <div className="rounded-3xl border border-orange-100 bg-white p-5 sm:p-7 shadow-sm transition-all">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100/70 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Check Domain Authority & Page Authority
              </h2>
              <p className="text-xs text-slate-500">
                Paste single or multiple website URLs (Up to 20 URLs at once)
              </p>
            </div>
          </div>
        </div>

        {/* Textarea Input Area */}
        <div className="mt-5 relative">
          <textarea
            rows={5}
            placeholder={`Enter website URLs to check authority (one per line):
google.com
wikipedia.org
moz.com
nytimes.com`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-orange-200 bg-orange-50/20 p-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/20 focus:border-orange-500 focus:bg-white focus:ring-4 transition-all"
          />

          {inputText && (
            <button
              onClick={handleClear}
              type="button"
              className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-red-600 border border-slate-200 shadow-sm transition"
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-500">
              {domainCount} / 20 URLs
            </span>

            <button
              onClick={() => handleAnalyze()}
              disabled={loading || domainCount === 0}
              type="button"
              className="flex items-center gap-2 rounded-2xl bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner label="" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Check Authority</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="font-semibold">{error}</p>
          </div>
        )}
      </div>

      {/* RESULTS TABLE SECTION (PREPOSTSEO DA PA REPORT) */}
      {results.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Table Card */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 sm:p-7 shadow-sm">
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    DA PA Report
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing authority analysis for {results.length} {results.length === 1 ? "domain" : "domains"}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Filter, Copy, Export */}
              <div className="flex flex-wrap items-center gap-2">
                {results.length > 1 && (
                  <input
                    type="text"
                    placeholder="Filter URLs..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="rounded-xl border border-orange-200 bg-orange-50/30 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white"
                  />
                )}

                <button
                  onClick={handleCopyReport}
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-orange-50 hover:text-orange-700"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                  {copied ? "Copied!" : "Copy Report"}
                </button>

                <button
                  onClick={handleExportCsv}
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-700 transition"
                >
                  <Download className="h-3.5 w-3.5" /> Download CSV
                </button>
              </div>
            </div>

            {/* DA PA Report Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="border-b border-orange-100 bg-orange-50/60 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3 min-w-[200px]">Web Page / URL</th>
                    <th className="px-4 py-3 text-center">DA</th>
                    <th className="px-4 py-3 text-center">PA</th>
                    <th className="px-4 py-3 text-center">Spam Score</th>
                    <th className="px-4 py-3 min-w-[140px]">Domain Age</th>
                    <th className="px-4 py-3 text-right">Backlinks</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/70">
                  {filteredResults.map((item, idx) => (
                    <tr
                      key={item.domain + idx}
                      className="transition-colors hover:bg-orange-50/40"
                    >
                      {/* Index */}
                      <td className="px-3.5 py-3.5 text-center font-bold text-xs text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Domain URL */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                            <Globe className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 hover:text-orange-600 transition">
                              {item.domain}
                            </div>
                            {item.registrar && (
                              <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                                {item.registrar}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* DA Score */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-black min-w-[48px] ${
                            item.domain_authority >= 70
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.domain_authority >= 40
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-orange-50 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {item.domain_authority}
                        </span>
                      </td>

                      {/* PA Score */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-black min-w-[48px] ${
                            item.page_authority >= 70
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.page_authority >= 40
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-orange-50 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {item.page_authority}
                        </span>
                      </td>

                      {/* Spam Score */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            item.spam_score <= 10
                              ? "bg-emerald-50 text-emerald-700"
                              : item.spam_score <= 30
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.spam_score}%
                        </span>
                      </td>

                      {/* Domain Age */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Calendar className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span>{item.domain_age || "Active"}</span>
                        </div>
                        {item.created_date && (
                          <div className="text-[10px] text-slate-400 pl-5">
                            Reg: {item.created_date}
                          </div>
                        )}
                      </td>

                      {/* Total Backlinks */}
                      <td className="px-4 py-3.5 text-right font-mono text-xs font-bold text-slate-800">
                        {item.external_backlinks
                          ? item.external_backlinks.toLocaleString()
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT SECTIONS MATCHING PREPOSTSEO STRUCTURE */}
      <div className="space-y-12 pt-6">
        {/* 1. How to Check Domain Authority Online? */}
        <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20 p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              Quick Guide
            </span>
            <h3 className="mt-3 text-2xl font-black text-slate-900">
              How to Check Domain Authority Online?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Follow these simple steps to analyze website authority, spam scores, and domain age for free:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 font-black text-xs text-white mb-3">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Enter URLs
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste single or up to 20 website URLs into the input box (one per line).
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 font-black text-xs text-white mb-3">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Click &quot;Check Authority&quot;
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trigger live analysis against the official Moz authority and RDAP WHOIS databases.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 font-black text-xs text-white mb-3">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Review DA PA Report
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analyze Domain Authority (0–100), Page Authority, Spam Score, and Domain Age.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 font-black text-xs text-white mb-3">
                4
              </span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Export to CSV
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download your complete report or copy tabular data for client presentations.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Key Features Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900">
              Key Features of Our DA PA Checker
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Accurate, comprehensive, and reliable search engine authority tracking
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">
                Accurate Moz Metrics
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fetches genuine Domain Authority (DA) and Page Authority (PA) scores based on link equity calculations.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">
                Live Domain Age & WHOIS
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates exact domain age in years and months directly from official ICANN registration protocols.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">
                Bulk Domain Analysis
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check up to 20 competitor domains simultaneously without manual captchas or waiting queues.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">
                Spam Score Risk Rating
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identifies toxic or penalized backlink profiles to protect your site during link-building outreach.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                <Download className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">
                Instant CSV & Excel Export
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export clean, audit-ready CSV reports containing full DA, PA, Spam, and Age metrics in one click.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">
                100% Free Forever
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No credit card, no registration, and no daily limits required to audit websites and competitors.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Educational DA vs PA Explanations */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 font-bold mb-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Domain Authority (DA)</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              What is Domain Authority?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how likely a website is to rank in search results. It is evaluated on a logarithmic 1 to 100 scale based on referring root domains, external backlink quality, and domain age.
            </p>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 font-bold mb-2">
              <FileText className="h-5 w-5" />
              <span>Page Authority (PA)</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              What is Page Authority?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Page Authority (PA) measures the ranking strength of a specific individual URL or web page. While DA applies to the entire domain, PA helps identify high-performing landing pages and cornerstone content that command significant internal and external link equity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
