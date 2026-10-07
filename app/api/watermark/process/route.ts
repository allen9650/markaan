import { NextRequest, NextResponse } from "next/server";
import { processWatermark } from "@/lib/watermark/processor";
import { DEFAULT_WATERMARK_SETTINGS } from "@/lib/watermark/settings";
import { WatermarkSettings } from "@/lib/watermark/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const watermarkFile = formData.get("watermark") as File | null;
    const settingsRaw = formData.get("settings") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    let settings: WatermarkSettings = DEFAULT_WATERMARK_SETTINGS;
    if (settingsRaw) {
      try {
        settings = { ...DEFAULT_WATERMARK_SETTINGS, ...JSON.parse(settingsRaw) };
      } catch {
        // fallback to default
      }
    }

    const imageArrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    let watermarkBuffer: Buffer | null = null;
    if (watermarkFile && watermarkFile.size > 0) {
      const wmArrayBuffer = await watermarkFile.arrayBuffer();
      watermarkBuffer = Buffer.from(wmArrayBuffer);
    }

    const result = await processWatermark({
      imageBuffer,
      watermarkBuffer,
      settings,
    });

    const originalName = imageFile.name || "image.jpg";
    const dotIndex = originalName.lastIndexOf(".");
    const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
    const ext = result.format === "jpeg" ? "jpg" : result.format;
    const outputFilename = `${baseName}${settings.filenameSuffix || "_watermarked"}.${ext}`;

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(outputFilename)}"`,
        "X-Original-Filename": encodeURIComponent(originalName),
        "X-Output-Filename": encodeURIComponent(outputFilename),
        "X-Image-Width": result.width.toString(),
        "X-Image-Height": result.height.toString(),
        "X-Image-Size": result.size.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("API watermark processing error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image watermark." },
      { status: 500 }
    );
  }
}
