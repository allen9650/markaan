# Markaan 🎨
### Bulk Photo Watermarking Made Instant & Painless
**By Ahsan Raza** • [GitHub Repository](https://github.com/allen9650/markaan)

> **Stop watermarking photos one by one!**  
> Markaan is a free, 100% private desktop web application designed to watermark **hundreds of photos in seconds** right on your Windows PC.  
> **No cloud uploads. No monthly subscriptions. No image limits. No loss in quality.**

---

## 😫 The Problem Markaan Solves

If you are a photographer, school event coordinator, teacher, social media manager, or business owner, you know the frustration:

* ❌ **Adding watermarks 1-by-1 takes hours:** Opening dozens or hundreds of photos individually in Photoshop, Canva, or Lightroom to place a logo is agonizingly slow.
* ❌ **Online tools compromise your privacy:** Most free watermark websites force you to upload private family, student, or event photos to third-party cloud servers.
* ❌ **Cloud tools impose arbitrary limits:** Many websites limit you to 5 or 10 images at a time, throttle your speed, compress your images to low resolution, or demand paid subscriptions.

### ✨ The Markaan Solution:
With **Markaan**, you simply drag and drop **10, 50, 100, or 500+ photos** at once, adjust your logo position with live instant preview, click **"Process All Images"**, and download a ready-to-share **ZIP file** in seconds.

All processing is handled directly by your computer's CPU using the ultra-fast **Sharp** graphics engine. Your photos **never leave your computer**.

---

## ⚡ Non-Technical Quick Start (No Coding Required!)

You do **not** need to be a programmer or know any code to use Markaan. Just follow these 3 simple steps:

### Step 1: Install Node.js (Only Needed Once)
Markaan runs as a private, secure mini-server on your own computer so it can process high-resolution images at maximum speed without the internet. To do this, it needs **Node.js** (a free, safe software runtime from the open-source community).

1. Go to the official Node.js website:  
   👉 **[https://nodejs.org/](https://nodejs.org/)**
2. Click the big green button that says **LTS (Recommended For Most Users)** to download the installer.
3. Open the downloaded file and click **Next** through the setup prompts to finish installing.

---

### Step 2: Download Markaan
1. On this GitHub page, click the green **Code** button near the top right and choose **Download ZIP**.
2. Right-click the downloaded `.zip` file, select **Extract All...**, and choose a folder on your computer (for example, on your Desktop or in your Documents folder).

*(Or if you use Git, run `git clone https://github.com/allen9650/markaan.git`)*

---

### Step 3: Launch with One Click!
1. Open the extracted `markaan` folder.
2. Find the file named **`Start-Markaan.bat`** and **double-click it**.
3. That's it! 
   * *The script will automatically check Node.js, install necessary components on the first run, and automatically open your web browser to:*
   ```
   http://localhost:3000
   ```

*(Keep the black terminal window open while using Markaan. When you are done, simply close the window.)*

---

## 🖥️ How to Use Markaan (Step-by-Step)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ 1. Choose Logo  │ ──► │ 2. Drop Photos   │ ──► │ 3. Adjust Style │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ 5. Download ZIP │ ◄── │ 4. Process Batch │ ◄───┤  Live Preview   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

1. **Choose Your Watermark:**
   - Click **"Upload Watermark"** to select your school emblem, company logo, or signature (transparent PNG format recommended).
   - Or keep the pre-loaded white Markaan emblem.
2. **Add Your Photos:**
   - Drag and drop any number of photos (**JPG, PNG, WebP**) into the large drop box.
   - Or click **"Select Folder"** to import an entire camera folder or event album in one go.
3. **Customize the Watermark in Real-Time:**
   - **Position:** Choose from 9 quick anchor points (*Bottom Center*, *Bottom Right*, *Center*, etc.) or click and drag the logo anywhere on the interactive preview!
   - **Size:** Adjust the slider from 5% to 60% of the photo's width. Markaan automatically keeps the logo's original proportions without stretching.
   - **Opacity:** Adjust transparency from faint subtle markings to full bold white (10% to 100%).
   - **Soft Drop Shadow:** Enable a soft shadow so white watermarks remain crisp and legible against bright skies, white shirts, or snow.
   - **Institutional Accent Line:** Add an elegant connecting horizontal white line on either or both sides of the emblem — standard for prestigious school and event photography.
4. **Click "Process All Images":**
   - Markaan processes your batch with multi-core efficiency. A progress bar shows you exactly how many photos are completed in real time.
5. **Download Your Watermarked Photos:**
   - Click **"Download All (ZIP)"** to save all processed photos in one package.
   - **Your original photos are 100% safe!** Markaan never overwrites your original files; it outputs new files with `_watermarked` added to the filename (e.g. `graduation01_watermarked.jpg`).

---

## ❓ Frequently Asked Questions (FAQ)

### Are my photos uploaded to the internet or cloud?
**Never.** Markaan is 100% offline. Every pixel of your photos is processed strictly inside your computer's RAM and CPU. You can disconnect your Wi-Fi/Ethernet cable and Markaan will continue working without interruption.

### Will it reduce the resolution or quality of my photos?
**No.** Markaan preserves the full original resolution of your photographs. It automatically reads orientation data (EXIF) so vertical and horizontal smartphone or DSLR photos stay right-side up. You can also customize output quality (default is 90% high-quality JPEG, or lossless PNG).

### What if I have 200, 500, or 1,000 photos?
Markaan is engineered with smart memory-safe batching (processing 2-3 images concurrently). It will not overload your computer's RAM or crash your browser, even on large photo shoots.

### Is Markaan free?
**Yes, 100% free and open-source.** No ads, no monthly plans, no hidden watermarks from us placed on your pictures.

---

## 🛠️ For Developers & Technical Users

Markaan is built with a modern Next.js App Router full-stack architecture:

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Image Engine:** [Sharp](https://sharp.pixelplumbing.com/) (high-performance C++ libvips wrapper)
- **Archive Tool:** JSZip
- **File Ingestion:** React Dropzone

### Manual Developer Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for maximum production performance
npm run build
npm start
```

### Architecture Overview

```
watermark-generator-local/
├── app/
│   ├── api/
│   │   └── watermark/
│   │       ├── preview/route.ts    # Fast downsampled server-side preview generator
│   │       └── process/route.ts    # Multi-step high-res Sharp compositing engine
│   ├── layout.tsx                  # Root metadata & page shell
│   └── page.tsx                    # Main state management & client-side worker queue
├── components/
│   ├── navbar.tsx                  # Header bar with privacy indicator & theme toggle
│   ├── image-uploader.tsx          # Drag & drop photo zone & watermark uploader
│   ├── watermark-settings.tsx      # Position, size, opacity, shadow, and line controls
│   ├── watermark-preview.tsx       # Real-time interactive preview canvas
│   ├── image-queue.tsx             # Batch list with thumbnails & status badges
│   ├── processing-progress.tsx     # Real-time batch progress & ZIP exporter
│   └── preset-manager.tsx          # Watermark style preset switcher
├── lib/
│   └── watermark/
│       ├── processor.ts            # 12-step Sharp rendering & compositing pipeline
│       ├── shadow.ts               # Alpha-silhouette Gaussian drop shadow generator
│       ├── line.ts                 # Accent line geometry generator
│       └── positioning.ts          # Resolution-independent coordinate calculations
├── Start-Markaan.bat               # 1-click launcher for Windows users
└── package.json
```

---

## 📜 License & Credits

Created with ❤️ by **Ahsan Raza**.  
Designed to make bulk watermarking fast, private, and effortless for everyone.
