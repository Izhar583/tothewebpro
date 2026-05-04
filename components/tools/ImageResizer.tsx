"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useImageResizer } from "@/hooks/useImageResizer";
import { Spinner } from "@/components/ui/Spinner";

const PRESETS: { label: string; w: number; h: number }[] = [
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "1280×720", w: 1280, h: 720 },
  { label: "800×600", w: 800, h: 600 },
  { label: "500×500", w: 500, h: 500 },
  { label: "Instagram Post (1080×1080)", w: 1080, h: 1080 },
  { label: "Twitter Header (1500×500)", w: 1500, h: 500 },
  { label: "Facebook Cover (851×315)", w: 851, h: 315 },
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
      <div className="inline-flex items-center gap-2 rounded-badge bg-surface px-3 py-2 text-sm font-semibold text-navy ring-1 ring-slate-200">
        <span aria-hidden>🔒</span>
        Resizing happens locally in your browser
      </div>

      <div
        {...getRootProps({
          className:
            "flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/50 bg-surface px-4 py-8 text-center",
        })}
      >
        <input {...getInputProps()} aria-label="Upload image to resize" />
        <p className="font-semibold text-navy">
          {isDragActive ? "Drop image…" : "Drop an image here or click to upload"}
        </p>
        <p className="mt-1 text-sm text-body">JPG, PNG, or WebP</p>
      </div>

      {busy ? <Spinner label="Processing image…" /> : null}

      {state.src ? (
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-navy">Original</p>
            <p className="text-body">
              {state.naturalW} × {state.naturalH}px
            </p>
            <p className="text-body">
              {(state.fileSize / 1024).toFixed(1)} KB
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.src}
              alt="Original upload preview"
              className="mt-2 max-h-48 rounded-input object-contain ring-1 ring-slate-200"
            />
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rw" className="text-sm font-medium text-navy">
                  Width (px)
                </label>
                <input
                  id="rw"
                  type="number"
                  min={1}
                  value={state.width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="mt-1 w-full rounded-input border border-slate-200 px-3 py-2 text-sm"
                  aria-label="Target width in pixels"
                />
              </div>
              <div>
                <label htmlFor="rh" className="text-sm font-medium text-navy">
                  Height (px)
                </label>
                <input
                  id="rh"
                  type="number"
                  min={1}
                  value={state.height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="mt-1 w-full rounded-input border border-slate-200 px-3 py-2 text-sm"
                  aria-label="Target height in pixels"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleAspect}
                className={`rounded-input px-3 py-2 text-sm font-semibold ${
                  state.aspectLocked
                    ? "bg-primary text-white"
                    : "border border-slate-200 bg-white text-navy"
                }`}
                aria-pressed={state.aspectLocked}
                aria-label="Toggle aspect ratio lock"
              >
                Aspect lock {state.aspectLocked ? "on" : "off"}
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
                  className="rounded-input border border-slate-200 px-3 py-2 text-sm"
                  aria-label="Output image format"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-navy">Quick presets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p.w, p.h)}
                    className="rounded-badge bg-white px-3 py-1 text-xs font-semibold text-primary ring-1 ring-slate-200"
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
              className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white"
              aria-label="Generate resized preview"
            >
              Update preview
            </button>

            {state.previewUrl ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-navy">Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.previewUrl}
                  alt="Resized preview"
                  className="max-h-64 rounded-input object-contain ring-1 ring-slate-200"
                />
                <button
                  type="button"
                  onClick={download}
                  className="rounded-input bg-navy px-4 py-2 text-sm font-semibold text-white"
                  aria-label="Download resized image"
                >
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
