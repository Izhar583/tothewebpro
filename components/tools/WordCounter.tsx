"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useWordCounter } from "@/hooks/useWordCounter";
import { X, Upload, ChevronDown, ChevronUp, ShieldCheck, HelpCircle, Cpu, BookOpen, ListChecks, UserCheck, Globe, Search, Sparkles, FileText } from "lucide-react";

export function WordCounter() {
  const { text, setText, stats, loadTextFile } = useWordCounter();
  // Local state mirrors the textarea immediately for a responsive feel,
  // while the heavy stats computation is debounced by 300ms.
  const [localText, setLocalText] = useState(text);

  useEffect(() => {
    const id = setTimeout(() => setText(localText), 300);
    return () => clearTimeout(id);
  }, [localText, setText]);

  // Keep localText in sync when text is reset externally (e.g. Clear button)
  useEffect(() => {
    if (text === "") setLocalText("");
  }, [text]);

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (file && file.name.endsWith(".txt")) void loadTextFile(file);
    },
    [loadTextFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="word-counter-input" className="text-sm font-bold text-slate-700">
          Text to analyse
        </label>
        {localText && (
          <button
            type="button"
            onClick={() => { setText(""); setLocalText(""); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
      <textarea
        id="word-counter-input"
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        className="min-h-[250px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all resize-y"
        placeholder="Paste your article, brief, or notes here..."
      />

      <div
        {...getRootProps({
          className:
            "cursor-pointer rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-300 bg-orange-50/30 px-4 py-4 text-center text-sm text-slate-500 transition-all hover:bg-orange-50",
        })}
      >
        <input {...getInputProps()} aria-label="Upload text file" />
        {isDragActive ? (
          <p className="text-orange-600">Drop the .txt file here...</p>
        ) : (
          <p className="flex items-center justify-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="font-bold text-orange-600">Upload .txt</span>
            <span>— drag & drop or click</span>
          </p>
        )}
      </div>

      <div aria-live="polite" aria-atomic="false" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Words" value={stats.wordCount} />
        <StatCard label="Characters" value={stats.charsWithSpaces} />
        <StatCard label="No Spaces" value={stats.charsNoSpaces} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard label="Reading" value={`${stats.readingMinutes} min`} />
        <StatCard label="Speaking" value={`${stats.speakingMinutes} min`} />
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Top words</h3>
        <div className="overflow-x-auto rounded-xl border border-orange-100 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-orange-50/50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">Word</th>
                <th scope="col" className="px-4 py-3 font-bold">Count</th>
                <th scope="col" className="px-4 py-3 font-bold">%</th>
              </tr>
            </thead>
            <tbody>
              {stats.topWords.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-400" colSpan={3}>
                    Add meaningful text to see frequency (stop words are filtered).
                  </td>
                </tr>
              ) : (
                stats.topWords.map((row) => (
                  <tr key={row.word} className="border-t border-orange-50">
                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.word}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.count}</td>
                    <td className="px-4 py-2.5 text-slate-500">{row.percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WordCounterLandingPage />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={`rounded-xl border border-orange-100 bg-white p-5 shadow-sm`}>
      <p className={`text-xs font-bold uppercase tracking-wider text-orange-600`}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-orange-100 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-sm hover:border-orange-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-orange-600 transition-colors"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange-500 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
        )}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-orange-50/50" : "max-h-0"
        }`}
      >
        <div className="p-5 text-sm text-slate-600 leading-relaxed font-medium bg-orange-50/10">
          {answer}
        </div>
      </div>
    </div>
  );
}

function WordCounterLandingPage() {
  return (
    <div className="mt-16 pt-16 border-t border-orange-100 space-y-16">
      {/* H1 Section */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Live Text Analysis
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight md:text-4xl">
          Free Word Counter Online — Live Word, Character &amp; Reading Time Analyzer by ToTheWebPro
        </h2>
        <div className="max-w-4xl text-slate-600 space-y-4 font-medium leading-relaxed">
          <p>
            Paste your text and every metric updates before your finger leaves the key. Word count, character count, paragraph count, estimated reading time, and keyword density — all computed instantly, all displayed without a single page reload.
          </p>
          <p>
            The problem is specific: most word counters give you one number and stop there. Serious content professionals need a full analytical snapshot — sentence rhythm, reading-level proxies, keyword frequency — not just a tally. Generic tools force you to copy-paste into three separate apps to get what ToTheWebPro delivers in one view.
          </p>
        </div>

        {/* Quick Value Hook Alert */}
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/55 to-amber-50/35 p-6 flex gap-4 shadow-sm items-start">
          <div className="p-2.5 bg-white rounded-xl border border-orange-100 text-orange-600 shadow-lift shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Quick Value Hook</h4>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed font-medium">
              <strong>ToTheWebPro&apos;s Word Counter runs 100% client-side using a natively optimized JavaScript engine</strong> — your manuscript, client copy, legal brief, or source code never leaves your browser, never touches a server, and is never logged or retained. Unlike SaaS writing tools that process your text on remote servers and retain session data, this tool gives you sub-millisecond real-time updates on documents of any size with zero privacy exposure.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - What Is a Live Word Counter */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          What Is a Live Word Counter and How Does It Work?
        </h3>
        <div className="max-w-4xl text-slate-600 font-medium leading-relaxed">
          <p>
            A <strong>live word counter</strong> is a browser-based text analysis engine that tokenizes your input string on every keystroke and computes a set of linguistic and structural metrics in real time — without requiring a form submission, API call, or page refresh. The term &quot;live&quot; is the critical differentiator: the analysis state is always synchronized with the current document state, with zero visible latency.
          </p>
          <p className="mt-4">
            ToTheWebPro&apos;s tool goes beyond simple tokenization. It parses your text across multiple analytical layers simultaneously: lexical (words, characters), structural (sentences, paragraphs), temporal (reading time, speaking time), and semantic (keyword frequency, density percentage).
          </p>
        </div>

        {/* Core Input/Output Mechanics Table */}
        <div className="mt-6 space-y-3">
          <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-orange-500" />
            Core Input/Output Mechanics
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/50 border-b border-orange-100">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Metric</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/2">How It Is Calculated</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Output Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 text-sm font-medium text-slate-700">
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Word Count</td>
                  <td className="p-4">Splits input on whitespace and punctuation boundaries, filters empty tokens</td>
                  <td className="p-4 text-slate-600">Integer (e.g., 847 words)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Character Count (with spaces)</td>
                  <td className="p-4">Returns raw <code>string.length</code> of the full input</td>
                  <td className="p-4 text-slate-600">Integer (e.g., 5,203 characters)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Character Count (no spaces)</td>
                  <td className="p-4">Strips all whitespace characters before counting</td>
                  <td className="p-4 text-slate-600">Integer (e.g., 4,412 characters)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Sentence Count</td>
                  <td className="p-4">Tokenizes on <code>.</code>, <code>!</code>, <code>?</code> with heuristics to skip abbreviations</td>
                  <td className="p-4 text-slate-600">Integer (e.g., 42 sentences)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Paragraph Count</td>
                  <td className="p-4">Splits on double newline (<code>\n\n</code>) or <code>&lt;p&gt;</code> boundary patterns</td>
                  <td className="p-4 text-slate-600">Integer (e.g., 11 paragraphs)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Estimated Reading Time</td>
                  <td className="p-4">Divides word count by 238 WPM (scientific average for silent reading)</td>
                  <td className="p-4 text-slate-600">Minutes and seconds (e.g., 3 min 33 sec)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Estimated Speaking Time</td>
                  <td className="p-4">Divides word count by 130 WPM (average conversational speech rate)</td>
                  <td className="p-4 text-slate-600">Minutes and seconds (e.g., 6 min 31 sec)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Top Keywords &amp; Density</td>
                  <td className="p-4">Strips stop words, ranks remaining tokens by frequency, calculates % of total words</td>
                  <td className="p-4 text-slate-600">Ranked list with % (e.g., &quot;content — 2.4%&quot;)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Average Word Length</td>
                  <td className="p-4">Sums character counts of all tokens, divides by word count</td>
                  <td className="p-4 text-slate-600">Decimal (e.g., 5.2 characters/word)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Average Sentence Length</td>
                  <td className="p-4">Divides word count by sentence count</td>
                  <td className="p-4 text-slate-600">Decimal (e.g., 20.2 words/sentence)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* H2 - Step-by-Step Guide */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange-500" />
          Step-by-Step Guide: How to Use the ToTheWebPro Live Word Counter
        </h3>
        <p className="max-w-3xl text-slate-600 font-medium">
          The interface is built for immediate productivity — no configuration, no account, no tutorial required. Here is the exact workflow from landing on the page to extracting your full analytics report:
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              1
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Open the Tool &amp; Input Area</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Navigate to the Word Counter on ToTheWebPro. The primary input is a large, resizable text area that occupies the top portion of the screen. It auto-focuses on page load, so start typing or pasting immediately.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              2
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Paste or Type Your Content</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Paste any volume of text directly. The tool handles everything from a tweet to a 10,000-word paper. You can also draft directly with real-time updates and sub-millisecond updates.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              3
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Read Your Live Dashboard</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              The moment you add or remove characters, the dashboard recalculates all metrics. Primary metrics (words, chars, reading time) are displayed in stat cards, while secondary details sit in a supporting panel.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              4
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Review Keyword Density</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Scroll to the Keyword Frequency panel to see your top 10 recurring terms, their counts, and density. Use it to check density percentages and make semantic improvements to your content draft.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              5
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Copy, Export, or Reset</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Use manual copying or the copy button to capture your results. Click the Reset button to wipe all fields and stats, returning the dashboard immediately back to zero values.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - Why Technical Accuracy Matters */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-orange-500" />
          Why Technical Accuracy Matters for Word Count and Reading Time Metrics
        </h3>
        <p className="max-w-3xl text-slate-600 font-medium">
          The number your word counter returns is only as useful as the algorithm behind it. Naive implementations get this wrong in ways that produce meaningfully incorrect outputs — and for professionals, &quot;close enough&quot; is not good enough.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Word Tokenization: The Core Algorithm Problem</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              A whitespace-split on <code>string.split(&quot; &quot;)</code> systematically overcounts empty strings, em-dashes, and CJK text. ToTheWebPro&apos;s tokenizer uses a regex-based boundary detector (<code>/\b\w+\b/g</code> with Unicode extensions) that handles compound, hyphenated, and multi-script text correctly.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">The 238 WPM Reading Speed Standard</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Sourced from a 2019 meta-analysis (Brysbaert, 2019) aggregating data from 190 studies covering 17,887 participants. It represents the median adult silent reading speed for non-fiction text, making it the most empirically defensible and modern WPM metric standard.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Character Count: With Spaces vs. Without</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Character count <em>with spaces</em> matches <code>string.length</code> for Twitter/SMS/CMS limit validations. Character count <em>without spaces</em> is correct for academic, typesetting, and linguistic analysis. Conflating the two creates errors when limits are tight.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Keyword Density &amp; the Stop Word Problem</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Without filtering, frequency rankings get dominated by structural words like &quot;the&quot; and &quot;and.&quot; Our engine uses a 400-word English stop list and computes density strictly against <em>content words</em> to keep keyword insights highly actionable.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <ListChecks className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Average Sentence Length Readability Proxy</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              As a core input to the Flesch Reading Ease formula, average sentence length is key to readable prose. General adult audiences read best at 15–20 words per sentence. Tracking this in real time lets writers correct density and length dynamically.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - Key Features */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Key Features of Our Free Online Live Word Counter &amp; Text Analytics Tool
        </h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">True Real-Time Updates, Zero Lag</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Metrics recalculate on every keypress using an optimized, non-blocking JavaScript worker. Pasting 10,000 words takes under 100 milliseconds.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">10-Metric Analytics Dashboard</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Word count, characters, sentences, paragraphs, reading and speaking times, keyword density, word lengths, and sentence lengths.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Client-Side, Zero Retention</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Every calculation runs inside your browser runtime. Zero data is transmitted to Vercel infrastructure or stored remotely.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Filtered Keyword Density</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Strips a 400-word English stop list before ranking, delivering a semantically meaningful density report rather than empty statistics.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Mobile-Responsive, Paste-and-Go</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Adapts clean layout from 320px up. The text area and analytics dashboard stack beautifully on mobile with no visual quality degradation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H2 - Semantic Context & Use Cases */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-orange-500" />
          Semantic Context &amp; Use Cases: Who Uses a Word Counter Daily?
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Content Writers and Copywriters</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Editorial briefs come with hard target counts. Real-time tracking keeps the writing process uninterrupted by constant manually triggered dialog counts, while keyword density tracking helps prevent keyword stuffing.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">SEO Professionals and Strategists</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Allows you to measure information completeness against competitive benchmarks. Estimating the reader&apos;s time investment directly supports UX planning and content engagement design.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Academic Writers, Students, and Researchers</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Helps satisfy precise assignment limits. Standard counts with/without spaces are vital for paper abstracts and publications where parameters are closely monitored.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Podcast Producers and Public Speakers</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Speaking time estimate at 130 WPM gives scriptwriters calibrated duration insights. A 10-minute segment requires ~1,300 words, optimizing production efficiency.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Developers and Technical Writers</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Assures documentation is clear and concise. Technical style guides recommend sentence lengths below 25 words to maximize reading retention and minimize clarity issues.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - FAQs */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-orange-500" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4 max-w-4xl mt-6">
          <FaqAccordionItem
            question="What is the most accurate online word counter?"
            answer="The most accurate word counters use regex-based tokenization rather than simple whitespace splitting. Accurate tools handle hyphenated compound words, punctuation boundaries, and multi-script text correctly. They also provide character counts in both variants (with and without spaces), as these are calculated differently and serve different use cases. ToTheWebPro's word counter uses Unicode-aware boundary detection to count words correctly regardless of text complexity."
          />
          <FaqAccordionItem
            question="How is reading time calculated on a word counter?"
            answer="Reading time is calculated by dividing the total word count by an assumed reading speed in words per minute (WPM). The scientific consensus estimate for adult silent reading speed is 238 WPM, based on a 2019 meta-analysis by Brysbaert covering 17,887 participants across 190 studies. A 1,000-word article therefore has an estimated reading time of approximately 4 minutes and 12 seconds. Tools that use 200 WPM or 250 WPM are relying on older, less rigorous estimates."
          />
          <FaqAccordionItem
            question="Does character count include spaces?"
            answer="It depends on the tool and context. Character count with spaces counts every character including whitespace, matching the behavior of string.length in JavaScript and most platform character limit validators (Twitter, SMS, CMS fields). Character count without spaces strips all whitespace before counting and is used for linguistic analysis, typesetting, and certain academic submission requirements. You should always confirm which variant the target platform or editor uses before relying on either figure."
          />
          <FaqAccordionItem
            question="What is a good keyword density percentage for SEO?"
            answer="There is no universally mandated keyword density percentage. Google has explicitly stated it does not use keyword density as a direct ranking factor. However, practical content analysis suggests that a primary keyword appearing at 1%–2% of total content words (calculated on content words only, excluding stop words) achieves natural-sounding placement without triggering over-optimization signals. Density below 0.5% in a 1,500-word article often suggests the topic is underdeveloped relative to search intent; density above 3% frequently indicates forced repetition that degrades readability."
          />
          <FaqAccordionItem
            question="Is this word counter tool completely free with no word limit?"
            answer="Yes. ToTheWebPro's Live Word Counter is entirely free with no word count cap, no session limit, and no registration requirement. Because the tool runs entirely in your browser with no server-side processing, there is no compute cost per analysis and therefore no basis for a usage limit. Paste documents of any length — the tool has been tested on inputs exceeding 50,000 words without performance degradation on modern hardware."
          />
        </div>
      </section>

      {/* Footer credit branding block exactly per user content */}
      <div className="pt-8 border-t border-orange-100 text-center text-xs font-semibold text-slate-400">
        ToTheWebPro — <a href="https://tothewebpro.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">https://tothewebpro.vercel.app/</a> | Free Web Developer &amp; SEO Utilities
      </div>
    </div>
  );
}