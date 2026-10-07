"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { ImageUploader } from "@/components/image-uploader";
import { PresetManager } from "@/components/preset-manager";
import { WatermarkSettingsPanel } from "@/components/watermark-settings";
import { WatermarkPreview } from "@/components/watermark-preview";
import { ImageQueue } from "@/components/image-queue";
import { ProcessingProgressModal } from "@/components/processing-progress";
import { ImageItem, WatermarkSettings } from "@/lib/watermark/types";
import { DEFAULT_WATERMARK_SETTINGS } from "@/lib/watermark/settings";

export default function HomePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_WATERMARK_SETTINGS);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const [concurrency, setConcurrency] = useState<number>(2);
  const isCancelledRef = useRef<boolean>(false);

  const imagesRef = useRef<ImageItem[]>([]);
  imagesRef.current = images;

  const handleWatermarkSelected = (file: File | null) => {
    if (watermarkPreviewUrl) {
      URL.revokeObjectURL(watermarkPreviewUrl);
    }
    setWatermarkFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setWatermarkPreviewUrl(url);
    } else {
      setWatermarkPreviewUrl(null);
    }
  };

  const handleImagesAdded = (newImages: ImageItem[]) => {
    setImages((prev) => {
      const updated = [...prev, ...newImages];
      return updated;
    });
    if (!selectedImage && newImages.length > 0) {
      setSelectedImage(newImages[0]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        if (target.thumbnailUrl) URL.revokeObjectURL(target.thumbnailUrl);
        if (target.resultUrl) URL.revokeObjectURL(target.resultUrl);
      }
      const updated = prev.filter((img) => img.id !== id);
      if (selectedImage?.id === id) {
        setSelectedImage(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.thumbnailUrl) URL.revokeObjectURL(img.thumbnailUrl);
      if (img.resultUrl) URL.revokeObjectURL(img.resultUrl);
    });
    setImages([]);
    setSelectedImage(null);
  };

  const updateItemStatus = (id: string, updates: Partial<ImageItem>) => {
    setImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const startProcessingQueue = async () => {
    const queueToProcess = imagesRef.current.filter(
      (img) => img.status === "waiting"
    );

    if (queueToProcess.length === 0) return;

    setIsProcessing(true);
    setIsProgressModalOpen(true);
    isCancelledRef.current = false;

    let queueIndex = 0;

    const runWorker = async () => {
      while (queueIndex < queueToProcess.length) {
        if (isCancelledRef.current) break;

        const currentIndex = queueIndex++;
        const item = queueToProcess[currentIndex];
        if (!item) break;

        setCurrentFilename(item.name);
        updateItemStatus(item.id, { status: "processing", error: undefined });

        try {
          const formData = new FormData();
          formData.append("image", item.file);
          if (watermarkFile) {
            formData.append("watermark", watermarkFile);
          }
          formData.append("settings", JSON.stringify(settings));

          const response = await fetch("/api/watermark/process", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            let errorMsg = `Server error ${response.status}`;
            try {
              const errJson = await response.json();
              if (errJson.error) errorMsg = errJson.error;
            } catch {
              // fallback
            }
            throw new Error(errorMsg);
          }

          const blob = await response.blob();
          const resultUrl = URL.createObjectURL(blob);
          const widthStr = response.headers.get("X-Image-Width");
          const heightStr = response.headers.get("X-Image-Height");

          updateItemStatus(item.id, {
            status: "completed",
            resultBlob: blob,
            resultUrl,
            width: widthStr ? parseInt(widthStr, 10) : item.width,
            height: heightStr ? parseInt(heightStr, 10) : item.height,
            processedSize: blob.size,
          });
        } catch (err: any) {
          console.error(`Error processing image ${item.name}:`, err);
          updateItemStatus(item.id, {
            status: "failed",
            error: err?.message || "Processing failed",
          });
        }
      }
    };

    const activeWorkers: Promise<void>[] = [];
    const poolSize = Math.max(1, Math.min(concurrency, queueToProcess.length));

    for (let w = 0; w < poolSize; w++) {
      activeWorkers.push(runWorker());
    }

    await Promise.all(activeWorkers);
    setIsProcessing(false);
    setCurrentFilename(null);
  };

  const handleRetryFailed = () => {
    setImages((prev) =>
      prev.map((img) =>
        img.status === "failed" ? { ...img, status: "waiting", error: undefined } : img
      )
    );
    setTimeout(() => {
      startProcessingQueue();
    }, 100);
  };

  const handleCancelProcessing = () => {
    isCancelledRef.current = true;
    setIsProcessing(false);
    setCurrentFilename(null);
  };

  const completedCount = images.filter((i) => i.status === "completed").length;
  const failedCount = images.filter((i) => i.status === "failed").length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar totalCount={images.length} completedCount={completedCount} />

      <main className="flex-1 container max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="space-y-4">
          <ImageUploader
            onImagesAdded={handleImagesAdded}
            watermarkFile={watermarkFile}
            onWatermarkSelected={handleWatermarkSelected}
            watermarkPreviewUrl={watermarkPreviewUrl}
          />

          <PresetManager
            currentSettings={settings}
            onApplyPreset={(newSettings) => setSettings(newSettings)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
          <div className="lg:col-span-7 h-[500px]">
            <ImageQueue
              images={images}
              selectedImage={selectedImage}
              onSelectImage={(item) => setSelectedImage(item)}
              onRemoveImage={handleRemoveImage}
              onClearAll={handleClearAll}
              onStartProcessing={startProcessingQueue}
              onRetryFailed={handleRetryFailed}
              isProcessing={isProcessing}
            />
          </div>

          <div className="lg:col-span-5 h-[500px]">
            <WatermarkSettingsPanel
              settings={settings}
              onChange={(updated) => setSettings(updated)}
            />
          </div>
        </div>

        <div>
          <WatermarkPreview
            settings={settings}
            onUpdateSettings={(updated) => setSettings(updated)}
            selectedImage={selectedImage}
            imageList={images}
            onSelectImage={(item) => setSelectedImage(item)}
            watermarkPreviewUrl={watermarkPreviewUrl}
            watermarkFile={watermarkFile}
          />
        </div>
      </main>

      <footer className="border-t border-border py-4 mt-8 bg-card/50">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© Markaan by Ahsan Raza • Local Windows Image Processing</p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Private Local Engine (Sharp + Node.js)
          </p>
        </div>
      </footer>

      <ProcessingProgressModal
        isOpen={isProgressModalOpen}
        isProcessing={isProcessing}
        total={images.length}
        completed={completedCount}
        failed={failedCount}
        currentFilename={currentFilename}
        concurrency={concurrency}
        onChangeConcurrency={(n) => setConcurrency(n)}
        onCancel={handleCancelProcessing}
        onClose={() => setIsProgressModalOpen(false)}
        images={images}
      />
    </div>
  );
}
