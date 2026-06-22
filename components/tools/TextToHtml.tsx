"use client";

import { useState, useRef } from "react";
import { Copy, Check, RotateCcw, Code, Eye, FileText, Layout } from "lucide-react";

export function TextToHtml() {
    const [html, setHtml] = useState("");
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        if (editorRef.current) {
            setHtml(editorRef.current.innerHTML);
        }
    };

    const clearEditor = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
            setHtml("");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(html);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
        handleInput();
    };

    // Helper for cleanup (stripping unnecessary styles)
    const cleanHtml = (raw: string) => {
        // This is a basic cleaner, in a real pro tool we might use a library
        return raw
            .replace(/ style="[^"]*"/g, "")
            .replace(/ class="[^"]*"/g, "")
            .replace(/<span[^>]*>/g, "")
            .replace(/<\/span>/g, "");
    };

    const getCleanedHtml = () => cleanHtml(html);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setViewMode("edit")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "edit"
                            ? "bg-white dark:bg-slate-700 text-orange-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Layout className="h-4 w-4" />
                        Visual Editor
                    </button>
                    <button
                        onClick={() => setViewMode("preview")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "preview"
                            ? "bg-white dark:bg-slate-700 text-orange-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Code className="h-4 w-4" />
                        HTML Output
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={clearEditor}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-all"
                        title="Clear All"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </button>
                    <button
                        onClick={copyToClipboard}
                        disabled={!html}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${copied
                            ? "bg-green-500 text-white"
                            : "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-500/20 disabled:opacity-50"
                            }`}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy HTML"}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 h-[500px]">
                {/* Editor Pane */}
                <div className={`flex flex-col rounded-3xl border border-orange-100 bg-white overflow-hidden shadow-sm ${viewMode === "preview" ? "hidden lg:flex" : "flex"}`}>
                    <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-orange-50 overflow-x-auto">
                        <button
                            onClick={() => execCommand("bold")}
                            className="p-2 hover:bg-orange-100 rounded-lg text-slate-700 font-bold w-10"
                            title="Bold"
                        >
                            B
                        </button>
                        <button
                            onClick={() => execCommand("italic")}
                            className="p-2 hover:bg-orange-100 rounded-lg text-slate-700 italic w-10"
                            title="Italic"
                        >
                            I
                        </button>
                        <button
                            onClick={() => execCommand("formatBlock", "h1")}
                            className="p-2 hover:bg-orange-100 rounded-lg text-slate-700 text-xs font-bold"
                            title="Heading 1"
                        >
                            H1
                        </button>
                        <button
                            onClick={() => execCommand("formatBlock", "h2")}
                            className="p-2 hover:bg-orange-100 rounded-lg text-slate-700 text-xs font-bold"
                            title="Heading 2"
                        >
                            H2
                        </button>
                        <div className="w-[1px] h-6 bg-slate-200 mx-1" />
                        <button
                            onClick={() => execCommand("insertUnorderedList")}
                            className="p-2 hover:bg-orange-100 rounded-lg text-slate-700"
                            title="Bullet List"
                        >
                            • List
                        </button>
                        <button
                            onClick={() => execCommand("insertOrderedList")}
                            className="p-2 hover:bg-orange-100 rounded-lg text-slate-700"
                            title="Numbered List"
                        >
                            1. List
                        </button>
                        <div className="w-[1px] h-6 bg-slate-200 mx-1" />
                        <button
                            onClick={() => {
                                const url = prompt("Enter link URL:");
                                if (url) execCommand("createLink", url);
                            }}
                            className="p-2 hover:bg-orange-100 rounded-lg text-slate-700"
                            title="Link"
                        >
                            Link
                        </button>
                    </div>
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        className="flex-1 p-6 outline-none overflow-y-auto prose prose-slate max-w-none prose-orange"
                    />
                </div>

                {/* Console / HTML Pane */}
                <div className={`flex flex-col rounded-3xl border border-slate-200 bg-slate-900 overflow-hidden shadow-xl ${viewMode === "edit" ? "hidden lg:flex" : "flex"}`}>
                    <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Code className="h-3 w-3" />
                            Clean HTML Output
                        </span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-600" />
                            <div className="w-3 h-3 rounded-full bg-slate-600" />
                            <div className="w-3 h-3 rounded-full bg-slate-600" />
                        </div>
                    </div>
                    <pre className="flex-1 p-6 overflow-y-auto font-mono text-sm text-amber-400/90 leading-relaxed scrollbar-hide">
                        <code>
                            {getCleanedHtml() || `<!-- Your HTML will appear here -->`}
                        </code>
                    </pre>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900">{html.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}</div>
                        <div className="text-xs text-slate-500 font-medium">Words</div>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Layout className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900">{html.replace(/<[^>]*>/g, '').length}</div>
                        <div className="text-xs text-slate-500 font-medium">Characters</div>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Eye className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900">{html.match(/<[a-z0-9]+[^>]*>/gi)?.length || 0}</div>
                        <div className="text-xs text-slate-500 font-medium">HTML Elements</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
