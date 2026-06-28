/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { 
  Upload, X, Download, ImageIcon, Loader2, Wand2, 
  ShieldCheck, Undo, Redo, ZoomIn, 
  ZoomOut, Eraser, Paintbrush, Sparkles, RotateCcw, 
  AlertCircle, Check
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

// Curated Background Photos
const PRESET_BACKGROUNDS = [
  { id: "studio1", name: "Soft Studio", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80" },
  { id: "beach", name: "Sunny Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80" },
  { id: "nature", name: "Green Field", url: "https://images.unsplash.com/photo-1472214222541-d510753a4907?w=800&auto=format&fit=crop&q=80" },
  { id: "city", name: "City Lights", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=80" },
  { id: "brick", name: "Brick Wall", url: "https://images.unsplash.com/photo-1531685222403-f928502d2b30?w=800&auto=format&fit=crop&q=80" },
  { id: "office", name: "Modern Office", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80" },
  { id: "garden", name: "Rose Garden", url: "https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=800&auto=format&fit=crop&q=80" },
  { id: "neon", name: "Abstract Neon", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80" },
];

// Curated Background Colors & Gradients
const PRESET_COLORS = [
  "#FFFFFF",
  "#000000",
  "#F3F4F6",
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",
  "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
  "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
];

// Sample Images for instant testing
const SAMPLE_IMAGES = [
  {
    id: "portrait",
    name: "Portrait",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "product",
    name: "Product",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "cat",
    name: "Pet",
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "car",
    name: "Car",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&auto=format&fit=crop&q=80",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80"
  }
];

export function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"removed" | "original">("removed");

  // Editor Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<"background" | "eraseRestore">("background");
  
  // Background selection state
  const [bgType, setBgType] = useState<"transparent" | "color" | "image" | "blur">("transparent");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [blurLevel, setBlurLevel] = useState<"low" | "medium" | "high">("medium");

  // Brush settings
  const [brushMode, setBrushMode] = useState<"erase" | "restore">("erase");
  const [brushSize, setBrushSize] = useState(30);
  const [zoom, setZoom] = useState(1);

  // Undo/Redo tracking
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Cache Image elements for drawing
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const cutoutImageRef = useRef<HTMLImageElement | null>(null);

  // Canvas interaction refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  // Undo/Redo stacks
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);

  // Brush outline hover position
  const [brushPos, setBrushPos] = useState({ x: 0, y: 0 });
  const [showBrushOutline, setShowBrushOutline] = useState(false);

  // Load original image into cache when preview changes
  useEffect(() => {
    if (preview) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = preview;
      img.onload = () => {
        originalImageRef.current = img;
      };
    } else {
      originalImageRef.current = null;
    }
  }, [preview]);

  // Load processed cutout image into cache when result changes
  useEffect(() => {
    if (result) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = result;
      img.onload = () => {
        cutoutImageRef.current = img;
      };
    } else {
      cutoutImageRef.current = null;
    }
  }, [result]);

  // Listen to paste events for convenience
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              handleFile(blob);
            }
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
    setResult(null);
    setError(null);
    setActiveTab("removed");
  };

  const handleSelectSample = async (url: string) => {
    setIsProcessing(true);
    setProgress(10);
    setProgressText("Fetching sample image...");
    setError(null);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const sampleFile = new File([blob], "sample.jpg", { type: "image/jpeg" });
      handleFile(sampleFile);
      // Wait for React state to process file
      setTimeout(() => {
        triggerRemoval(sampleFile);
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to download sample. Please try uploading your own file.");
      setIsProcessing(false);
    }
  };

  const triggerRemoval = async (fileToProcess: File) => {
    setIsProcessing(true);
    setProgress(20);
    setProgressText("Loading AI model locally...");
    setError(null);

    try {
      // Simulate progress updates for UI feedback
      const textStages = [
        "Analyzing outlines...",
        "Identifying background regions...",
        "Applying edge refining filters...",
        "Extracting subject foreground..."
      ];
      let textIdx = 0;

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return 90;
          }
          // Increment text occasionally
          if (prev % 20 === 0 && textIdx < textStages.length) {
            setProgressText(textStages[textIdx++]);
          }
          return prev + 5;
        });
      }, 350);

      setProgressText("Running AI removal (WASM)...");
      const config: any = {
        debug: false,
        model: "small", // "small" works faster and offline
        output: {
          format: "image/png",
          quality: 0.8,
          type: "foreground"
        },
        publicPath: "https://staticimgly.com/@imgly/background-removal-data/1.4.5/dist/"
      };

      const blob = await removeBackground(fileToProcess, config);
      const url = URL.createObjectURL(blob);
      setResult(url);
      setProgress(100);
      setProgressText("Complete!");

      clearInterval(interval);
    } catch (err: any) {
      console.error("AI Error:", err);
      setError(`Background removal failed: ${err.message || "Unknown error"}. Please try again.`);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag Drop Handlers
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFile(droppedFile);
      triggerRemoval(droppedFile);
    }
  }, []);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setBgType("transparent");
    setBgImage(null);
    setIsEditorOpen(false);
  };

  // Download directly from the main view
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

  // Canvas Editor Engine logic
  const pushHistory = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Clear future history states if we were in the middle of undoing
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(imgData);
    
    // Cap memory footprint to 15 items
    if (newHistory.length > 15) {
      newHistory.shift();
    }
    
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    }
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  };

  const redo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    }
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const initEditorCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const cutoutImg = cutoutImageRef.current;
    if (!canvas || !cutoutImg) return;

    canvas.width = cutoutImg.naturalWidth;
    canvas.height = cutoutImg.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cutoutImg, 0, 0);

    // Initial state setup
    historyRef.current = [];
    historyIndexRef.current = -1;
    pushHistory(canvas);
  }, [pushHistory]);

  // Run canvas initialization when editor opens
  useEffect(() => {
    if (isEditorOpen) {
      setZoom(1);
      // Wait for canvas DOM node to be parsed
      const timer = setTimeout(() => {
        initEditorCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditorOpen, initEditorCanvas]);

  // Coordinate mapper for mouse/touch on scaled canvas
  const getCanvasCoords = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const handlePointerDown = (e: any) => {
    if (editorTab !== "eraseRestore") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawing.current = true;
    const { x, y } = getCanvasCoords(e, canvas);
    lastX.current = x;
    lastY.current = y;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (brushMode === "erase") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Restore Mode: clip and draw originalImage background details inside the brush circle
      const origImg = originalImageRef.current;
      if (origImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }
  };

  const handlePointerMove = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Track mouse position for brush overlay
    const wrapperRect = canvasWrapperRef.current?.getBoundingClientRect();
    if (wrapperRect) {
      let clientX = 0;
      let clientY = 0;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      setBrushPos({
        x: clientX - wrapperRect.left,
        y: clientY - wrapperRect.top
      });
    }

    if (!isDrawing.current || editorTab !== "eraseRestore") return;

    const { x, y } = getCanvasCoords(e, canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (brushMode === "erase") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();
    } else {
      const origImg = originalImageRef.current;
      if (origImg) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(lastX.current, lastY.current);
        ctx.lineTo(x, y);
        ctx.clip();
        ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }

    lastX.current = x;
    lastY.current = y;
  };

  const handlePointerUp = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      const canvas = canvasRef.current;
      if (canvas) {
        pushHistory(canvas);
      }
    }
  };

  const clearEdits = () => {
    if (window.confirm("Are you sure you want to clear your manual brush edits?")) {
      initEditorCanvas();
    }
  };

  const drawCoverImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let sWidth = img.width;
    let sHeight = img.height;
    let sx = 0;
    let sy = 0;

    if (imgRatio > canvasRatio) {
      sWidth = img.height * canvasRatio;
      sx = (img.width - sWidth) / 2;
    } else {
      sHeight = img.width / canvasRatio;
      sy = (img.height - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w, h);
  };

  // Composite the selected background behind the edited canvas and download
  const handleDownloadEdited = async () => {
    const canvas = canvasRef.current;
    const origImg = originalImageRef.current;
    if (!canvas || !origImg) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // 1. Draw Selected Background
    if (bgType === "color") {
      if (bgColor.startsWith("linear-gradient")) {
        const hexes = bgColor.match(/#[a-fA-F0-9]{6}/g);
        if (hexes && hexes.length >= 2) {
          const grad = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
          grad.addColorStop(0, hexes[0]);
          grad.addColorStop(1, hexes[1]);
          tempCtx.fillStyle = grad;
        } else {
          tempCtx.fillStyle = "#ffffff";
        }
      } else {
        tempCtx.fillStyle = bgColor;
      }
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    } else if (bgType === "image" && bgImage) {
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = bgImage;
      await new Promise((resolve) => {
        bgImg.onload = resolve;
        bgImg.onerror = resolve;
      });
      drawCoverImage(tempCtx, bgImg, tempCanvas.width, tempCanvas.height);
    } else if (bgType === "blur") {
      const blurPx = blurLevel === "low" ? 12 : blurLevel === "medium" ? 32 : 64;
      tempCtx.filter = `blur(${blurPx}px)`;
      // Expand source slightly to mask transparent blur borders
      const scaleOffset = blurPx * 1.5;
      tempCtx.drawImage(
        origImg, 
        -scaleOffset, 
        -scaleOffset, 
        tempCanvas.width + scaleOffset * 2, 
        tempCanvas.height + scaleOffset * 2
      );
      tempCtx.filter = "none";
    }

    // 2. Draw edited cutout foreground on top
    tempCtx.drawImage(canvas, 0, 0);

    // 3. Trigger Save Dialog
    const link = document.createElement("a");
    link.href = tempCanvas.toDataURL("image/png");
    link.download = `removed-bg-edit-${file?.name || "image"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = e.target.files?.[0];
    if (uploadFile && uploadFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setBgImage(reader.result as string);
        setBgType("image");
      };
      reader.readAsDataURL(uploadFile);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Header Hero section */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Remove Image <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Background</span>
        </h1>
        <p className="text-slate-600 text-sm md:text-base font-semibold">
          100% Automatically and Free &bull; Secure On-Device AI Privacy
        </p>

        {error && (
          <div className="mx-auto max-w-md bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold text-left">{error}</span>
          </div>
        )}
      </div>

      {/* 2. Main Workspace Layout */}
      {!preview ? (
        // Landing View: Dropzone + Promo Column
        <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Info Card */}
          <div className="lg:col-span-5 space-y-6 text-left pr-4">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              Why use our Background Remover?
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Privacy Preserved</h4>
                  <p className="text-xs text-slate-500 font-medium">Your photos never leave your device. All calculations are executed locally via secure WASM logic inside your browser tab.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Full Resolution HD Exports</h4>
                  <p className="text-xs text-slate-500 font-medium">Unlike online options that lock HD downloads behind credits, we let you export full-resolution images absolutely free.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Built-in Rich Image Editor</h4>
                  <p className="text-xs text-slate-500 font-medium">Instantly blur the original backdrop, add custom scenic views, use gradient swatches, or erase/restore details with a fine brush.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Zone Card */}
          <div className="lg:col-span-7">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => document.getElementById("bg-remover-upload")?.click()}
              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-[32px] border-4 border-dashed border-orange-100 bg-white shadow-[0_15px_30px_-10px_rgba(249,115,22,0.1)] transition-all duration-300 hover:border-orange-500/60 hover:shadow-[0_20px_40px_-5px_rgba(249,115,22,0.15)] py-10 px-6 min-h-[340px]"
            >
              <input
                id="bg-remover-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const uploaded = e.target.files?.[0];
                  if (uploaded) {
                    handleFile(uploaded);
                    triggerRemoval(uploaded);
                  }
                }}
              />
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white shadow-md">
                <Upload className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-xl font-black text-slate-900">Upload Image</h3>
              <p className="mt-2 text-sm text-slate-500 font-medium mb-8">Or drag a file, paste (<span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-bold">Ctrl+V</span>)</p>

              {/* Sample Images Tray */}
              <div className="w-full" onClick={(e) => e.stopPropagation()}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Don&apos;t have an image? Try these:</p>
                <div className="flex justify-center gap-3">
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample.url)}
                      className="group/btn relative w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm transition-transform hover:scale-110 hover:border-orange-500"
                      title={`Try ${sample.name} sample`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sample.thumbnail} alt={sample.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isProcessing ? (
        // Loading / Running AI state
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-orange-50 shadow-lg text-center space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <Loader2 className="h-14 w-14 text-orange-500 animate-spin" />
            <span className="absolute text-xs font-bold text-slate-600">{progress}%</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900">{progressText}</h3>
            <p className="text-xs text-slate-400 font-medium">
              This stays completely in your browser. Download size ~20MB of AI assets on first load.
            </p>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        // Results State (Preview tabs + download side card)
        <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          {/* Left panel: Image tab renderer */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("removed")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "removed" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Removed Background
                </button>
                <button
                  onClick={() => setActiveTab("original")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "original" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Original
                </button>
              </div>

              {/* Reset button */}
              <button 
                onClick={reset}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>

            {/* Preview Area */}
            <div className="p-6 flex items-center justify-center bg-slate-50 min-h-[350px]">
              <div className="relative max-w-full max-h-[480px] rounded-2xl overflow-hidden shadow-sm">
                {activeTab === "removed" && result ? (
                  <div className="relative bg-slate-200" style={{
                    backgroundImage: "conic-gradient(#f8fafc 90deg, #e2e8f0 90deg 180deg, #f8fafc 180deg 270deg, #e2e8f0 270deg)",
                    backgroundSize: "20px 20px"
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={result} 
                      alt="Cutout Subject" 
                      className="max-h-[480px] object-contain block select-none" 
                    />
                    
                    {/* Overlay Edit Button */}
                    <button
                      onClick={() => setIsEditorOpen(true)}
                      className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-900/90 text-white hover:bg-slate-900 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur shadow-lg transform active:scale-95 transition-all"
                    >
                      <Wand2 className="h-4 w-4 text-orange-400" />
                      Edit Details
                    </button>
                  </div>
                ) : (
                  preview && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={preview} 
                      alt="Original Image Source" 
                      className="max-h-[480px] object-contain block select-none" 
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Download widgets */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 text-left">Download Image</h3>
              
              <div className="space-y-4">
                {/* Standard Download Option */}
                <div className="border border-slate-100 hover:border-orange-500/30 rounded-2xl p-4 text-left transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Standard Cutout</span>
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Free HD</span>
                  </div>
                  <button
                    onClick={downloadResult}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-xl font-bold shadow-md transform active:scale-95 transition-all text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Download PNG
                  </button>
                </div>

                {/* Edit & Customize Option */}
                <div className="border border-slate-100 hover:border-orange-500/30 rounded-2xl p-4 text-left transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Visual Editor</span>
                    <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">Creative</span>
                  </div>
                  <button
                    onClick={() => setIsEditorOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:opacity-95 py-3 rounded-xl font-bold shadow-md transform active:scale-95 transition-all text-sm"
                  >
                    <Wand2 className="h-4 w-4" />
                    Add Background / Erase
                  </button>
                </div>
              </div>
            </div>

            {/* Local WASM Trust Badge */}
            <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 text-left space-y-2">
              <div className="flex items-center gap-2 text-orange-600">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <h4 className="text-sm font-bold text-slate-900">Privacy Safeguard</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Background removal is fully handled by on-device computer vision models. No image metadata is transmitted to servers. Secure, private, fast.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. The Custom Premium Backdrop/Brush Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Editor Header */}
            <div className="h-16 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between px-6 shrink-0">
              {/* Title & Mode Selector */}
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black text-slate-800 tracking-tight hidden sm:block">Editor Suite</h2>
                
                {/* Tabs switcher */}
                <div className="flex gap-1 bg-slate-200/80 p-1 rounded-xl">
                  <button
                    onClick={() => setEditorTab("background")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      editorTab === "background" 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Background
                  </button>
                  <button
                    onClick={() => setEditorTab("eraseRestore")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      editorTab === "eraseRestore" 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Eraser className="h-3.5 w-3.5" />
                    Erase / Restore
                  </button>
                </div>
              </div>

              {/* Utility Canvas Bar: Undo, Redo, Zoom */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center border border-slate-200/80 rounded-xl bg-white px-1 py-0.5">
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Undo stroke"
                  >
                    <Undo className="h-4 w-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Redo stroke"
                  >
                    <Redo className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center border border-slate-200/80 rounded-xl bg-white px-1 py-0.5">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-[10px] font-bold text-slate-500 w-10 text-center select-none">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(3.0, z + 0.25))}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions: Download, Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadEdited}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transform active:scale-95 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
                  title="Close Editor"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Editor Workspace Splitter */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              
              {/* Left Panel: Canvas Display */}
              <div className="flex-1 bg-slate-900/95 overflow-auto flex items-center justify-center p-8 relative min-h-[300px]">
                
                {/* Visual canvas outer wrapper */}
                <div 
                  ref={canvasWrapperRef}
                  className="relative transition-shadow duration-300 max-w-full shadow-2xl rounded-lg"
                  onMouseEnter={() => setShowBrushOutline(true)}
                  onMouseLeave={() => {
                    setShowBrushOutline(false);
                    handlePointerUp();
                  }}
                  onMouseMove={handlePointerMove}
                  style={{
                    // Height and width scaled dynamically by Zoom state
                    transform: `scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: "transform 0.15s ease-out"
                  }}
                >
                  {/* Background Layer (Blur/Photo/Color/Grid) */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-lg">
                    {bgType === "transparent" && (
                      <div className="absolute inset-0 bg-slate-200" style={{
                        backgroundImage: "conic-gradient(#f8fafc 90deg, #e2e8f0 90deg 180deg, #f8fafc 180deg 270deg, #e2e8f0 270deg)",
                        backgroundSize: "20px 20px"
                      }} />
                    )}
                    {bgType === "color" && (
                      <div className="absolute inset-0" style={{ background: bgColor }} />
                    )}
                    {bgType === "image" && bgImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={bgImage} 
                        alt="Background Template" 
                        className="w-full h-full object-cover" 
                      />
                    )}
                    {bgType === "blur" && preview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={preview} 
                        alt="Original Blurred Backdrop" 
                        className="w-full h-full object-cover scale-110"
                        style={{
                          filter: `blur(${blurLevel === "low" ? "8px" : blurLevel === "medium" ? "24px" : "48px"})`
                        }}
                      />
                    )}
                  </div>

                  {/* Interactive Canvas Rendering layer */}
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    className="relative z-10 block max-h-[60vh] max-w-full object-contain cursor-crosshair select-none bg-transparent"
                  />

                  {/* Circular Hover Brush Outline indicator */}
                  {showBrushOutline && editorTab === "eraseRestore" && canvasRef.current && (
                    <div
                      className="pointer-events-none border border-white rounded-full absolute z-30 shadow-[0_0_0_1.5px_rgba(0,0,0,0.6)]"
                      style={{
                        left: brushPos.x,
                        top: brushPos.y,
                        // BoundingClientRect handles scaling visual brush outline with zoom dynamically
                        width: brushSize * (canvasRef.current.getBoundingClientRect().width / canvasRef.current.width),
                        height: brushSize * (canvasRef.current.getBoundingClientRect().width / canvasRef.current.width),
                        transform: "translate(-50%, -50%)",
                        backgroundColor: brushMode === "erase" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                        borderColor: brushMode === "erase" ? "#EF4444" : "#10B981",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Right Panel: Side Controls Sidebar */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-100 bg-white p-6 overflow-y-auto flex flex-col gap-6 shrink-0 h-[40vh] md:h-full text-left">
                
                {/* TAB 1: BACKGROUND SELECTION LOGIC */}
                {editorTab === "background" && (
                  <div className="space-y-6">
                    {/* Background Category Selector */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Background Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setBgType("transparent")}
                          className={`py-2 px-3 border rounded-xl text-xs font-bold text-center transition-colors ${
                            bgType === "transparent" 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Transparent
                        </button>
                        <button
                          onClick={() => setBgType("blur")}
                          className={`py-2 px-3 border rounded-xl text-xs font-bold text-center transition-colors ${
                            bgType === "blur" 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Blur Original
                        </button>
                        <button
                          onClick={() => setBgType("image")}
                          className={`py-2 px-3 border rounded-xl text-xs font-bold text-center transition-colors ${
                            bgType === "image" 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Scenic Photo
                        </button>
                        <button
                          onClick={() => setBgType("color")}
                          className={`py-2 px-3 border rounded-xl text-xs font-bold text-center transition-colors ${
                            bgType === "color" 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Color/Gradient
                        </button>
                      </div>
                    </div>

                    {/* Blur selection options */}
                    {bgType === "blur" && (
                      <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Blur Intensity</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["low", "medium", "high"] as const).map((level) => (
                            <button
                              key={level}
                              onClick={() => setBlurLevel(level)}
                              className={`py-1.5 border rounded-xl text-xs font-bold uppercase transition-colors ${
                                blurLevel === level 
                                  ? "bg-orange-500 border-orange-500 text-white" 
                                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scenic photo presets */}
                    {bgType === "image" && (
                      <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Photos</label>
                          <label className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">
                            Upload Custom
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleCustomBgUpload} 
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {PRESET_BACKGROUNDS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setBgImage(item.url);
                                setBgType("image");
                              }}
                              className={`aspect-square rounded-xl overflow-hidden border-2 relative transition-transform hover:scale-105 ${
                                bgImage === item.url && bgType === "image"
                                  ? "border-orange-500 shadow-md"
                                  : "border-transparent"
                              }`}
                              title={item.name}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                              {bgImage === item.url && bgType === "image" && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Solid / gradient colors */}
                    {bgType === "color" && (
                      <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block font-bold">Colors & Gradients</label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Custom</span>
                            <input 
                              type="color" 
                              value={bgColor.startsWith("#") ? bgColor : "#FFFFFF"}
                              onChange={(e) => {
                                setBgColor(e.target.value);
                                setBgType("color");
                              }}
                              className="w-5 h-5 rounded border border-slate-200 cursor-pointer p-0 shrink-0" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {PRESET_COLORS.map((col, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setBgColor(col);
                                setBgType("color");
                              }}
                              className={`aspect-square rounded-xl border-2 transition-transform hover:scale-105 relative ${
                                bgColor === col && bgType === "color"
                                  ? "border-slate-800 scale-105"
                                  : "border-slate-100"
                              }`}
                              style={{
                                background: col
                              }}
                            >
                              {bgColor === col && bgType === "color" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Check className={`h-4 w-4 ${col === "#FFFFFF" ? "text-slate-800" : "text-white"}`} />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: MANUAL ERASE / RESTORE BRUSH PAINTING */}
                {editorTab === "eraseRestore" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Mode selector */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Brush Action</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setBrushMode("erase")}
                          className={`py-3 px-3 border rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                            brushMode === "erase" 
                              ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Eraser className="h-5 w-5" />
                          Erase Background
                        </button>
                        <button
                          onClick={() => setBrushMode("restore")}
                          className={`py-3 px-3 border rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                            brushMode === "restore" 
                              ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Paintbrush className="h-5 w-5" />
                          Restore Original
                        </button>
                      </div>
                    </div>

                    {/* Size Slider */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brush Size</label>
                        <span className="text-xs font-bold text-slate-600">{brushSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full accent-slate-900 cursor-pointer"
                      />
                    </div>

                    {/* Reset edits */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={clearEdits}
                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset All Manual Edits
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
