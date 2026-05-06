"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useWordCounter } from "@/hooks/useWordCounter";
import { X } from "lucide-react";

export function WordCounter() {
  const { text, setText, stats, loadTextFile } = useWordCounter();

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
        <label htmlFor="word-counter-input" className="text-sm font-medium text-navy">
          Text to analyse
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
        id="word-counter-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[300px] w-full rounded-input border border-slate-200 px-3 py-3 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
        placeholder="Paste your article, brief, or notes here..."
      />

      <div
        {...getRootProps({
          className:
            "cursor-pointer rounded-card border border-dashed border-primary/40 bg-surface px-4 py-3 text-center text-sm text-body",
        })}
      >
        <input {...getInputProps()} aria-label="Upload text file" />
        {isDragActive ? (
          <p>Drop the .txt file here…</p>
        ) : (
          <p>
            <span className="font-semibold text-primary">Upload .txt</span> —
            drag &amp; drop or click (plain text only)
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Words" value={stats.wordCount} />
        <StatCard label="Characters (with spaces)" value={stats.charsWithSpaces} />
        <StatCard
          label="Characters (no spaces)"
          value={stats.charsNoSpaces}
        />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard
          label="Reading time"
          value={`${stats.readingMinutes} min`}
        />
        <StatCard
          label="Speaking time"
          value={`${stats.speakingMinutes} min`}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-navy">Top words</h3>
        <div className="mt-3 overflow-x-auto rounded-card border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-body">
              <tr>
                <th scope="col" className="px-4 py-2 font-semibold">Word</th>
                <th scope="col" className="px-4 py-2 font-semibold">Count</th>
                <th scope="col" className="px-4 py-2 font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {stats.topWords.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 text-body" colSpan={3}>
                    Add meaningful text to see frequency (stop words are filtered).
                  </td>
                </tr>
              ) : (
                stats.topWords.map((row) => (
                  <tr key={row.word} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-navy">{row.word}</td>
                    <td className="px-4 py-2 text-body">{row.count}</td>
                    <td className="px-4 py-2 text-body">{row.percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-body">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
    </div>
  );
}
