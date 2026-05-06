"use client";

import { useCallback, useRef, useState } from "react";

export type ConvertFormat = "image/png" | "image/jpeg" | "image/webp";

export function useImageConverter() {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ConvertFormat>("image/webp");
  const [jpegQuality, setJpegQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<File | null>(null);

  const revoke = useCallback((u: string | null) => {
    if (u) URL.revokeObjectURL(u);
  }, []);

  const loadFile = useCallback(
    async (file: File) => {
      revoke(sourceUrl);
      revoke(previewUrl);
      const url = URL.createObjectURL(file);
      fileRef.current = file;
      setFileName(file.name);
      setSourceUrl(url);
      setPreviewUrl(null);
    },
    [previewUrl, revoke, sourceUrl],
  );

  const convert = useCallback(async () => {
    const file = fileRef.current;
    const src = sourceUrl;
    if (!file || !src) return;
    setBusy(true);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("load"));
        img.src = src;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const q = jpegQuality / 100;
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(
          (b) => resolve(b),
          format,
          format === "image/jpeg" || format === "image/webp" ? q : undefined,
        ),
      );
      if (!blob) return;
      revoke(previewUrl);
      const out = URL.createObjectURL(blob);
      setPreviewUrl(out);
    } finally {
      setBusy(false);
    }
  }, [format, jpegQuality, previewUrl, revoke, sourceUrl]);

  const download = useCallback(() => {
    if (!previewUrl) return;
    const ext =
      format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `converted.${ext}`;
    a.click();
  }, [format, previewUrl]);

  const reset = useCallback(() => {
    revoke(sourceUrl);
    revoke(previewUrl);
    setSourceUrl(null);
    setPreviewUrl(null);
    setFileName("");
    fileRef.current = null;
  }, [previewUrl, revoke, sourceUrl]);

  return {
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
  };
}
