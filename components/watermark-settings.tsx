"use client";

import React, { useState } from "react";
import { WatermarkSettings, PositionPreset, LinePosition, OutputFormat } from "@/lib/watermark/types";
import {
  Sliders,
  Move,
  Layers,
  Sparkles,
  FileCheck,
  Info,
} from "lucide-react";

interface WatermarkSettingsProps {
  settings: WatermarkSettings;
  onChange: (updated: WatermarkSettings) => void;
}

export function WatermarkSettingsPanel({
  settings,
  onChange,
}: WatermarkSettingsProps) {
  const [activeTab, setActiveTab] = useState<"position" | "effects" | "output">("position");

  const updateSetting = <K extends keyof WatermarkSettings>(
    key: K,
    val: WatermarkSettings[K]
  ) => {
    onChange({ ...settings, [key]: val });
  };

  const updateShadow = (field: keyof WatermarkSettings["shadow"], val: any) => {
    onChange({
      ...settings,
      shadow: { ...settings.shadow, [field]: val },
    });
  };

  const updateLine = (field: keyof WatermarkSettings["line"], val: any) => {
    onChange({
      ...settings,
      line: { ...settings.line, [field]: val },
    });
  };

  const positions: { label: string; value: PositionPreset }[] = [
    { label: "Top Left", value: "top-left" },
    { label: "Top Center", value: "top-center" },
    { label: "Top Right", value: "top-right" },
    { label: "Center Left", value: "center-left" },
    { label: "Center", value: "center" },
    { label: "Center Right", value: "center-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Center", value: "bottom-center" },
    { label: "Bottom Right", value: "bottom-right" },
  ];

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex border-b border-border bg-secondary/50 p-1.5 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("position")}
          className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "position"
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Move className="w-3.5 h-3.5 text-primary" />
          <span>Position &amp; Size</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("effects")}
          className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "effects"
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Shadow &amp; Line</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("output")}
          className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "output"
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Output &amp; Format</span>
        </button>
      </div>

      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {activeTab === "position" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  Anchor Position
                </label>
                <span className="text-[11px] font-medium text-primary capitalize">
                  {settings.position.replace("-", " ")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-secondary/60 rounded-xl border border-border">
                {positions.map((pos) => {
                  const isActive = settings.position === pos.value;
                  return (
                    <button
                      key={pos.value}
                      type="button"
                      onClick={() => updateSetting("position", pos.value)}
                      className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "bg-card/70 hover:bg-card text-muted-foreground hover:text-foreground border border-border/50"
                      }`}
                    >
                      {pos.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => updateSetting("position", "custom")}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                    settings.position === "custom"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {settings.position === "custom" ? "✓ Custom Position Active" : "Enable Custom Drag Mode"}
                </button>
              </div>
            </div>

            {settings.position === "custom" && (
              <div className="p-3 bg-secondary/40 rounded-xl border border-border space-y-3">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-primary" /> Drag watermark on the preview canvas, or use sliders below:
                </p>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Horizontal Position (X)</span>
                    <span className="font-semibold">{Math.round(settings.customX)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.customX}
                    onChange={(e) => updateSetting("customX", parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Vertical Position (Y)</span>
                    <span className="font-semibold">{Math.round(settings.customY)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.customY}
                    onChange={(e) => updateSetting("customY", parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-foreground">Watermark Width</label>
                <span className="font-semibold text-primary">{settings.sizePercent}% of image width</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={settings.sizePercent}
                onChange={(e) => updateSetting("sizePercent", parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Preserves original aspect ratio. Scales proportionally for every photo resolution.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-foreground">Watermark Opacity</label>
                <span className="font-semibold text-primary">{settings.opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={settings.opacity}
                onChange={(e) => updateSetting("opacity", parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {settings.position !== "custom" && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Margin X</span>
                    <span className="font-medium">{settings.marginHorizontal}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={settings.marginHorizontal}
                    onChange={(e) => updateSetting("marginHorizontal", parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Margin Y</span>
                    <span className="font-medium">{settings.marginVertical}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={settings.marginVertical}
                    onChange={(e) => updateSetting("marginVertical", parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "effects" && (
          <div className="space-y-5">
            <div className="p-3.5 bg-secondary/30 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Soft Drop Shadow</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Derived from watermark alpha silhouette
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.shadow.enabled}
                    onChange={(e) => updateShadow("enabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {settings.shadow.enabled && (
                <div className="space-y-3 pt-2 border-t border-border/70">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Shadow Opacity</span>
                      <span className="font-semibold">{settings.shadow.opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.shadow.opacity}
                      onChange={(e) => updateShadow("opacity", parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Blur Radius</span>
                      <span className="font-semibold">{settings.shadow.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={settings.shadow.blur}
                      onChange={(e) => updateShadow("blur", parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Offset X</span>
                        <span className="font-semibold">{settings.shadow.offsetX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        value={settings.shadow.offsetX}
                        onChange={(e) => updateShadow("offsetX", parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Offset Y</span>
                        <span className="font-semibold">{settings.shadow.offsetY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        value={settings.shadow.offsetY}
                        onChange={(e) => updateShadow("offsetY", parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-secondary/30 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Horizontal Accent Line</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Institutional connecting rule
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.line.enabled}
                    onChange={(e) => updateLine("enabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {settings.line.enabled && (
                <div className="space-y-3 pt-2 border-t border-border/70">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">
                      Line Side
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["left", "both", "right"] as LinePosition[]).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => updateLine("position", pos)}
                          className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                            settings.line.position === pos
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "bg-card text-muted-foreground hover:text-foreground border border-border"
                          }`}
                        >
                          {pos === "both" ? "Both Sides" : pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Line Thickness</span>
                      <span className="font-semibold">{settings.line.thickness}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={settings.line.thickness}
                      onChange={(e) => updateLine("thickness", parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Line Length</span>
                      <span className="font-semibold">{settings.line.lengthPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={settings.line.lengthPercent}
                      onChange={(e) => updateLine("lengthPercent", parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Line Opacity</span>
                      <span className="font-semibold">{settings.line.opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={settings.line.opacity}
                      onChange={(e) => updateLine("opacity", parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "output" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Output Image Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { label: "Keep Original", value: "original" },
                    { label: "JPEG (.jpg)", value: "jpeg" },
                    { label: "PNG (.png)", value: "png" },
                    { label: "WebP (.webp)", value: "webp" },
                  ] as { label: string; value: OutputFormat }[]
                ).map((fmt) => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => updateSetting("outputFormat", fmt.value)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg text-left transition-all border ${
                      settings.outputFormat === fmt.value
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-sm"
                        : "bg-card text-muted-foreground hover:text-foreground border-border hover:bg-accent/40"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {(settings.outputFormat === "original" || settings.outputFormat === "jpeg") && (
              <div className="space-y-1.5 p-3 bg-secondary/30 rounded-xl border border-border">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">JPEG Quality</span>
                  <span className="font-semibold text-primary">{settings.jpegQuality}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="100"
                  step="5"
                  value={settings.jpegQuality}
                  onChange={(e) => updateSetting("jpegQuality", parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>80 (Smaller file)</span>
                  <span>90 (Default)</span>
                  <span>100 (Max quality)</span>
                </div>
              </div>
            )}

            {settings.outputFormat === "webp" && (
              <div className="space-y-1.5 p-3 bg-secondary/30 rounded-xl border border-border">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">WebP Quality</span>
                  <span className="font-semibold text-primary">{settings.webpQuality}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="100"
                  step="5"
                  value={settings.webpQuality}
                  onChange={(e) => updateSetting("webpQuality", parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}

            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground block">
                Filename Suffix
              </label>
              <input
                type="text"
                value={settings.filenameSuffix}
                onChange={(e) => updateSetting("filenameSuffix", e.target.value)}
                placeholder="_watermarked"
                className="w-full text-xs font-mono bg-secondary text-secondary-foreground border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Example: <span className="font-mono text-foreground">activity01.jpg</span> →{" "}
                <span className="font-mono text-foreground">activity01{settings.filenameSuffix || "_watermarked"}.jpg</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
