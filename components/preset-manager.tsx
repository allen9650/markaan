"use client";

import React, { useState, useEffect } from "react";
import { WatermarkSettings, Preset } from "@/lib/watermark/types";
import {
  BUILT_IN_PRESETS,
  loadSavedPresets,
  saveUserPreset,
  deleteUserPreset,
  DEFAULT_WATERMARK_SETTINGS,
} from "@/lib/watermark/settings";
import { Bookmark, Plus, Trash2, RotateCcw, Check } from "lucide-react";

interface PresetManagerProps {
  currentSettings: WatermarkSettings;
  onApplyPreset: (settings: WatermarkSettings) => void;
}

export function PresetManager({
  currentSettings,
  onApplyPreset,
}: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>(BUILT_IN_PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-ptm-bottom-center");
  const [isSaving, setIsSaving] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setPresets(loadSavedPresets());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedPresetId(id);
    const found = presets.find((p) => p.id === id);
    if (found) {
      onApplyPreset(found.settings);
      triggerToast(`Loaded "${found.name}" preset`);
    }
  };

  const handleSaveNewPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;
    const created = saveUserPreset(newPresetName, currentSettings);
    setPresets(loadSavedPresets());
    setSelectedPresetId(created.id);
    setNewPresetName("");
    setIsSaving(false);
    triggerToast(`Saved "${created.name}" preset`);
  };

  const handleDeletePreset = () => {
    const active = presets.find((p) => p.id === selectedPresetId);
    if (!active || active.isBuiltIn) return;
    deleteUserPreset(active.id);
    const updated = loadSavedPresets();
    setPresets(updated);
    setSelectedPresetId(updated[0]?.id || "preset-ptm-bottom-center");
    onApplyPreset(updated[0]?.settings || DEFAULT_WATERMARK_SETTINGS);
    triggerToast(`Deleted "${active.name}"`);
  };

  const activePreset = presets.find((p) => p.id === selectedPresetId);

  return (
    <div className="bg-card border border-border/80 rounded-xl p-3.5 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Watermark Preset
          </span>
        </div>
        {toastMessage && (
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1 animate-fade-in">
            <Check className="w-3 h-3" /> {toastMessage}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={selectedPresetId}
            onChange={handleSelectPreset}
            className="w-full text-xs font-medium bg-secondary text-secondary-foreground border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer pr-8"
          >
            <optgroup label="Official Institutional Presets">
              {presets
                .filter((p) => p.isBuiltIn)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    ⭐ {p.name}
                  </option>
                ))}
            </optgroup>
            {presets.some((p) => !p.isBuiltIn) && (
              <optgroup label="My Custom Presets">
                {presets
                  .filter((p) => !p.isBuiltIn)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
            ▼
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSaving(!isSaving)}
          title="Save current configuration as new preset"
          className="p-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {activePreset && !activePreset.isBuiltIn && (
          <button
            type="button"
            onClick={handleDeletePreset}
            title="Delete this custom preset"
            className="p-2 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            onApplyPreset(DEFAULT_WATERMARK_SETTINGS);
            setSelectedPresetId("preset-ptm-bottom-center");
            triggerToast("Reset to defaults");
          }}
          title="Reset to PTM Bottom Center defaults"
          className="p-2 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {activePreset?.description && (
        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
          {activePreset.description}
        </p>
      )}

      {isSaving && (
        <form onSubmit={handleSaveNewPreset} className="pt-2 border-t border-border flex items-center gap-2">
          <input
            type="text"
            placeholder="Preset Name (e.g. Science Fair 2026)"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="flex-1 text-xs bg-secondary border border-border rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsSaving(false)}
            className="px-2.5 py-1.5 bg-card border border-border text-xs rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
