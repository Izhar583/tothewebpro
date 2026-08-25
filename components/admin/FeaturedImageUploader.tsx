"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface FeaturedImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onToast?: (toast: { type: "success" | "error"; message: string }) => void;
}

export function FeaturedImageUploader({
  value,
  onChange,
  onToast,
}: FeaturedImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      onToast?.({
        type: "error",
        message: "Only image files (JPG, PNG, WebP, GIF, SVG, AVIF) can be uploaded.",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      onChange(data.url);
      onToast?.({
        type: "success",
        message: "Featured image uploaded & set successfully!",
      });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      onToast?.({ type: "error", message: msg });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Clipboard Paste Handler (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    // 1. Check for image files in clipboard
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            uploadFile(file);
            return;
          }
        }
      }
    }

    // 2. Check for image URL in clipboard text
    const pastedText = e.clipboardData?.getData("text")?.trim();
    if (
      pastedText &&
      (pastedText.startsWith("http://") ||
        pastedText.startsWith("https://") ||
        pastedText.startsWith("/uploads/") ||
        pastedText.startsWith("/blog/"))
    ) {
      // If it looks like an image URL or image path
      const isImageUrl =
        /\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(pastedText) ||
        pastedText.includes("/uploads/") ||
        pastedText.includes("/blog/");

      if (isImageUrl) {
        e.preventDefault();
        onChange(pastedText);
        onToast?.({
          type: "success",
          message: "Image URL pasted and set as featured image!",
        });
      }
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onPaste={handlePaste}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
    >
      <div className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={16} className="text-orange-500" />
          <span>Featured Image</span>
        </div>
        <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100 flex items-center gap-1">
          <Sparkles size={11} />
          <span>Paste (Ctrl+V) Supported</span>
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {value ? (
        <div className="space-y-3">
          {/* Image Preview Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border transition-all ${
              isDragging
                ? "border-orange-500 ring-4 ring-orange-500/20 scale-[1.01]"
                : "border-slate-200"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Featured Image Preview"
              className="w-full h-full object-cover"
            />

            {uploading && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                <RefreshCw size={24} className="animate-spin text-orange-400" />
                <span className="text-xs font-bold">Uploading new image...</span>
              </div>
            )}

            {isDragging && (
              <div className="absolute inset-0 bg-orange-600/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-10">
                <Upload size={28} className="animate-bounce" />
                <span className="text-sm font-extrabold">Drop image to replace</span>
              </div>
            )}
          </div>

          {/* Image URL display and actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Image URL (/uploads/... or https://...)"
                className="w-full text-xs font-mono text-slate-700 border border-slate-200 rounded-xl pl-3 pr-8 py-2 bg-slate-50 focus:bg-white focus:border-orange-500 outline-none"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                title="Copy URL"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                {copied ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onChange("")}
              title="Remove Image"
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Upload size={13} />
              <span>Select File</span>
            </button>

            <label
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer py-2.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Replace Image</span>
            </label>
          </div>
        </div>
      ) : (
        /* Empty Upload / Paste Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-orange-500 bg-orange-50/50 scale-[1.01]"
              : isFocused
              ? "border-orange-400 bg-orange-50/20"
              : "border-slate-200 hover:border-orange-400 hover:bg-slate-50/50"
          }`}
        >
          {uploading ? (
            <div className="py-4 space-y-2">
              <RefreshCw size={28} className="mx-auto text-orange-500 animate-spin" />
              <p className="text-xs font-bold text-slate-700">
                Uploading image to server...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-xs border border-orange-100">
                <Upload size={22} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select, drag &amp; drop, or <span className="text-orange-600 underline">paste (Ctrl+V)</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Copy any image from web / screenshot and press Ctrl+V here
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-orange-600/20 transition-colors">
                <Upload size={13} />
                <span>Choose Image File</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
