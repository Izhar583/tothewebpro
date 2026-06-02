"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useImageConverter } from "@/hooks/useImageConverter";
import { Spinner } from "@/components/ui/Spinner";
import { X, Upload, Download, ArrowRightLeft, Lock } from "lucide-react";

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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-2.5 text-sm font-bold text-green-700">
        <Lock className="h-4 w-4" />
        Conversion runs locally (no uploads)
      </div>

      <div
        {...getRootProps({
          className:
            "flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 px-4 py-8 text-center transition hover:border-orange-300 hover:bg-orange-50",
          role: "button",
          tabIndex: 0,
          "aria-label": "Upload image",
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }
        })}
      >
        <input {...getInputProps()} aria-label="Upload image to convert" />
        <Upload className="h-10 w-10 text-orange-400 mb-3" />
        <p className="font-bold text-slate-800">
          {isDragActive ? "Drop image..." : "Drop an image here or click to upload"}
        </p>
        <p className="mt-1 text-sm text-slate-500 font-medium">JPG, PNG, or WebP</p>
      </div>

      {sourceUrl && (
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

      {fileName ? (
        <p className="text-sm text-slate-500 font-medium">
          Selected: <span className="font-bold text-slate-800">{fileName}</span>
        </p>
      ) : null}

      {busy ? <Spinner label="Converting..." /> : null}

      {sourceUrl ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-4 rounded-xl border border-orange-100 bg-white shadow-sm">
            <p className="text-sm font-bold text-slate-700 mb-3">Source</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sourceUrl}
              alt="Source upload"
              className="max-h-52 rounded-lg object-contain border border-orange-100"
            />
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="fmt" className="text-sm font-bold text-slate-700">
                Output format
              </label>
              <select
                id="fmt"
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as typeof format)
                }
                className="mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all"
                aria-label="Choose output format"
              >
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>

            {format !== "image/png" ? (
              <div className="p-5 rounded-xl border border-orange-100 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <label htmlFor="jq" className="text-sm font-bold text-slate-700">
                    Quality
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-sm font-bold">
                    {jpegQuality}%
                  </span>
                </div>
                <input
                  id="jq"
                  type="range"
                  min={50}
                  max={100}
                  value={jpegQuality}
                  onChange={(e) => setJpegQuality(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-orange-100 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-orange-500/30"
                  aria-valuemin={50}
                  aria-valuemax={100}
                  aria-valuenow={jpegQuality}
                  aria-valuetext={`${jpegQuality}%`}
                  aria-label="JPEG or WebP quality"
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void convert()}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all"
              aria-label="Convert image"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Convert
            </button>

            {previewUrl ? (
              <div className="p-4 rounded-xl border border-orange-100 bg-white shadow-sm space-y-4">
                <p className="text-sm font-bold text-slate-800">Output Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Converted preview"
                  className="max-h-52 rounded-lg object-contain border border-orange-100"
                />
                <button
                  type="button"
                  onClick={download}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-orange-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-700 transition-all"
                  aria-label="Download converted image"
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