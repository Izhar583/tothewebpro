"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { useImageCompressor } from "@/hooks/useImageCompressor";
import { Spinner } from "@/components/ui/Spinner";
import { X, Upload, Download, Lock } from "lucide-react";

export function ImageCompressor() {
  const { quality, setQuality, items, processing, addFiles, recompressAll, reset } =
    useImageCompressor();
  const itemsCountRef = useRef(0);
  itemsCountRef.current = items.length;

  useEffect(() => {
    if (itemsCountRef.current === 0) return;
    const handle = setTimeout(() => {
      void recompressAll();
    }, 350);
    return () => clearTimeout(handle);
  }, [quality, recompressAll]);

  const onDrop = useCallback(
    (files: File[]) => {
      void addFiles(files);
    },
    [addFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    multiple: true,
  });

  async function downloadZip() {
    const zip = new JSZip();
    for (const item of items) {
      zip.file(item.compressedFile.name, item.compressedFile);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tothewebpro-compressed.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-2.5 text-sm font-bold text-green-700">
        <Lock className="h-4 w-4" />
        Your images never leave your browser
      </div>

      <div
        {...getRootProps({
          className:
            "flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/30 px-4 py-10 text-center transition hover:border-orange-300 hover:bg-orange-50",
        })}
      >
        <input {...getInputProps()} aria-label="Upload images to compress" />
        <Upload className="h-10 w-10 text-orange-400 mb-3" />
        <p className="text-base font-bold text-slate-800">
          {isDragActive ? "Drop images here..." : "Drop images here or click to upload"}
        </p>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          JPG, PNG, WebP, or GIF — up to 20 files per batch.
        </p>
      </div>

      {items.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-red-400"
          >
            <X className="h-4 w-4" />
            Clear / Reset
          </button>
        </div>
      )}

      {processing ? <Spinner label="Compressing images..." /> : null}

      <div className="p-5 rounded-xl border border-orange-100 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="quality" className="text-sm font-bold text-slate-700">
            Compression Quality
          </label>
          <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
            quality >= 80 ? "bg-green-100 text-green-700" :
            quality >= 50 ? "bg-orange-100 text-orange-700" :
            "bg-red-100 text-red-700"
          }`}>
            {quality}%
          </span>
        </div>
        <input
          id="quality"
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full h-2 rounded-full bg-orange-100 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-orange-500/30"
          aria-valuemin={10}
          aria-valuemax={100}
          aria-valuenow={quality}
          aria-label="Compression quality"
        />
        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
          <span>Smaller file</span>
          <span>Higher quality</span>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const saving =
            item.originalSize === 0
              ? 0
              : Math.round(
                  (1 - item.compressedSize / item.originalSize) * 100,
                );
          return (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-orange-100 bg-white p-4 md:flex-row shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- user-generated blob preview */}
              <img
                src={item.previewUrl}
                alt={`Preview ${item.file.name}`}
                className="h-28 w-28 rounded-lg object-cover border border-orange-100"
              />
              <div className="flex-1 space-y-3 text-sm">
                <p className="font-bold text-slate-800 truncate">{item.file.name}</p>
                <p className="text-slate-500 font-medium">
                  {(item.originalSize / 1024).toFixed(1)} KB → {" "}
                  {(item.compressedSize / 1024).toFixed(1)} KB
                  <span className={`ml-3 font-bold ${
                    saving > 0 ? "text-green-600" : "text-orange-600"
                  }`}>
                    {saving > 0 ? `${saving}% smaller` : `${Math.abs(saving)}% larger`}
                  </span>
                </p>
                <a
                  href={item.previewUrl}
                  download={item.compressedFile.name}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-700 transition-all"
                  aria-label={`Download compressed ${item.file.name}`}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 0 ? (
        <button
          type="button"
          onClick={() => void downloadZip()}
          className="rounded-xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all"
          aria-label="Download all compressed images as ZIP"
        >
          Download All as ZIP
        </button>
      ) : null}
    </div>
  );
}