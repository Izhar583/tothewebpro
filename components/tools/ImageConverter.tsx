"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useImageConverter } from "@/hooks/useImageConverter";
import { Spinner } from "@/components/ui/Spinner";
import { X } from "lucide-react";

export function ImageConverter() {
  const {
    sourceUrl,
    previewUrl,
    format,
    setFormat,
    jpegQuality,
    setJpegQuality,
    busy,
    fileName,
    loadFile,
    convert,
    download,
    reset,
  } = useImageConverter();

  const onDrop = useCallback(
    (files: File[]) => {
      const f = files[0];
      if (f) void loadFile(f);
    },
    [loadFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-badge bg-surface px-3 py-2 text-sm font-semibold text-navy ring-1 ring-slate-200">
        <span aria-hidden>🔒</span>
        Conversion runs locally — no uploads
      </div>

      <div
        {...getRootProps({
          className:
            "flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/50 bg-surface px-4 py-8 text-center",
        })}
      >
        <input {...getInputProps()} aria-label="Upload image to convert" />
        <p className="font-semibold text-navy">
          {isDragActive ? "Drop image…" : "Drop an image here or click to upload"}
        </p>
        <p className="mt-1 text-sm text-body">JPG, PNG, or WebP</p>
      </div>

      {sourceUrl && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 text-sm font-semibold text-body hover:text-error transition-colors"
          >
            <X className="h-4 w-4" />
            Clear / Reset
          </button>
        </div>
      )}

      {fileName ? (
        <p className="text-sm text-body">
          Selected: <span className="font-medium text-navy">{fileName}</span>
        </p>
      ) : null}

      {busy ? <Spinner label="Converting…" /> : null}

      {sourceUrl ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-navy">Source</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sourceUrl}
              alt="Source upload"
              className="mt-2 max-h-56 rounded-input object-contain ring-1 ring-slate-200"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="fmt" className="text-sm font-medium text-navy">
                Output format
              </label>
              <select
                id="fmt"
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as typeof format)
                }
                className="mt-1 w-full rounded-input border border-slate-200 px-3 py-2 text-sm"
                aria-label="Choose output format"
              >
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>

            {format !== "image/png" ? (
              <div>
                <label htmlFor="jq" className="text-sm font-medium text-navy">
                  Quality: {jpegQuality}%
                </label>
                <input
                  id="jq"
                  type="range"
                  min={50}
                  max={100}
                  value={jpegQuality}
                  onChange={(e) => setJpegQuality(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                  aria-label="JPEG or WebP quality"
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void convert()}
              className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white"
              aria-label="Convert image"
            >
              Convert
            </button>

            {previewUrl ? (
              <div>
                <p className="text-sm font-semibold text-navy">Output</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Converted preview"
                  className="mt-2 max-h-56 rounded-input object-contain ring-1 ring-slate-200"
                />
                <button
                  type="button"
                  onClick={download}
                  className="mt-3 rounded-input bg-navy px-4 py-2 text-sm font-semibold text-white"
                  aria-label="Download converted image"
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
