/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { Upload, X, Download, ImageIcon, Loader2, Wand2, ShieldCheck, CheckCircle2 } from "lucide-react";

export function BackgroundRemover() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            handleFile(droppedFile);
        }
    }, []);

    const handleFile = (file: File) => {
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
        setResult(null);
        setError(null);
    };

    const removeBackground = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);
        setError(null);

        try {
            // Simulate progress for the "AI Model Loading"
            const interval = setInterval(() => {
                setProgress((prev) => (prev >= 90 ? 90 : prev + 5));
            }, 400);

            // Loading the script tag dynamically
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(window as any).imglyRemoveBackground) {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/bundle.js";
                script.async = true;
                document.head.appendChild(script);

                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = () => reject(new Error("Script download failed."));
                    setTimeout(() => reject(new Error("Loading timed out.")), 10000);
                });
            }

            // Check common global names for this library
            const imglyRemoveBackground = (window as any).imglyRemoveBackground ||
                ((window as any).imgly && (window as any).imgly.removeBackground);

            if (imglyRemoveBackground) {
                const config = {
                    debug: false,
                    model: "small", // Use small for best compatibility
                    output: {
                        format: "image/png",
                        quality: 0.8,
                        type: "foreground"
                    },
                    publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/" // Explicitly set public path for WASM
                };

                const blob = await imglyRemoveBackground(file, config);
                const url = URL.createObjectURL(blob);
                setResult(url);
                setProgress(100);
            } else {
                throw new Error("AI Library not found in window object. Possible script blocked by browser.");
            }

            clearInterval(interval);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("BG Removal Error:", err);
            setError(`Model loading failed: ${err.message || "Unknown error"}. Try a smaller image or check connection.`);
            setIsProcessing(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (result) {
            const link = document.createElement("a");
            link.href = result;
            link.download = `removed-bg-${file?.name || "image"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setIsProcessing(false);
        setProgress(0);
        setError(null);
    };

    return (
        <div className="space-y-8">
            {/* Tool Header Info */}
            <div className="flex items-center gap-4 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <Wand2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">AI-Powered Extraction</h3>
                    <p className="text-xs text-slate-500 font-medium">100% Private. No images ever leave your browser.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border border-orange-100 rounded-full">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Secure WASM</span>
                </div>
            </div>

            {!preview ? (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="group relative flex h-72 cursor-pointer flex-col items-center justify-center rounded-[32px] border-4 border-dashed border-orange-100 bg-white transition-all hover:border-orange-500/50 hover:bg-orange-50/30"
                >
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform group-hover:scale-110">
                        <Upload className="h-8 w-8" />
                    </div>
                    <p className="mt-4 text-lg font-black text-slate-900">Drop your image here</p>
                    <p className="mt-1 text-sm text-slate-500 font-medium">Or click to browse files</p>
                    <div className="mt-6 flex gap-3">
                        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400">JPG</span>
                        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400">PNG</span>
                        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400">WEBP</span>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8 ring-1 ring-orange-50 bg-white p-6 rounded-[32px]">
                    {/* Before / Upload Pane */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Original Image</span>
                            <button
                                onClick={reset}
                                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                                title="Remove image and start over"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
                            <img src={preview} alt="Original" className="w-full h-full object-contain" />
                            {!isProcessing && !result && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={removeBackground}
                                        className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl font-bold text-slate-900 shadow-xl hover:scale-105 transition-transform"
                                    >
                                        <Wand2 className="h-5 w-5 text-orange-600" />
                                        Remove Background
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* After / Result Pane */}
                    <div className="space-y-4 flex flex-col">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transparency Result</span>
                            {result && (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Processed
                                </span>
                            )}
                        </div>
                        <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                            {isProcessing ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm z-10">
                                    <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
                                    <p className="mt-4 text-center font-bold text-slate-900">AI is thinking...</p>
                                    <p className="text-xs text-slate-500 mt-1 text-center">Loading AI model (approx. 20MB) & processing locally...</p>
                                    <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                                        <div
                                            className="h-full bg-orange-600 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : result ? (
                                <img src={result} alt="Result" className="w-full h-full object-contain animate-in fade-in zoom-in duration-500" />
                            ) : error ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                    <X className="h-10 w-10 text-red-500" />
                                    <p className="mt-4 font-bold text-slate-900">{error}</p>
                                    <button onClick={removeBackground} className="mt-4 text-sm font-bold text-orange-600 hover:underline">Try Again</button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                                    <ImageIcon className="h-12 w-12 opacity-20" />
                                    <p className="mt-4 text-sm font-medium">Result will appear here</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={result ? downloadResult : removeBackground}
                            disabled={isProcessing}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${result
                                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20"
                                : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20"
                                } disabled:opacity-50`}
                        >
                            {result ? <Download className="h-5 w-5" /> : <Wand2 className="h-5 w-5" />}
                            {result ? "Download PNG" : "Process Now"}
                        </button>
                    </div>
                </div>
            )}

            {/* Trust & Features Footer */}
            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">Private Processing</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Images stay in your browser. No server uploads ever.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">HD Transparent PNG</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Get clean, high-resolution cutouts ready for any design.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-green-50 text-green-600">
                        <Loader2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">On-Device AI</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">No queueing or cooldowns. Process as many as you want.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
