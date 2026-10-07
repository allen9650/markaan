import sharp from "sharp";
import { ShadowSettings } from "./types";

export interface GenerateShadowOptions {
  watermarkBuffer: Buffer;
  wmWidth: number;
  wmHeight: number;
  imageWidth: number;
  shadow: ShadowSettings;
}

export interface ShadowResult {
  buffer: Buffer;
  xOffsetAdjustment: number;
  yOffsetAdjustment: number;
  paddedWidth: number;
  paddedHeight: number;
}

/**
 * Creates a true transparent drop-shadow layer derived from the watermark alpha silhouette.
 * Avoids any flat rectangular boxes.
 */
export async function generateWatermarkShadow(
  opts: GenerateShadowOptions
): Promise<ShadowResult | null> {
  const { watermarkBuffer, wmWidth, wmHeight, imageWidth, shadow } = opts;

  if (!shadow.enabled || shadow.opacity <= 0) {
    return null;
  }

  // Scale blur radius based on image resolution (reference width 1920px)
  const scale = Math.max(0.4, imageWidth / 1920);
  const effectiveBlur = Math.max(0.5, shadow.blur * scale);
  
  // Pad watermark to prevent shadow clipping at edges
  const pad = Math.ceil(effectiveBlur * 2.5 + Math.max(Math.abs(shadow.offsetX), Math.abs(shadow.offsetY)) + 8);
  const opacityFactor = Math.min(1, Math.max(0, shadow.opacity / 100));

  try {
    // 1. Resample watermark and pad with transparent pixels
    const padded = await sharp(watermarkBuffer)
      .resize(wmWidth, wmHeight, { fit: "contain" })
      .ensureAlpha()
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    // 2. Modulate RGB channels to dark (black) and scale Alpha by opacityFactor
    const shadowBuffer = await sharp(padded)
      .linear([0, 0, 0, opacityFactor], [0, 0, 0, 0])
      .blur(effectiveBlur)
      .png()
      .toBuffer();

    return {
      buffer: shadowBuffer,
      xOffsetAdjustment: -pad + Math.round(shadow.offsetX * scale),
      yOffsetAdjustment: -pad + Math.round(shadow.offsetY * scale),
      paddedWidth: wmWidth + pad * 2,
      paddedHeight: wmHeight + pad * 2,
    };
  } catch (error) {
    console.error("Error generating watermark shadow:", error);
    return null;
  }
}
