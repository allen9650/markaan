import { PositionPreset } from "./types";

export interface CalculatePositionOptions {
  imageWidth: number;
  imageHeight: number;
  wmWidth: number;
  wmHeight: number;
  position: PositionPreset;
  customX: number;
  customY: number;
  marginHorizontal: number;
  marginVertical: number;
}

export interface PositionResult {
  x: number;
  y: number;
}

export function calculateWatermarkPosition(opts: CalculatePositionOptions): PositionResult {
  const {
    imageWidth,
    imageHeight,
    wmWidth,
    wmHeight,
    position,
    customX,
    customY,
    marginHorizontal,
    marginVertical,
  } = opts;

  const scale = Math.max(0.4, imageWidth / 1920);
  const marginX = Math.round(marginHorizontal * scale);
  const marginY = Math.round(marginVertical * scale);

  let x = 0;
  let y = 0;

  switch (position) {
    case "top-left":
      x = marginX;
      y = marginY;
      break;
    case "top-center":
      x = Math.round((imageWidth - wmWidth) / 2);
      y = marginY;
      break;
    case "top-right":
      x = imageWidth - wmWidth - marginX;
      y = marginY;
      break;
    case "center-left":
      x = marginX;
      y = Math.round((imageHeight - wmHeight) / 2);
      break;
    case "center":
      x = Math.round((imageWidth - wmWidth) / 2);
      y = Math.round((imageHeight - wmHeight) / 2);
      break;
    case "center-right":
      x = imageWidth - wmWidth - marginX;
      y = Math.round((imageHeight - wmHeight) / 2);
      break;
    case "bottom-left":
      x = marginX;
      y = imageHeight - wmHeight - marginY;
      break;
    case "bottom-center":
      x = Math.round((imageWidth - wmWidth) / 2);
      y = imageHeight - wmHeight - marginY;
      break;
    case "bottom-right":
      x = imageWidth - wmWidth - marginX;
      y = imageHeight - wmHeight - marginY;
      break;
    case "custom":
      x = Math.round((imageWidth - wmWidth) * (customX / 100));
      y = Math.round((imageHeight - wmHeight) * (customY / 100));
      break;
  }

  x = Math.max(0, Math.min(x, imageWidth - wmWidth));
  y = Math.max(0, Math.min(y, imageHeight - wmHeight));

  return { x, y };
}
