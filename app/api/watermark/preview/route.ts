import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { processWatermark } from "@/lib/watermark/processor";
import { DEFAULT_WATERMARK_SETTINGS } from "@/lib/watermark/settings";
import { WatermarkSettings } from "@/lib/watermark/types";

export const dynamic = "force-dynamic";

async function generateSamplePhotoImage(): Promise<Buffer> {
  const width = 1200;
  const height = 800;
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="40%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    
    <path d="M 0,${height} L 0,550 L 150,550 L 150,420 L 250,300 L 350,420 L 350,550 L 550,550 L 550,480 L 650,480 L 650,550 L 850,550 L 950,430 L 1050,550 L 1200,550 L 1200,${height} Z" fill="#1e293b" opacity="0.6"/>
    <circle cx="250" cy="380" r="28" fill="#f8fafc" opacity="0.3"/>
    
    <circle cx="600" cy="180" r="450" fill="#60a5fa" opacity="0.08" filter="blur(60px)"/>
    <circle cx="900" cy="300" r="300" fill="#a855f7" opacity="0.06" filter="blur(60px)"/>

    <text x="600" y="320" font-family="system-ui, sans-serif" font-size="32" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="2">
      ANNUAL GRADUATION &amp; COMMENCEMENT
    </text>
    <text x="600" y="365" font-family="system-ui, sans-serif" font-size="20" font-weight="400" fill="#64748b" text-anchor="middle" letter-spacing="4">
      CAMPUS AUDITORIUM • HIGH RESOLUTION PREVIEW
    </text>
  </svg>
  `;
  return sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const watermarkFile = formData.get("watermark") as File | null;
    const settingsRaw = formData.get("settings") as string | null;

    let settings: WatermarkSettings = DEFAULT_WATERMARK_SETTINGS;
    if (settingsRaw) {
      try {
        settings = { ...DEFAULT_WATERMARK_SETTINGS, ...JSON.parse(settingsRaw) };
      } catch {
        // fallback
      }
    }

    let imageBuffer: Buffer;
    if (imageFile && imageFile.size > 0) {
      const rawBuf = Buffer.from(await imageFile.arrayBuffer());
      imageBuffer = await sharp(rawBuf)
        .rotate()
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
    } else {
      imageBuffer = await generateSamplePhotoImage();
    }

    let watermarkBuffer: Buffer | null = null;
    if (watermarkFile && watermarkFile.size > 0) {
      watermarkBuffer = Buffer.from(await watermarkFile.arrayBuffer());
    }

    const result = await processWatermark({
      imageBuffer,
      watermarkBuffer,
      settings,
    });

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Preview-Width": result.width.toString(),
        "X-Preview-Height": result.height.toString(),
      },
    });
  } catch (error: any) {
    console.error("Preview generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate preview." },
      { status: 500 }
    );
  }
}
