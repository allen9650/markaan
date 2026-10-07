export type PositionPreset =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "custom";

export type LinePosition = "left" | "right" | "both";

export type OutputFormat = "original" | "jpeg" | "png" | "webp";

export interface ShadowSettings {
  enabled: boolean;
  color: string;
  opacity: number; // 0 - 100%
  blur: number; // 0 - 20px
  offsetX: number; // -10 to +10px
  offsetY: number; // -10 to +10px
}

export interface LineSettings {
  enabled: boolean;
  color: string;
  opacity: number; // 0 - 100%
  thickness: number; // 1 - 10px scaled
  lengthPercent: number; // 10 - 100%
  position: LinePosition;
}

export interface WatermarkSettings {
  position: PositionPreset;
  customX: number; // 0 - 100%
  customY: number; // 0 - 100%
  sizePercent: number; // 5 - 60% of image width
  opacity: number; // 10 - 100%
  marginHorizontal: number; // px at reference width
  marginVertical: number; // px at reference width
  shadow: ShadowSettings;
  line: LineSettings;
  outputFormat: OutputFormat;
  jpegQuality: number; // 80 - 100
  webpQuality: number; // 80 - 100
  preservePngQuality: boolean;
  filenameSuffix: string;
}

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  width?: number;
  height?: number;
  thumbnailUrl: string;
  status: "waiting" | "processing" | "completed" | "failed";
  error?: string;
  resultBlob?: Blob;
  resultUrl?: string;
  processedSize?: number;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  settings: WatermarkSettings;
  isBuiltIn?: boolean;
}
