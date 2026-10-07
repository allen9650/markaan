import { LineSettings } from "./types";

export interface GenerateLineOverlayOptions {
  imageWidth: number;
  imageHeight: number;
  wmX: number;
  wmY: number;
  wmWidth: number;
  wmHeight: number;
  line: LineSettings;
}

export function generateLineOverlaySvg(opts: GenerateLineOverlayOptions): Buffer | null {
  const { imageWidth, imageHeight, wmX, wmY, wmWidth, wmHeight, line } = opts;

  if (!line.enabled || line.opacity <= 0 || line.thickness <= 0) {
    return null;
  }

  const scale = Math.max(0.4, imageWidth / 1920);
  const strokeWidth = Math.max(1, Math.round(line.thickness * scale));
  const gap = Math.round(18 * scale);
  const lineLength = Math.max(20, Math.round((wmWidth * (line.lengthPercent / 100))));
  const centerY = Math.round(wmY + wmHeight / 2);
  const opacity = Math.min(1, Math.max(0, line.opacity / 100));
  const color = line.color || "#ffffff";

  const lines: string[] = [];

  // Left line
  if (line.position === "left" || line.position === "both") {
    const leftEnd = Math.max(10, wmX - gap);
    const leftStart = Math.max(5, leftEnd - lineLength);
    if (leftEnd > leftStart) {
      lines.push(
        `<line x1="${leftStart}" y1="${centerY}" x2="${leftEnd}" y2="${centerY}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="${opacity}" />`
      );
    }
  }

  // Right line
  if (line.position === "right" || line.position === "both") {
    const rightStart = Math.min(imageWidth - 10, wmX + wmWidth + gap);
    const rightEnd = Math.min(imageWidth - 5, rightStart + lineLength);
    if (rightEnd > rightStart) {
      lines.push(
        `<line x1="${rightStart}" y1="${centerY}" x2="${rightEnd}" y2="${centerY}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="${opacity}" />`
      );
    }
  }

  if (lines.length === 0) {
    return null;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}" viewBox="0 0 ${imageWidth} ${imageHeight}">
    ${lines.join("\n    ")}
  </svg>`;

  return Buffer.from(svg);
}
