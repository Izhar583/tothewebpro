"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Undo,
  Redo,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  Code2,
  Upload,
  X,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function cleanPastedHtml(rawHtml: string): string {
  let html = rawHtml;

  html = html.replace(/<xml[^>]*>[\s\S]*?<\/xml>/gi, "");
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<meta[^>]*>/gi, "");
  html = html.replace(/<link[^>]*>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/gi, "");

  html = html.replace(/class="?Mso[a-zA-Z0-9_-]*"?/gi, "");
  html = html.replace(/style="[^"]*mso-[^"]*"/gi, "");

  html = html.replace(/<font[^>]*>([\s\S]*?)<\/font>/gi, "$1");

  html = html.replace(/<span>([\s\S]*?)<\/span>/gi, "$1");
  html = html.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, "<h2$1>$2</h2>");

  return html.trim();
}

function markdownToHtml(md: string): string {
  let html = md;

  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h2>$1</h2>");

  html = html.replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>");

  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, "<b><i>$1</i></b>");
  html = html.replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>");
  html = html.replace(/\*(.*?)\*/gim, "<i>$1</i>");
  html = html.replace(/___(.*?)___/gim, "<b><i>$1</i></b>");
  html = html.replace(/__(.*?)__/gim, "<b>$1</b>");
  html = html.replace(/_(.*?)_/gim, "<i>$1</i>");

  html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-xl my-4" />');

  html = html.replace(/^\s*[-*+]\s+(.*$)/gim, "<ul><li>$1</li></ul>");
  html = html.replace(/<\/ul>\s*<ul>/gim, "");

  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, "<ol><li>$1</li></ol>");
  html = html.replace(/<\/ol>\s*<ol>/gim, "");

  html = html.replace(/^---$/gim, "<hr />");

  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (
        !trimmed ||
        trimmed.startsWith("<h2") ||
        trimmed.startsWith("<h3") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<img")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Type or paste your article content here... (Supports Google Docs, ChatGPT, Word, Markdown, or HTML)",
  minHeight = "480px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value || "");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkNewTab, setLinkNewTab] = useState(true);
  const savedSelectionRef = useRef<Range | null>(null);

  // Image Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Table Modal State
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Synchronize incoming value changes with internal state if not currently typing
  const isInternalChangeRef = useRef(false);

  useEffect(() => {
    if (!isInternalChangeRef.current && editorRef.current) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
      setSourceCode(value || "");
    }
    isInternalChangeRef.current = false;
  }, [value]);

  const handleContentInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    isInternalChangeRef.current = true;
    setSourceCode(html);
    onChange(html);
  }, [onChange]);

  // Execute standard formatting commands
  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (isSourceMode) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleContentInput();
  };

  // Format Block helper (e.g. <h2>, <h3>, <p>, <blockquote>)
  const formatBlock = (tag: string) => {
    if (isSourceMode) return;
    document.execCommand("formatBlock", false, `<${tag}>`);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleContentInput();
  };

  // Smart Paste Handler
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (isSourceMode) return;
    e.preventDefault();

    const htmlData = e.clipboardData.getData("text/html");
    const plainText = e.clipboardData.getData("text/plain");

    let processedHtml = "";

    if (htmlData && htmlData.trim().length > 0) {
      // Clean HTML from Google Docs / MS Word / Web
      processedHtml = cleanPastedHtml(htmlData);
    } else if (plainText && plainText.trim().length > 0) {
      // Check if it's Markdown
      if (
        plainText.includes("# ") ||
        plainText.includes("## ") ||
        plainText.includes("**") ||
        plainText.includes("- ") ||
        plainText.includes("1. ") ||
        plainText.includes("```")
      ) {
        processedHtml = markdownToHtml(plainText);
      } else {
        // Plain text: wrap lines in paragraphs
        const lines = plainText.split(/\n\n+/);
        processedHtml = lines
          .map((line) => `<p>${line.trim().replace(/\n/g, "<br />")}</p>`)
          .join("");
      }
    }

    if (processedHtml) {
      document.execCommand("insertHTML", false, processedHtml);
      handleContentInput();
    }
  };

  // Save cursor range selection for modal insertions
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  // Link Modal triggers
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString() : "";
    setLinkText(selectedText);
    setLinkUrl("");
    setLinkModalOpen(true);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      setLinkModalOpen(false);
      return;
    }
    restoreSelection();
    const target = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
    const textToInsert = linkText.trim() || linkUrl.trim();
    const linkHtml = `<a href="${linkUrl.trim()}" class="text-blue-600 hover:text-blue-800 underline font-medium"${target}>${textToInsert}</a>`;
    document.execCommand("insertHTML", false, linkHtml);
    setLinkModalOpen(false);
    handleContentInput();
  };

  // Image Upload helper
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleInsertImage = () => {
    if (!imageUrl.trim()) {
      setImageModalOpen(false);
      return;
    }
    restoreSelection();
    const captionHtml = imageCaption.trim()
      ? `<figcaption className="text-center text-xs text-slate-500 mt-2">${imageCaption.trim()}</figcaption>`
      : "";
    const imageHtml = `
      <figure class="my-6 block">
        <img src="${imageUrl.trim()}" alt="${imageAlt.trim() || "Article illustration"}" class="w-full rounded-2xl border border-slate-200 shadow-sm object-cover" />
        ${captionHtml}
      </figure>
    `;
    document.execCommand("insertHTML", false, imageHtml);
    setImageModalOpen(false);
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    handleContentInput();
  };

  // Table Insertion
  const handleInsertTable = () => {
    restoreSelection();
    let tableHtml = '<table class="w-full border-collapse border border-slate-300 my-6 rounded-xl overflow-hidden text-sm"><tbody>';
    for (let r = 0; r < tableRows; r++) {
      tableHtml += "<tr>";
      for (let c = 0; c < tableCols; c++) {
        if (r === 0) {
          tableHtml += `<th class="border border-slate-300 bg-slate-100 p-3 text-left font-bold text-slate-800">Header ${c + 1}</th>`;
        } else {
          tableHtml += `<td class="border border-slate-300 p-3 text-slate-700">Row ${r} Col ${c + 1}</td>`;
        }
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</tbody></table>";

    document.execCommand("insertHTML", false, tableHtml);
    setTableModalOpen(false);
    handleContentInput();
  };

  // Toggle Source Code Mode
  const toggleSourceMode = () => {
    if (isSourceMode) {
      // Switching from Code -> Visual
      if (editorRef.current) {
        editorRef.current.innerHTML = sourceCode;
      }
      onChange(sourceCode);
      setIsSourceMode(false);
    } else {
      // Switching from Visual -> Code
      if (editorRef.current) {
        setSourceCode(editorRef.current.innerHTML);
      }
      setIsSourceMode(true);
    }
  };

  // Word, Character & Read Time Counts
  const rawCleanText = (isSourceMode ? sourceCode : value || "")
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim();

  const wordsCount = rawCleanText ? rawCleanText.split(/\s+/).filter(Boolean).length : 0;
  const charsCount = rawCleanText.length;
  const readTimeEst = Math.max(1, Math.ceil(wordsCount / 200));

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all flex flex-col ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none h-screen w-screen"
          : "relative"
      }`}
    >
      {/* CKEditor Top Bar / Menu Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo / Redo */}
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => execCmd("undo")}
              title="Undo (Ctrl+Z)"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            >
              <Undo size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("redo")}
              title="Redo (Ctrl+Y)"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            >
              <Redo size={15} />
            </button>
          </div>

          {/* Source HTML Mode Switch */}
          <button
            type="button"
            onClick={toggleSourceMode}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isSourceMode
                ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle HTML Source Code View"
          >
            <Code2 size={14} />
            <span>Source</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Heading / Block Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                formatBlock(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue=""
            disabled={isSourceMode}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-300 focus:border-orange-500 outline-none cursor-pointer shadow-xs disabled:opacity-50"
            title="Select Heading / Block Style"
          >
            <option value="" disabled>
              Paragraph / Heading ▾
            </option>
            <option value="p">¶ Paragraph (Normal Text)</option>
            <option value="h2">H2 - Section Heading</option>
            <option value="h3">H3 - Sub Heading</option>
            <option value="h4">H4 - Small Heading</option>
            <option value="blockquote">❝ Quote / Callout Box</option>
            <option value="pre">⟨/⟩ Code Block</option>
          </select>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Text Formatting Icons */}
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => execCmd("bold")}
              disabled={isSourceMode}
              title="Bold (Ctrl+B)"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("italic")}
              disabled={isSourceMode}
              title="Italic (Ctrl+I)"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("underline")}
              disabled={isSourceMode}
              title="Underline (Ctrl+U)"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <Underline size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("strikeThrough")}
              disabled={isSourceMode}
              title="Strikethrough"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <Strikethrough size={15} />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => execCmd("justifyLeft")}
              disabled={isSourceMode}
              title="Align Left"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <AlignLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("justifyCenter")}
              disabled={isSourceMode}
              title="Align Center"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <AlignCenter size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("justifyRight")}
              disabled={isSourceMode}
              title="Align Right"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <AlignRight size={15} />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => execCmd("insertUnorderedList")}
              disabled={isSourceMode}
              title="Bullet List"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("insertOrderedList")}
              disabled={isSourceMode}
              title="Numbered List"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <ListOrdered size={15} />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Inserts: Link, Image, Table, HR */}
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={openLinkModal}
              disabled={isSourceMode}
              title="Insert Link"
              className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-40"
            >
              <LinkIcon size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setImageModalOpen(true);
              }}
              disabled={isSourceMode}
              title="Insert Image (Upload or URL)"
              className="p-1.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-40"
            >
              <ImageIcon size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setTableModalOpen(true);
              }}
              disabled={isSourceMode}
              title="Insert Table"
              className="p-1.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-40"
            >
              <TableIcon size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("insertHorizontalRule")}
              disabled={isSourceMode}
              title="Horizontal Divider"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-40"
            >
              <Minus size={15} />
            </button>
            <button
              type="button"
              onClick={() => execCmd("removeFormat")}
              disabled={isSourceMode}
              title="Clear Formatting"
              className="p-1.5 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-40"
            >
              <RemoveFormatting size={15} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 bg-slate-100 transition-colors shadow-xs"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>
      <div className="relative flex-1 flex flex-col min-h-0 bg-white">
        {isSourceMode ? (
          <div className="p-4 flex-1 flex flex-col">
            <div className="text-xs font-mono font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span>HTML Source Editor (Direct Code Editing)</span>
              <span>Edit HTML tags directly</span>
            </div>
            <textarea
              value={sourceCode}
              onChange={(e) => {
                setSourceCode(e.target.value);
                onChange(e.target.value);
              }}
              placeholder="<p>Write raw HTML code here...</p>"
              className="w-full flex-1 font-mono text-xs text-slate-100 bg-slate-900 p-4 rounded-2xl outline-none resize-none border border-slate-700 leading-relaxed min-h-[420px]"
            />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentInput}
            onPaste={handlePaste}
            onBlur={handleContentInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="p-6 sm:p-8 flex-1 outline-none text-slate-800 leading-relaxed text-base prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:text-slate-900 prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-xl prose-h3:text-slate-800 prose-h3:mt-4 prose-h3:mb-2 prose-p:text-slate-700 prose-p:my-3 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/60 prose-blockquote:p-3 prose-blockquote:rounded-r-xl prose-blockquote:my-4 prose-blockquote:italic prose-a:text-blue-600 prose-a:underline focus:ring-0 overflow-y-auto before:empty:content-[attr(data-placeholder)] before:empty:text-slate-400 before:empty:pointer-events-none"
          />
        )}
      </div>

      {/* Footer Metrics Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <strong className="text-slate-800 font-bold">{wordsCount}</strong>{" "}
            words
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <strong className="text-slate-800 font-bold">{charsCount}</strong>{" "}
            characters
          </span>
          <span className="text-slate-300">•</span>
          <span>
            ~<strong className="text-slate-800 font-bold">{readTimeEst}</strong>{" "}
            min read
          </span>
        </div>

        <div className="text-[11px] text-slate-400">
          Paste Google Docs, Word, or ChatGPT articles directly • Auto Formatted
        </div>
      </div>

      {/* Insert Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <LinkIcon size={16} className="text-blue-600" />
                <span>Insert Web Link</span>
              </h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Link URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /tools/..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Anchor Text (Display Text)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Open link in new browser tab</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ImageIcon size={16} className="text-orange-600" />
                <span>Insert Article Image</span>
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Upload Local Image File
                </label>
                <label className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-orange-50/30 transition-all">
                  <Upload size={24} className="text-orange-500 mb-2" />
                  <span className="text-xs font-bold text-slate-700">
                    {uploadingImage ? "Uploading to server..." : "Click to browse and upload image"}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  OR USE IMAGE URL
                </span>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/blog/image.webp or https://..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Alt Text (SEO)
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Descriptive alt text..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Caption displayed below..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {imageUrl && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim() || uploadingImage}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm disabled:opacity-50"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Table Modal */}
      {tableModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <TableIcon size={16} className="text-emerald-600" />
                <span>Insert Table Grid</span>
              </h3>
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Rows
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Columns
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
