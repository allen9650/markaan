# Markaan 🎨
### By Ahsan Raza

> **Professional local bulk image watermarking designed for Windows users.**  
> 100% private, 100% offline — zero cloud uploads, zero external APIs, zero databases.

---

## 🌟 Overview

**Markaan** (by Ahsan Raza) is a local web application built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Sharp**. It is engineered to process hundreds of high-resolution photographs locally on the user's computer with institutional-grade visual quality, memory safety, and high speed.

### Primary Use Case:
Adding a clean, white institutional logo or crest to school events, graduation ceremonies, sports activities, and academic photography with an optional subtle drop shadow and white connecting accent lines.

### Brand Assets:
- `public/markaan-logo.png`: Transparent Markaan geometric emblem in brand cyan/blue.
- `public/markaan-logo-white.png`: Transparent pure white emblem for photography watermark overlays.
- `public/markaan-watermark-full.png`: Transparent full brand watermark badge with typography by Ahsan Raza.

---

## 🚀 Quick Start on Windows

### Prerequisites
- **Node.js** version 18.17+ or 20+ (tested and verified on Node.js v24)
- **npm** (comes bundled with Node.js)

### 1. Installation
Open PowerShell or Command Prompt in the project folder and install dependencies:
```powershell
npm install
```

### 2. Run in Development Mode
```powershell
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Production Build & Start (Recommended for maximum speed)
```powershell
npm run build
npm start
```

---

## 📁 Project Architecture

```
watermark-generator-local/
├── app/
│   ├── api/
│   │   └── watermark/
│   │       ├── preview/route.ts    # Fast downsampled server-side Sharp preview
│   │       └── process/route.ts    # Full-resolution Sharp watermarking engine
│   ├── globals.css                 # Dark/light theme design tokens and styles
│   ├── layout.tsx                  # Root HTML layout and metadata
│   └── page.tsx                    # Main dashboard state & concurrent worker queue
├── components/
│   ├── navbar.tsx                  # Top brand bar, privacy badge & dark/light toggle
│   ├── image-uploader.tsx          # Drag & drop photo zone, folder picker & watermark uploader
│   ├── watermark-settings.tsx      # Position, size, opacity, shadow, line, and format controls
│   ├── watermark-preview.tsx       # Live interactive canvas with draggable positioning
│   ├── image-queue.tsx             # Batch queue list with live statuses, filters & retry
│   ├── processing-progress.tsx     # Progress modal with ZIP download & folder export
│   └── preset-manager.tsx          # Presets dropdown & localStorage persistence
├── lib/
│   ├── watermark/
│   │   ├── types.ts                # TypeScript interfaces for all data structures
│   │   ├── settings.ts             # Default configurations & built-in presets
│   │   ├── sample-crest.ts         # High-resolution institutional emblem SVG
│   │   ├── positioning.ts          # 9-anchor + custom normalized coordinates math
│   │   ├── shadow.ts               # Alpha-silhouette drop shadow generator via Sharp
│   │   ├── line.ts                 # Horizontal accent line overlay generator
│   │   └── processor.ts            # Sharp 12-step image compositing pipeline
│   └── utils.ts                    # Tailwind CSS helpers & file formatting utilities
├── next.config.js                  # Next.js config with Sharp external package support
├── tailwind.config.js              # Tailwind theme configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Project dependencies and npm scripts
```

---

## ⚙️ How Watermark Processing Works

Every image uploaded to the application is processed locally through a memory-safe **Sharp** pipeline:

1. **EXIF Normalization**:  
   `sharp(imageBuffer).rotate()` auto-orients photos according to EXIF metadata, ensuring iPhone, Android, portrait, landscape, and square photos are never inverted or rotated sideways.
2. **Proportional Dynamic Scaling**:  
   The watermark width is computed dynamically as a percentage of each photograph's resolution (e.g., 35% of a 4000px image = 1400px; 35% of a 1920px image = 672px). The logo's native aspect ratio is strictly preserved.
3. **True Drop Shadow Generation**:  
   Rather than placing a crude black rectangle, `lib/watermark/shadow.ts` extracts the watermark's exact alpha silhouette, extends canvas padding to prevent edge clipping, scales the alpha channel with a linear matrix, and applies a Gaussian blur. This produces a soft, elegant drop shadow that keeps white logos crisp and readable even against bright skies and light clothing.
4. **Institutional Accent Line**:  
   `lib/watermark/line.ts` generates clean horizontal rules (Left, Right, or Both sides) aligned with the watermark's vertical center. Line thickness scales proportionally with the target image resolution.
5. **Multi-layer Composite**:  
   Sharp composites the shadow layer, accent lines, and watermark in a single execution pass.
6. **Encoding & Quality**:  
   Outputs to JPEG (quality 80–100, default 90), WebP (default 90), or original format with zero unnecessary compression loss.
7. **Memory Release**:  
   Buffers are streamed directly back to the client, preventing Node.js server RAM accumulation when processing batches of 500+ photographs.

---

## 🛡️ Memory & Concurrency Management

- **No Full-Resolution State**: The browser retains only lightweight thumbnails and `File` object handles—never full uncompressed image bitmaps in React state.
- **Worker Concurrency Limit**: The client processes images with a controlled pool of 2 to 3 concurrent requests (adjustable in the UI from 1x to 4x). This prevents memory spikes when handling 4K/6K/8K images.
- **Fail-Safe Batching**: If an individual file fails due to corruption or an invalid format, the queue logs the error, marks the item `Failed`, and continues processing the rest of the batch. You can retry failed files at any time with the "Retry Failed" button.

---

## 💾 Exporting Results

Once processing finishes, you have two export choices:
1. **Download All as ZIP** (`watermarked_images.zip`): Universal one-click export generated locally in the browser via JSZip.
2. **Choose Output Folder**: In modern Chromium browsers (Google Chrome, Microsoft Edge), you can select an existing folder on your Windows drive (e.g. `D:\Watermarked_Photos`) and have files written directly to disk.

---

## 🎛️ Changing Default Watermark Settings

All defaults are centralized in [`lib/watermark/settings.ts`](./lib/watermark/settings.ts):

```typescript
export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  position: "bottom-center",
  sizePercent: 35,          // 35% of photo width
  opacity: 90,              // 90% opacity
  marginHorizontal: 30,     // 30px scaled
  marginVertical: 35,       // 35px scaled
  shadow: {
    enabled: true,
    color: "#000000",
    opacity: 30,            // 30% subtle shadow
    blur: 3,                // 3px blur
    offsetX: 1,
    offsetY: 2,
  },
  line: {
    enabled: true,
    color: "#ffffff",
    opacity: 90,
    thickness: 2,           // 2px scaled
    lengthPercent: 30,      // 30% of watermark width
    position: "both",       // Both sides
  },
  outputFormat: "original", // Preserve input format
  jpegQuality: 90,
  webpQuality: 90,
  preservePngQuality: true,
  filenameSuffix: "_watermarked",
};
```

You can customize these defaults, or simply create and save your own presets directly inside the web UI using the **Watermark Preset** panel (stored in your browser's `localStorage`).

---

## 📦 Running & Packaging on Windows

To run the application locally on Windows without keeping a command prompt open:
1. Double-click `Start-Markaan.bat` in the project root:
   ```cmd
   @echo off
   cd /d "%~dp0"
   start http://localhost:3000
   npm start
   ```
2. The server will launch and open your default browser automatically at `http://localhost:3000`.
