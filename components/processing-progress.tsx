"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ImageItem } from "@/lib/watermark/types";
import {
  Loader2,
  CheckCircle2,
  FolderCheck,
  X,
  FileArchive,
  Layers,
  Pause,
} from "lucide-react";

interface ProcessingProgressProps {
  isOpen: boolean;
  isProcessing: boolean;
  total: number;
  completed: number;
  failed: number;
  currentFilename: string | null;
  concurrency: number;
  onChangeConcurrency: (n: number) => void;
  onCancel: () => void;
  onClose: () => void;
  images: ImageItem[];
}

export function ProcessingProgressModal({
  isOpen,
  isProcessing,
  total,
  completed,
  failed,
  currentFilename,
  concurrency,
  onChangeConcurrency,
  onCancel,
  onClose,
  images,
}: ProcessingProgressProps) {
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isSavingToFolder, setIsSavingToFolder] = useState(false);
  const [folderSaveSuccess, setFolderSaveSuccess] = useState<number | null>(null);

  if (!isOpen) return null;

  const processedCount = completed + failed;
  const progressPercent = total > 0 ? Math.round((processedCount / total) * 100) : 0;
  const isDone = !isProcessing && processedCount > 0 && processedCount === total;

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      const zip = new JSZip();
      const successfulImages = images.filter((img) => img.status === "completed" && img.resultBlob);

      successfulImages.forEach((img) => {
        const dotIdx = img.name.lastIndexOf(".");
        const baseName = dotIdx !== -1 ? img.name.substring(0, dotIdx) : img.name;
        const filename = `${baseName}_watermarked.jpg`;
        if (img.resultBlob) {
          zip.file(filename, img.resultBlob);
        }
      });

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "STORE",
      });

      saveAs(zipBlob, "watermarked_images.zip");
    } catch (err) {
      console.error("ZIP packaging error:", err);
      alert("Failed to build ZIP archive. Please download images individually.");
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleSaveToDirectory = async () => {
    if (!("showDirectoryPicker" in window)) {
      alert(
        "Direct folder selection is supported in Google Chrome and Microsoft Edge. For other browsers, please use 'Download ZIP'."
      );
      return;
    }

    try {
      setIsSavingToFolder(true);
      // @ts-expect-error window.showDirectoryPicker
      const dirHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });

      const successfulImages = images.filter((img) => img.status === "completed" && img.resultBlob);
      let writtenCount = 0;

      for (const img of successfulImages) {
        if (!img.resultBlob) continue;
        const dotIdx = img.name.lastIndexOf(".");
        const baseName = dotIdx !== -1 ? img.name.substring(0, dotIdx) : img.name;
        const filename = `${baseName}_watermarked.jpg`;

        const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(img.resultBlob);
        await writable.close();
        writtenCount++;
      }

      setFolderSaveSuccess(writtenCount);
      setTimeout(() => setFolderSaveSuccess(null), 4000);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Directory save error:", err);
      }
    } finally {
      setIsSavingToFolder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isProcessing ? (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : isDone ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isProcessing
                  ? "Processing Images Locally..."
                  : isDone
                  ? "Batch Processing Complete!"
                  : "Batch Status"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Sharp Engine • Zero Cloud Uploads
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {processedCount} / {total} photos
            </span>
            <span className="font-bold text-primary text-sm">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden p-0.5 border border-border">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDone
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-blue-600 to-primary"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {isProcessing && currentFilename && (
            <p className="text-xs text-muted-foreground truncate pt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
              Current: <span className="font-mono text-foreground font-medium">{currentFilename}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-secondary/60 p-2.5 rounded-xl border border-border text-center">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Successful
            </span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {completed}
            </span>
          </div>

          <div className="bg-secondary/60 p-2.5 rounded-xl border border-border text-center">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Failed
            </span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400">
              {failed}
            </span>
          </div>

          <div className="bg-secondary/60 p-2.5 rounded-xl border border-border text-center">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Remaining
            </span>
            <span className="text-base font-bold text-foreground">
              {Math.max(0, total - processedCount)}
            </span>
          </div>
        </div>

        {isProcessing && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
            <span className="text-muted-foreground">Parallel Workers:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChangeConcurrency(n)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    concurrency === n
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>
        )}

        {isDone && (
          <div className="space-y-2.5 pt-2 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isExportingZip || completed === 0}
                className="w-full py-2.5 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExportingZip ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileArchive className="w-4 h-4" />
                )}
                <span>Download All as ZIP</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToDirectory}
                disabled={isSavingToFolder || completed === 0}
                className="w-full py-2.5 px-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-secondary/80 border border-border transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingToFolder ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FolderCheck className="w-4 h-4 text-emerald-500" />
                )}
                <span>Choose Output Folder</span>
              </button>
            </div>

            {folderSaveSuccess !== null && (
              <p className="text-xs text-emerald-500 font-medium text-center">
                ✓ Saved {folderSaveSuccess} watermarked files to selected folder!
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {isProcessing ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1.5"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Cancel Batch</span>
            </button>
          ) : (
            <div />
          )}

          {!isProcessing && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs font-semibold hover:bg-accent transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
