"use client";

import imageCompression from "browser-image-compression";
import { useCallback, useRef, useState } from "react";

export interface CompressedItem {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  compressedFile: File;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function useImageCompressor() {
  const [quality, setQuality] = useState(80);
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const qualityRef = useRef(quality);
  const itemsRef = useRef(items);
  qualityRef.current = quality;
  itemsRef.current = items;

  const compressFile = useCallback(async (file: File): Promise<CompressedItem> => {
    const q = qualityRef.current;
    const options = {
      maxSizeMB: 50,
      maxWidthOrHeight: 4096,
      useWebWorker: true,
      initialQuality: q / 100,
      fileType: file.type,
    };
    const compressedFile = await imageCompression(file, options);
    const previewUrl = URL.createObjectURL(compressedFile);
    return {
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      previewUrl,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressedFile,
    };
  }, []);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) =>
        ACCEPTED.includes(f.type),
      );
      if (list.length === 0) return;
      setProcessing(true);
      try {
        const next: CompressedItem[] = [];
        for (const f of list.slice(0, 20)) {
          next.push(await compressFile(f));
        }
        setItems((prev) => {
          prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
          return next;
        });
      } finally {
        setProcessing(false);
      }
    },
    [compressFile],
  );

  const recompressAll = useCallback(async () => {
    const snapshot = itemsRef.current;
    if (snapshot.length === 0) return;
    setProcessing(true);
    try {
      const next: CompressedItem[] = [];
      for (const item of snapshot) {
        next.push(await compressFile(item.file));
      }
      setItems((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
        return next;
      });
    } finally {
      setProcessing(false);
    }
  }, [compressFile]);

  const reset = useCallback(() => {
    items.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setItems([]);
  }, [items]);

  return {
    quality,
    setQuality,
    items,
    processing,
    addFiles,
    recompressAll,
    reset,
  };
}
