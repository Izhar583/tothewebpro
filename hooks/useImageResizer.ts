"use client";

import { useCallback, useRef, useState } from "react";

export type OutputMime = "image/jpeg" | "image/png" | "image/webp";

export interface ResizerState {
  src: string | null;
  naturalW: number;
  naturalH: number;
  fileSize: number;
  width: number;
  height: number;
  aspectLocked: boolean;
  previewUrl: string | null;
  outputMime: OutputMime;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function useImageResizer() {
  const fileRef = useRef<File | null>(null);
  const urlsRef = useRef<{ src: string | null; preview: string | null }>({
    src: null,
    preview: null,
  });

  const [state, setState] = useState<ResizerState>({
    src: null,
    naturalW: 0,
    naturalH: 0,
    fileSize: 0,
    width: 0,
    height: 0,
    aspectLocked: true,
    previewUrl: null,
    outputMime: "image/png",
  });
  const [busy, setBusy] = useState(false);

  const loadFile = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) return;
    setBusy(true);
    try {
      if (urlsRef.current.src) URL.revokeObjectURL(urlsRef.current.src);
      if (urlsRef.current.preview) URL.revokeObjectURL(urlsRef.current.preview);
      const src = URL.createObjectURL(file);
      urlsRef.current = { src, preview: null };
      fileRef.current = file;

      const dims = await new Promise<{ w: number; h: number }>(
        (resolve, reject) => {
          const img = new Image();
          img.onload = () =>
            resolve({ w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => reject(new Error("Image load failed"));
          img.src = src;
        },
      );

      const mime: OutputMime =
        file.type === "image/jpeg"
          ? "image/jpeg"
          : file.type === "image/webp"
            ? "image/webp"
            : "image/png";

      setState({
        src,
        naturalW: dims.w,
        naturalH: dims.h,
        fileSize: file.size,
        width: dims.w,
        height: dims.h,
        aspectLocked: true,
        previewUrl: null,
        outputMime: mime,
      });
    } finally {
      setBusy(false);
    }
  }, []);

  const setWidth = useCallback((w: number) => {
    setState((prev) => {
      if (!prev.naturalW || !prev.naturalH) return prev;
      const width = Math.max(1, Math.round(w));
      if (!prev.aspectLocked) {
        return { ...prev, width };
      }
      const ratio = prev.naturalH / prev.naturalW;
      const height = Math.max(1, Math.round(width * ratio));
      return { ...prev, width, height };
    });
  }, []);

  const setHeight = useCallback((h: number) => {
    setState((prev) => {
      if (!prev.naturalW || !prev.naturalH) return prev;
      const height = Math.max(1, Math.round(h));
      if (!prev.aspectLocked) {
        return { ...prev, height };
      }
      const ratio = prev.naturalW / prev.naturalH;
      const width = Math.max(1, Math.round(height * ratio));
      return { ...prev, width, height };
    });
  }, []);

  const toggleAspect = useCallback(() => {
    setState((prev) => ({ ...prev, aspectLocked: !prev.aspectLocked }));
  }, []);

  const applyPreset = useCallback((width: number, height: number) => {
    setState((prev) => ({
      ...prev,
      width,
      height,
      aspectLocked: false,
    }));
  }, []);

  const setOutputMime = useCallback((mime: OutputMime) => {
    setState((prev) => ({ ...prev, outputMime: mime }));
  }, []);

  const renderPreview = useCallback(async () => {
    const src = urlsRef.current.src;
    if (!src) return;
    setBusy(true);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Image load failed"));
        image.src = src;
      });
      const canvas = document.createElement("canvas");
      canvas.width = state.width;
      canvas.height = state.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, state.width, state.height);
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(
          (b) => resolve(b),
          state.outputMime,
          state.outputMime === "image/png" ? undefined : 0.92,
        ),
      );
      if (!blob) return;
      if (urlsRef.current.preview) URL.revokeObjectURL(urlsRef.current.preview);
      const previewUrl = URL.createObjectURL(blob);
      urlsRef.current.preview = previewUrl;
      setState((prev) => ({ ...prev, previewUrl }));
    } finally {
      setBusy(false);
    }
  }, [state.height, state.outputMime, state.width]);

  const download = useCallback(() => {
    if (!state.previewUrl) return;
    const ext =
      state.outputMime === "image/jpeg"
        ? "jpg"
        : state.outputMime === "image/webp"
          ? "webp"
          : "png";
    const a = document.createElement("a");
    a.href = state.previewUrl;
    a.download = `resized-${state.width}x${state.height}.${ext}`;
    a.click();
  }, [state.outputMime, state.previewUrl, state.height, state.width]);

  const reset = useCallback(() => {
    if (urlsRef.current.src) URL.revokeObjectURL(urlsRef.current.src);
    if (urlsRef.current.preview) URL.revokeObjectURL(urlsRef.current.preview);
    urlsRef.current = { src: null, preview: null };
    fileRef.current = null;
    setState({
      src: null,
      naturalW: 0,
      naturalH: 0,
      fileSize: 0,
      width: 0,
      height: 0,
      aspectLocked: true,
      previewUrl: null,
      outputMime: "image/png",
    });
  }, []);

  return {
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
  };
}
