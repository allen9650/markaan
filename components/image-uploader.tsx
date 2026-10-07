"use client";

import React, { useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FolderUp, FileImage, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { ImageItem } from "@/lib/watermark/types";

interface ImageUploaderProps {
  onImagesAdded: (newImages: ImageItem[]) => void;
  watermarkFile: File | null;
  onWatermarkSelected: (file: File | null) => void;
  watermarkPreviewUrl: string | null;
}

export function ImageUploader({
  onImagesAdded,
  watermarkFile,
  onWatermarkSelected,
  watermarkPreviewUrl,
}: ImageUploaderProps) {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const processRawFiles = useCallback((files: File[]) => {
    const validFiles = files.filter((f) => {
      const type = f.type.toLowerCase();
      const ext = f.name.toLowerCase();
      return (
        type.includes("image/jpeg") ||
        type.includes("image/png") ||
        type.includes("image/webp") ||
        ext.endsWith(".jpg") ||
        ext.endsWith(".jpeg") ||
        ext.endsWith(".png") ||
        ext.endsWith(".webp")
      );
    });

    if (validFiles.length === 0) return;

    const items: ImageItem[] = validFiles.map((file) => {
      const objUrl = URL.createObjectURL(file);
      const item: ImageItem = {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        name: file.name,
        size: file.size,
        thumbnailUrl: objUrl,
        status: "waiting",
      };

      const img = new Image();
      img.onload = () => {
        item.width = img.naturalWidth;
        item.height = img.naturalHeight;
      };
      img.src = objUrl;

      return item;
    });

    onImagesAdded(items);
  }, [onImagesAdded]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      processRawFiles(acceptedFiles);
    },
    [processRawFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    noClick: false,
    noKeyboard: false,
  });

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processRawFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onWatermarkSelected(file);
      e.target.value = "";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Image Drop Area (2 cols) */}
      <div className="lg:col-span-2">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[190px] text-center ${
            isDragActive
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border/80 bg-card hover:border-primary/50 hover:bg-accent/40"
          }`}
        >
          <input {...getInputProps()} />

          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h3 className="text-base font-semibold text-foreground tracking-tight">
            {isDragActive ? "Release to drop photos" : "Drop images here"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Bulk select 10, 50, 100, or 500+ photographs. Supports JPG, JPEG, PNG, and WebP.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Select Images</span>
            </button>

            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors flex items-center gap-1.5"
            >
              <FolderUp className="w-3.5 h-3.5" />
              <span>Select Folder</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                processRawFiles(Array.from(e.target.files));
                e.target.value = "";
              }
            }}
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-expect-error webkitdirectory attribute
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={handleFolderChange}
          />
        </div>
      </div>

      {/* Watermark Logo Selector (1 col) */}
      <div className="border border-border/80 bg-card rounded-2xl p-4 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Watermark Logo
            </span>
            {watermarkFile ? (
              <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Custom Logo
              </span>
            ) : (
              <span className="text-[11px] font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                Markaan Default
              </span>
            )}
          </div>

          <div
            onClick={() => watermarkInputRef.current?.click()}
            className="w-full h-24 rounded-xl border border-dashed border-border bg-slate-900 flex items-center justify-center p-2 relative group cursor-pointer hover:border-primary/60 transition-colors overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #475569 25%, transparent 25%), linear-gradient(-45deg, #475569 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #475569 75%), linear-gradient(-45deg, transparent 75%, #475569 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }}
            />

            {watermarkPreviewUrl ? (
              <img
                src={watermarkPreviewUrl}
                alt="Watermark Logo"
                className="max-h-full max-w-full object-contain relative z-10 transition-transform group-hover:scale-105"
              />
            ) : (
              <img
                src="/markaan-watermark-full.png"
                alt="Markaan by Ahsan Raza"
                className="max-h-full max-w-full object-contain relative z-10 transition-transform group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
              <span className="text-xs font-semibold text-white">Change Logo</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            {watermarkFile
              ? `${watermarkFile.name} (${Math.round(watermarkFile.size / 1024)} KB)`
              : "Transparent PNG recommended. JPG and WebP also supported."}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => watermarkInputRef.current?.click()}
            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors text-center"
          >
            {watermarkFile ? "Replace Logo" : "Upload Logo"}
          </button>

          {watermarkFile && (
            <button
              type="button"
              onClick={() => onWatermarkSelected(null)}
              title="Reset to default institutional crest"
              className="py-1.5 px-2.5 rounded-lg text-xs font-medium bg-card text-muted-foreground hover:text-foreground border border-border transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <input
            ref={watermarkInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={handleWatermarkChange}
          />
        </div>
      </div>
    </div>
  );
}
