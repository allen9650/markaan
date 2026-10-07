import sharp from "sharp";
import { WatermarkSettings } from "./types";
import { calculateWatermarkPosition } from "./positioning";
import { generateWatermarkShadow } from "./shadow";
import { generateLineOverlaySvg } from "./line";
import { SAMPLE_INSTITUTIONAL_WATERMARK_SVG } from "./sample-crest";

export interface ProcessImageOptions {
  imageBuffer: Buffer;
  watermarkBuffer?: Buffer | null;
  settings: WatermarkSettings;
}

export interface ProcessImageResult {
  buffer: Buffer;
  format: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

export async function processWatermark(
  options: ProcessImageOptions
): Promise<ProcessImageResult> {
  const { imageBuffer, watermarkBuffer, settings } = options;

  let pipeline = sharp(imageBuffer).rotate();
  const metadata = await pipeline.metadata();

  const imageWidth = metadata.width || 1920;
  const imageHeight = metadata.height || 1080;
  const detectedFormat = (metadata.format || "jpeg").toLowerCase();

  const rawWmBuffer = watermarkBuffer && watermarkBuffer.length > 0
    ? watermarkBuffer
    : Buffer.from(SAMPLE_INSTITUTIONAL_WATERMARK_SVG);

  const wmMeta = await sharp(rawWmBuffer).metadata();
  const origWmWidth = wmMeta.width || 1000;
  const origWmHeight = wmMeta.height || 240;
  const wmAspect = origWmWidth / origWmHeight;

  const targetWmWidth = Math.max(40, Math.round(imageWidth * (settings.sizePercent / 100)));
  const targetWmHeight = Math.max(10, Math.round(targetWmWidth / wmAspect));

  const position = calculateWatermarkPosition({
    imageWidth,
    imageHeight,
    wmWidth: targetWmWidth,
    wmHeight: targetWmHeight,
    position: settings.position,
    customX: settings.customX,
    customY: settings.customY,
    marginHorizontal: settings.marginHorizontal,
    marginVertical: settings.marginVertical,
  });

  const wmOpacity = Math.min(1, Math.max(0.1, settings.opacity / 100));
  const resizedWatermark = await sharp(rawWmBuffer)
    .resize(targetWmWidth, targetWmHeight, { fit: "contain" })
    .ensureAlpha()
    .linear([1, 1, 1, wmOpacity], [0, 0, 0, 0])
    .png()
    .toBuffer();

  const composites: sharp.OverlayOptions[] = [];

  if (settings.shadow.enabled && settings.shadow.opacity > 0) {
    const shadowResult = await generateWatermarkShadow({
      watermarkBuffer: rawWmBuffer,
      wmWidth: targetWmWidth,
      wmHeight: targetWmHeight,
      imageWidth,
      shadow: settings.shadow,
    });

    if (shadowResult) {
      composites.push({
        input: shadowResult.buffer,
        left: position.x + shadowResult.xOffsetAdjustment,
        top: position.y + shadowResult.yOffsetAdjustment,
      });
    }
  }

  if (settings.line.enabled && settings.line.opacity > 0) {
    const lineSvgBuffer = generateLineOverlaySvg({
      imageWidth,
      imageHeight,
      wmX: position.x,
      wmY: position.y,
      wmWidth: targetWmWidth,
      wmHeight: targetWmHeight,
      line: settings.line,
    });

    if (lineSvgBuffer) {
      composites.push({
        input: lineSvgBuffer,
        left: 0,
        top: 0,
      });
    }
  }

  composites.push({
    input: resizedWatermark,
    left: position.x,
    top: position.y,
  });

  pipeline = pipeline.composite(composites);

  let targetFormat = settings.outputFormat;
  if (targetFormat === "original") {
    if (detectedFormat.includes("png")) targetFormat = "png";
    else if (detectedFormat.includes("webp")) targetFormat = "webp";
    else targetFormat = "jpeg";
  }

  let mimeType = "image/jpeg";
  if (targetFormat === "jpeg") {
    pipeline = pipeline.jpeg({
      quality: settings.jpegQuality || 90,
      mozjpeg: true,
    });
    mimeType = "image/jpeg";
  } else if (targetFormat === "png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
    });
    mimeType = "image/png";
  } else if (targetFormat === "webp") {
    pipeline = pipeline.webp({
      quality: settings.webpQuality || 90,
    });
    mimeType = "image/webp";
  }

  const outputBuffer = await pipeline.toBuffer();

  return {
    buffer: outputBuffer,
    format: targetFormat,
    mimeType,
    width: imageWidth,
    height: imageHeight,
    size: outputBuffer.length,
  };
}
