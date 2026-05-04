"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { useImageCompressor } from "@/hooks/useImageCompressor";
import { Spinner } from "@/components/ui/Spinner";

export function ImageCompressor() {
  const { quality, setQuality, items, processing, addFiles, recompressAll } =
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
      <div className="inline-flex items-center gap-2 rounded-badge bg-surface px-3 py-2 text-sm font-semibold text-navy ring-1 ring-slate-200">
        <span aria-hidden>🔒</span>
        Your images never leave your browser
      </div>

      <div
        {...getRootProps({
          className:
            "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/50 bg-surface px-4 py-10 text-center transition hover:border-primary",
        })}
      >
        <input {...getInputProps()} aria-label="Upload images to compress" />
        <p className="text-base font-semibold text-navy">
          {isDragActive ? "Drop images here…" : "Drop images here or click to upload"}
        </p>
        <p className="mt-2 text-sm text-body">
          JPG, PNG, WebP, or GIF — up to 20 files per batch.
        </p>
      </div>

      {processing ? <Spinner label="Compressing images…" /> : null}

      <div>
        <label htmlFor="quality" className="text-sm font-medium text-navy">
          Quality: {quality}%
        </label>
        <input
          id="quality"
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="mt-2 w-full accent-primary"
          aria-valuemin={10}
          aria-valuemax={100}
          aria-valuenow={quality}
          aria-label="Compression quality"
        />
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
              className="flex flex-col gap-4 rounded-card border border-slate-200 bg-white p-4 shadow-sm md:flex-row"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- user-generated blob preview */}
              <img
                src={item.previewUrl}
                alt={`Preview ${item.file.name}`}
                className="h-32 w-32 rounded-input object-cover"
              />
              <div className="flex-1 space-y-2 text-sm">
                <p className="font-semibold text-navy">{item.file.name}</p>
                <p className="text-body">
                  {(item.originalSize / 1024).toFixed(1)} KB →{" "}
                  {(item.compressedSize / 1024).toFixed(1)} KB
                  <span className="ml-2 font-semibold text-success">
                    {saving}% smaller
                  </span>
                </p>
                <a
                  href={item.previewUrl}
                  download={item.compressedFile.name}
                  className="inline-flex rounded-input bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                  aria-label={`Download compressed ${item.file.name}`}
                >
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
          className="rounded-input bg-navy px-4 py-2 text-sm font-semibold text-white"
          aria-label="Download all compressed images as ZIP"
        >
          Download All as ZIP
        </button>
      ) : null}
    </div>
  );
}
