import { Preset, WatermarkSettings } from "./types";

export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  position: "bottom-center",
  customX: 50,
  customY: 88,
  sizePercent: 35,
  opacity: 90,
  marginHorizontal: 30,
  marginVertical: 35,
  shadow: {
    enabled: true,
    color: "#000000",
    opacity: 30,
    blur: 3,
    offsetX: 1,
    offsetY: 2,
  },
  line: {
    enabled: true,
    color: "#ffffff",
    opacity: 90,
    thickness: 2,
    lengthPercent: 30,
    position: "both",
  },
  outputFormat: "original",
  jpegQuality: 90,
  webpQuality: 90,
  preservePngQuality: true,
  filenameSuffix: "_watermarked",
};

export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: "preset-ptm-bottom-center",
    name: "PTM Bottom Center",
    description: "Institutional emblem + subtle shadow + white accent lines on both sides",
    isBuiltIn: true,
    settings: {
      ...DEFAULT_WATERMARK_SETTINGS,
      position: "bottom-center",
      sizePercent: 35,
      opacity: 90,
      shadow: {
        enabled: true,
        color: "#000000",
        opacity: 30,
        blur: 3,
        offsetX: 1,
        offsetY: 2,
      },
      line: {
        enabled: true,
        color: "#ffffff",
        opacity: 90,
        thickness: 2,
        lengthPercent: 30,
        position: "both",
      },
    },
  },
  {
    id: "preset-institutional-classic",
    name: "Institutional Classic",
    description: "Classic bottom-center crest watermark without accent lines",
    isBuiltIn: true,
    settings: {
      ...DEFAULT_WATERMARK_SETTINGS,
      position: "bottom-center",
      sizePercent: 32,
      opacity: 85,
      shadow: {
        enabled: true,
        color: "#000000",
        opacity: 35,
        blur: 4,
        offsetX: 1,
        offsetY: 2,
      },
      line: {
        enabled: false,
        color: "#ffffff",
        opacity: 80,
        thickness: 2,
        lengthPercent: 25,
        position: "both",
      },
    },
  },
  {
    id: "preset-subtle-lower-right",
    name: "Subtle Lower Right",
    description: "Discreet watermark in bottom right corner with soft shadow",
    isBuiltIn: true,
    settings: {
      ...DEFAULT_WATERMARK_SETTINGS,
      position: "bottom-right",
      sizePercent: 22,
      opacity: 80,
      marginHorizontal: 35,
      marginVertical: 35,
      shadow: {
        enabled: true,
        color: "#000000",
        opacity: 25,
        blur: 3,
        offsetX: 1,
        offsetY: 1,
      },
      line: {
        enabled: false,
        color: "#ffffff",
        opacity: 80,
        thickness: 1,
        lengthPercent: 20,
        position: "left",
      },
    },
  },
  {
    id: "preset-modern-minimalist",
    name: "Modern Minimalist",
    description: "High opacity, crisp no-shadow logo with single side accent line",
    isBuiltIn: true,
    settings: {
      ...DEFAULT_WATERMARK_SETTINGS,
      position: "bottom-left",
      sizePercent: 25,
      opacity: 95,
      marginHorizontal: 40,
      marginVertical: 40,
      shadow: {
        enabled: false,
        color: "#000000",
        opacity: 0,
        blur: 0,
        offsetX: 0,
        offsetY: 0,
      },
      line: {
        enabled: true,
        color: "#ffffff",
        opacity: 95,
        thickness: 2,
        lengthPercent: 40,
        position: "right",
      },
    },
  },
  {
    id: "preset-top-banner",
    name: "Top Banner Crest",
    description: "Header watermark centered at the top of the photo",
    isBuiltIn: true,
    settings: {
      ...DEFAULT_WATERMARK_SETTINGS,
      position: "top-center",
      sizePercent: 28,
      opacity: 85,
      marginHorizontal: 30,
      marginVertical: 35,
      shadow: {
        enabled: true,
        color: "#000000",
        opacity: 30,
        blur: 3,
        offsetX: 1,
        offsetY: 2,
      },
      line: {
        enabled: true,
        color: "#ffffff",
        opacity: 85,
        thickness: 2,
        lengthPercent: 25,
        position: "both",
      },
    },
  },
];

const PRESETS_STORAGE_KEY = "bulk_watermark_presets_v1";

export function loadSavedPresets(): Preset[] {
  if (typeof window === "undefined") return BUILT_IN_PRESETS;
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return BUILT_IN_PRESETS;
    const userPresets: Preset[] = JSON.parse(raw);
    return [...BUILT_IN_PRESETS, ...userPresets];
  } catch (e) {
    console.error("Failed to load presets from localStorage", e);
    return BUILT_IN_PRESETS;
  }
}

export function saveUserPreset(name: string, settings: WatermarkSettings): Preset {
  const newPreset: Preset = {
    id: `preset-user-${Date.now()}`,
    name: name.trim() || "Custom Preset",
    settings,
    isBuiltIn: false,
  };
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    const userPresets: Preset[] = raw ? JSON.parse(raw) : [];
    userPresets.push(newPreset);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(userPresets));
  } catch (e) {
    console.error("Failed to save preset to localStorage", e);
  }
  return newPreset;
}

export function deleteUserPreset(id: string): void {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return;
    const userPresets: Preset[] = JSON.parse(raw);
    const filtered = userPresets.filter((p) => p.id !== id);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete preset from localStorage", e);
  }
}
