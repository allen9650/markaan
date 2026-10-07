"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { WatermarkSettings, ImageItem } from "@/lib/watermark/types";
import { calculateWatermarkPosition } from "@/lib/watermark/positioning";
import {
  Eye,
  Move,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface WatermarkPreviewProps {
  settings: WatermarkSettings;
  onUpdateSettings: (settings: WatermarkSettings) => void;
  selectedImage: ImageItem | null;
  imageList: ImageItem[];
  onSelectImage: (item: ImageItem) => void;
  watermarkPreviewUrl: string | null;
  watermarkFile: File | null;
}

export function WatermarkPreview({
  settings,
  onUpdateSettings,
  selectedImage,
  imageList,
  onSelectImage,
  watermarkPreviewUrl,
  watermarkFile,
}: WatermarkPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [serverPreviewUrl, setServerPreviewUrl] = useState<string | null>(null);
  const [isLoadingServerPreview, setIsLoadingServerPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"interactive" | "sharp">("interactive");

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const currentIndex = selectedImage ? imageList.findIndex((img) => img.id === selectedImage.id) : -1;

  const handlePrevImage = () => {
    if (imageList.length === 0) return;
    const prevIdx = (currentIndex - 1 + imageList.length) % imageList.length;
    onSelectImage(imageList[prevIdx]);
    setServerPreviewUrl(null);
  };

  const handleNextImage = () => {
    if (imageList.length === 0) return;
    const nextIdx = (currentIndex + 1) % imageList.length;
    onSelectImage(imageList[nextIdx]);
    setServerPreviewUrl(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (settings.position !== "custom") {
      onUpdateSettings({ ...settings, position: "custom" });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = Math.max(0, Math.min(100, (clientX / rect.width) * 100));
      const normY = Math.max(0, Math.min(100, (clientY / rect.height) * 100));

      onUpdateSettings({
        ...settings,
        position: "custom",
        customX: normX,
        customY: normY,
      });
    },
    [isDragging, settings, onUpdateSettings]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const fetchSharpPreview = async () => {
    try {
      setIsLoadingServerPreview(true);
      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage.file);
      }
      if (watermarkFile) {
        formData.append("watermark", watermarkFile);
      }
      formData.append("settings", JSON.stringify(settings));

      const res = await fetch("/api/watermark/preview", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to load server preview");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setServerPreviewUrl(url);
      setPreviewMode("sharp");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingServerPreview(false);
    }
  };

  const cWidth = containerSize.width || 800;
  const cHeight = containerSize.height || 500;
  const wmWidth = Math.round(cWidth * (settings.sizePercent / 100));
  const wmHeight = Math.round(wmWidth / 3.8);

  const pos = calculateWatermarkPosition({
    imageWidth: cWidth,
    imageHeight: cHeight,
    wmWidth,
    wmHeight,
    position: settings.position,
    customX: settings.customX,
    customY: settings.customY,
    marginHorizontal: Math.round(settings.marginHorizontal * 0.4),
    marginVertical: Math.round(settings.marginVertical * 0.4),
  });

  const lineLength = Math.round(wmWidth * (settings.line.lengthPercent / 100));
  const lineGap = 10;
  const lineThickness = Math.max(1, Math.round(settings.line.thickness * 0.6));
  const lineCenterY = pos.y + wmHeight / 2;

  const shadowFilter = settings.shadow.enabled
    ? `drop-shadow(${settings.shadow.offsetX}px ${settings.shadow.offsetY}px ${settings.shadow.blur}px rgba(0, 0, 0, ${settings.shadow.opacity / 100}))`
    : "none";

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-3 border-b border-border bg-secondary/40 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Preview
          </span>

          {imageList.length > 0 && (
            <div className="flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={handlePrevImage}
                className="p-1 rounded-md bg-card hover:bg-accent border border-border text-foreground transition-colors"
                title="Previous photo"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-medium text-foreground px-1.5">
                {currentIndex + 1} / {imageList.length}
              </span>
              <button
                type="button"
                onClick={handleNextImage}
                className="p-1 rounded-md bg-card hover:bg-accent border border-border text-foreground transition-colors"
                title="Next photo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-muted-foreground truncate max-w-[140px] sm:max-w-[200px] ml-1">
                {selectedImage?.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-secondary p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setPreviewMode("interactive")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                previewMode === "interactive"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Interactive Mode
            </button>
            <button
              type="button"
              onClick={() => {
                if (!serverPreviewUrl) {
                  fetchSharpPreview();
                } else {
                  setPreviewMode("sharp");
                }
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                previewMode === "sharp"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Sharp Render</span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchSharpPreview}
            disabled={isLoadingServerPreview}
            title="Refresh pixel-accurate Sharp preview from local server"
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingServerPreview ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden select-none"
      >
        {previewMode === "sharp" && serverPreviewUrl ? (
          <img
            src={serverPreviewUrl}
            alt="Sharp Render Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImage ? (
              <img
                src={selectedImage.thumbnailUrl}
                alt={selectedImage.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center text-center p-6 relative">
                <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                  <Eye className="w-10 h-10 text-blue-400/80" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Annual Commencement &amp; Award Ceremony
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Sample high-resolution school activity photograph. Drop your photos above to preview on actual images.
                </p>
              </div>
            )}

            {settings.line.enabled && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                style={{ filter: shadowFilter }}
              >
                {(settings.line.position === "left" || settings.line.position === "both") && (
                  <line
                    x1={Math.max(10, pos.x - lineGap - lineLength)}
                    y1={lineCenterY}
                    x2={Math.max(10, pos.x - lineGap)}
                    y2={lineCenterY}
                    stroke={settings.line.color || "#ffffff"}
                    strokeWidth={lineThickness}
                    strokeLinecap="round"
                    opacity={settings.line.opacity / 100}
                  />
                )}

                {(settings.line.position === "right" || settings.line.position === "both") && (
                  <line
                    x1={Math.min(cWidth - 10, pos.x + wmWidth + lineGap)}
                    y1={lineCenterY}
                    x2={Math.min(cWidth - 10, pos.x + wmWidth + lineGap + lineLength)}
                    y2={lineCenterY}
                    stroke={settings.line.color || "#ffffff"}
                    strokeWidth={lineThickness}
                    strokeLinecap="round"
                    opacity={settings.line.opacity / 100}
                  />
                )}
              </svg>
            )}

            <div
              onMouseDown={handleMouseDown}
              style={{
                position: "absolute",
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${wmWidth}px`,
                height: `${wmHeight}px`,
                opacity: settings.opacity / 100,
                filter: shadowFilter,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              className="z-20 group flex items-center justify-center"
            >
              {watermarkPreviewUrl ? (
                <img
                  src={watermarkPreviewUrl}
                  alt="Watermark"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center gap-3 px-2 py-1 text-white border border-white/20 rounded-md bg-white/5 backdrop-blur-[1px] pointer-events-none">
                  <div className="w-9 h-9 rounded-full border-2 border-white/80 flex items-center justify-center font-serif text-sm font-bold">
                    🏛️
                  </div>
                  <div className="text-left font-serif tracking-wider">
                    <p className="text-xs font-bold leading-tight uppercase">
                      ST. AUGUSTINE ACADEMY
                    </p>
                    <p className="text-[9px] tracking-widest text-white/90">
                      EXCELLENCE • TRADITION
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none flex items-center gap-1 whitespace-nowrap">
                <Move className="w-2.5 h-2.5" />
                <span>Drag to reposition</span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 z-30 bg-black/70 backdrop-blur text-white text-[10px] font-mono px-2 py-1 rounded-md border border-white/10 pointer-events-none">
          {settings.position === "custom"
            ? `Pos: X ${Math.round(settings.customX)}% | Y ${Math.round(settings.customY)}%`
            : `Anchor: ${settings.position}`}
          {" • "}Size: {settings.sizePercent}%
        </div>
      </div>
    </div>
  );
}
