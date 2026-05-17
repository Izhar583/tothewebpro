"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useWordCounter } from "@/hooks/useWordCounter";
import { X, Upload } from "lucide-react";

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
        <label htmlFor="word-counter-input" className="text-sm font-bold text-slate-700">
          Text to analyse
        </label>
        {text && (
          <button
            type="button"
            onClick={() => setText("")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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