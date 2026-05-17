"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useImageResizer } from "@/hooks/useImageResizer";
import { Spinner } from "@/components/ui/Spinner";
import { X, Upload, Download, Lock, Image as ImageIcon } from "lucide-react";

const PRESETS: { label: string; w: number; h: number }[] = [
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "1280×720", w: 1280, h: 720 },
  { label: "800×600", w: 800, h: 600 },
  { label: "500×500", w: 500, h: 500 },
  { label: "Instagram (1080×1080)", w: 1080, h: 1080 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "Facebook Cover", w: 851, h: 315 },
];

export function ImageResizer() {
  const {
    state,
    busy,
    loadFile,
    setWidth,
    setHeight,
    toggleAspect,
    applyPreset,
    setOutputMime,
    renderPreview,
    download,
    reset,
  } = useImageResizer();

  const onDrop = useCallback(
    (files: File[]) => {
      const f = files[0];
      if (f) void loadFile(f);
    },
    [loadFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-2.5 text-sm font-bold text-green-700">
        <Lock className="h-4 w-4" />
        Resizing happens locally in your browser
      </div>

      <div
        {...getRootProps({
          className:
            "flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 px-4 py-8 text-center transition hover:border-orange-300 hover:bg-orange-50",
        })}
      >
        <input {...getInputProps()} aria-label="Upload image to resize" />
        <Upload className="h-10 w-10 text-orange-400 mb-3" />
        <p className="font-bold text-slate-800">
          {isDragActive ? "Drop image..." : "Drop an image here or click to upload"}
        </p>
        <p className="mt-1 text-sm text-slate-500 font-medium">JPG, PNG, or WebP</p>
      </div>

      {state.src && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear / Reset
          </button>
        </div>
      )}

      {busy ? <Spinner label="Processing image..." /> : null}

      {state.src ? (
        <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-xl border border-orange-100 bg-white shadow-sm">
              <p className="font-bold text-slate-600">Original</p>
              <p className="text-orange-600 font-black mt-1">
                {state.naturalW} × {state.naturalH}px
              </p>
              <p className="text-slate-400 font-medium">
                {(state.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.src}
              alt="Original upload preview"
              className="mt-2 max-h-40 rounded-lg object-contain border border-orange-100"
            />
          </div>

          <div className="space-y-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="rw" className="text-sm font-bold text-slate-700">
                  Width (px)
                </label>
                <input
                  id="rw"
                  type="number"
                  min={1}
                  value={state.width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
                  aria-label="Target width in pixels"
                />
              </div>
              <div>
                <label htmlFor="rh" className="text-sm font-bold text-slate-700">
                  Height (px)
                </label>
                <input
                  id="rh"
                  type="number"
                  min={1}
                  value={state.height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
                  aria-label="Target height in pixels"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleAspect}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                  state.aspectLocked
                    ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                    : "border border-orange-100 bg-white text-slate-600 hover:bg-orange-50 hover:border-orange-200"
                }`}
                aria-pressed={state.aspectLocked}
                aria-label="Toggle aspect ratio lock"
              >
                <Lock className={`h-4 w-4 ${state.aspectLocked ? "text-white" : "text-slate-400"}`} />
                Aspect {state.aspectLocked ? "locked" : "unlocked"}
              </button>

              <div>
                <label htmlFor="mime" className="sr-only">
                  Output format
                </label>
                <select
                  id="mime"
                  value={state.outputMime}
                  onChange={(e) =>
                    setOutputMime(e.target.value as typeof state.outputMime)
                  }
                  className="rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
                  aria-label="Output image format"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-700 mb-3">Quick presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p.w, p.h)}
                    className="rounded-lg bg-white border border-orange-100 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all shadow-sm"
                    aria-label={`Apply preset ${p.label}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void renderPreview()}
              className="rounded-xl bg-orange-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all"
              aria-label="Generate resized preview"
            >
              Update Preview
            </button>

            {state.previewUrl ? (
              <div className="space-y-4 pt-4 border-t border-orange-100">
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-orange-500" />
                  Preview
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.previewUrl}
                  alt="Resized preview"
                  className="max-h-64 rounded-xl object-contain border border-orange-100 shadow-sm"
                />
                <button
                  type="button"
                  onClick={download}
                  className="flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all"
                  aria-label="Download resized image"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}