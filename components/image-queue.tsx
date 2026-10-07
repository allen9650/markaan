"use client";

import React, { useState } from "react";
import { ImageItem } from "@/lib/watermark/types";
import { formatFileSize } from "@/lib/utils";
import {
  Trash2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Eye,
  Download,
  Search,
} from "lucide-react";

interface ImageQueueProps {
  images: ImageItem[];
  selectedImage: ImageItem | null;
  onSelectImage: (item: ImageItem) => void;
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  onStartProcessing: () => void;
  onRetryFailed: () => void;
  isProcessing: boolean;
}

export function ImageQueue({
  images,
  selectedImage,
  onSelectImage,
  onRemoveImage,
  onClearAll,
  onStartProcessing,
  onRetryFailed,
  isProcessing,
}: ImageQueueProps) {
  const [filter, setFilter] = useState<"all" | "waiting" | "completed" | "failed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const total = images.length;
  const completed = images.filter((i) => i.status === "completed").length;
  const failed = images.filter((i) => i.status === "failed").length;
  const waiting = images.filter((i) => i.status === "waiting" || i.status === "processing").length;

  const filteredImages = images.filter((img) => {
    if (filter === "waiting" && img.status !== "waiting" && img.status !== "processing") return false;
    if (filter === "completed" && img.status !== "completed") return false;
    if (filter === "failed" && img.status !== "failed") return false;
    if (searchQuery && !img.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDownloadSingle = (item: ImageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.resultBlob) return;
    const url = item.resultUrl || URL.createObjectURL(item.resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.name.replace(/\.[^/.]+$/, "")}_watermarked.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Image Processing Queue
            </h3>
            <p className="text-xs text-muted-foreground">
              {total === 0 ? "No images loaded yet" : `${total} total photos in batch`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {failed > 0 && (
              <button
                type="button"
                onClick={onRetryFailed}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Failed ({failed})</span>
              </button>
            )}

            {total > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            {total > 0 && (
              <button
                type="button"
                onClick={onStartProcessing}
                disabled={isProcessing || waiting === 0}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Process {waiting > 0 ? `(${waiting})` : "All"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {total > 0 && (
          <div className="grid grid-cols-4 gap-2 pt-1">
            <div className="bg-card p-2 rounded-xl border border-border text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total</span>
              <span className="text-sm font-bold text-foreground">{total}</span>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-center">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold block">Completed</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{completed}</span>
            </div>
            <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-center">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-semibold block">Waiting</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{waiting}</span>
            </div>
            <div className="bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 text-center">
              <span className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-semibold block">Failed</span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{failed}</span>
            </div>
          </div>
        )}

        {total > 5 && (
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search filenames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-card border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex bg-secondary p-0.5 rounded-lg border border-border text-xs">
              {(["all", "waiting", "completed", "failed"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 rounded-md capitalize font-medium transition-colors ${
                    filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {total === 0 ? (
          <div className="p-8 text-center text-muted-foreground space-y-2">
            <p className="text-xs">Select or drop photos above to build your queue.</p>
            <p className="text-[11px] text-muted-foreground/70">
              Tested for large batches of 10 to 500+ photos.
            </p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs">
            No photos match current filter.
          </div>
        ) : (
          filteredImages.map((item) => {
            const isSelected = selectedImage?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectImage(item)}
                className={`p-2.5 px-3 flex items-center justify-between gap-3 hover:bg-accent/40 transition-colors cursor-pointer ${
                  isSelected ? "bg-primary/5 border-l-2 border-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-secondary overflow-hidden border border-border flex-shrink-0 relative">
                    <img
                      src={item.resultUrl || item.thumbnailUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.status === "completed" && (
                      <div className="absolute top-0.5 right-0.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-[280px]">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span>{formatFileSize(item.size)}</span>
                      {item.width && item.height && (
                        <span>• {item.width} × {item.height}</span>
                      )}
                    </div>
                    {item.error && (
                      <p className="text-[10px] text-rose-500 font-medium truncate max-w-[200px] mt-0.5">
                        ⚠ {item.error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {item.status === "waiting" && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Waiting
                    </span>
                  )}
                  {item.status === "processing" && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-medium flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Processing
                    </span>
                  )}
                  {item.status === "completed" && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                  {item.status === "failed" && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Failed
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectImage(item)}
                    title="View in preview canvas"
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {item.status === "completed" && item.resultBlob && (
                    <button
                      type="button"
                      onClick={(e) => handleDownloadSingle(item, e)}
                      title="Download watermarked file"
                      className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveImage(item.id)}
                    disabled={item.status === "processing"}
                    title="Remove from queue"
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
