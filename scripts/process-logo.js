const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = 'C:/Users/abbas/.gemini/antigravity/brain/cc0fd211-0289-478b-bb31-2c63a1268194/.user_uploaded/media_1791396230714_3bf150a1.png';

async function processLogo() {
  console.log('Loading input image...');
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  console.log(`Image size: ${width}x${height}`);

  // Create buffers for:
  // 1. Color version (vibrant Markaan blue with transparent background)
  // 2. Pure white version (transparent background with white pixels for watermark)
  const colorBuffer = Buffer.alloc(width * height * 4);
  const whiteBuffer = Buffer.alloc(width * height * 4);

  // Target Markaan primary blue: [0, 168, 243] or [14, 165, 233] (sky-500)
  const fgR = 0;
  const fgG = 168;
  const fgB = 243;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Compute alpha based on whiteness.
    // In the image, background is ~255, 255, 255.
    // The logo foreground has low red (r ~ 0 to 80).
    // Whiteness is high when r, g, b are all high.
    const whiteness = Math.min(r, g, b);

    let alpha = 0;
    if (whiteness >= 250) {
      alpha = 0; // Pure white background / cutouts -> fully transparent
    } else if (whiteness <= 40) {
      alpha = 255; // Solid logo -> fully opaque
    } else {
      // Smooth anti-aliased edge
      const t = (250 - whiteness) / (250 - 40);
      alpha = Math.round(Math.pow(t, 1.2) * 255);
    }

    // Color version (Markaan theme cyan/blue)
    colorBuffer[i] = fgR;
    colorBuffer[i + 1] = fgG;
    colorBuffer[i + 2] = fgB;
    colorBuffer[i + 3] = alpha;

    // White version (for dark theme & photography watermark)
    whiteBuffer[i] = 255;
    whiteBuffer[i + 1] = 255;
    whiteBuffer[i + 2] = 255;
    whiteBuffer[i + 3] = alpha;
  }

  // Save base transparent emblem (512x512 high resolution)
  const targetSize = 512;
  const colorPng = await sharp(colorBuffer, { raw: { width, height, channels: 4 } })
    .trim()
    .resize(targetSize, targetSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const whitePng = await sharp(whiteBuffer, { raw: { width, height, channels: 4 } })
    .trim()
    .resize(targetSize, targetSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync('public/markaan-logo.png', colorPng);
  fs.writeFileSync('public/markaan-logo-white.png', whitePng);
  console.log('Saved public/markaan-logo.png and public/markaan-logo-white.png');

  // Convert white emblem to base64 so it can be embedded directly in the default watermark SVG
  const whiteBase64 = whitePng.toString('base64');

  // Generate full institutional watermark SVG combining:
  // - Markaan Logo Emblem
  // - "MARKAAN" bold typography
  // - "BY AHSAN RAZA" tagline
  // - "BULK WATERMARK STUDIO"
  const fullWatermarkSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 240" width="1000" height="240">
  <g fill="#ffffff">
    <!-- Markaan Emblem Left -->
    <image href="data:image/png;base64,${whiteBase64}" x="40" y="25" width="190" height="190" preserveAspectRatio="xMidYMid meet" />

    <!-- Typography -->
    <!-- Primary Title: MARKAAN -->
    <text x="260" y="105" 
          font-family="'Inter', 'Montserrat', 'Helvetica Neue', 'Arial', sans-serif" 
          font-size="52" 
          font-weight="800" 
          letter-spacing="10" 
          fill="#ffffff">MARKAAN</text>

    <!-- Subtitle / Creator Tag: BY AHSAN RAZA -->
    <text x="264" y="148" 
          font-family="'Inter', 'Montserrat', 'Helvetica Neue', 'Arial', sans-serif" 
          font-size="20" 
          font-weight="600" 
          letter-spacing="8" 
          fill="#ffffff" 
          opacity="0.95">BY AHSAN RAZA</text>
          
    <!-- Studio Tag -->
    <text x="265" y="178" 
          font-family="'Inter', 'Montserrat', 'Helvetica Neue', 'Arial', sans-serif" 
          font-size="13" 
          font-weight="400" 
          letter-spacing="5" 
          fill="#ffffff" 
          opacity="0.75">PROFESSIONAL BULK WATERMARK STUDIO</text>
  </g>
</svg>
`;

  // Render full watermark PNG as well
  const fullWatermarkPng = await sharp(Buffer.from(fullWatermarkSvg))
    .png()
    .toBuffer();

  fs.writeFileSync('public/markaan-watermark-full.png', fullWatermarkPng);
  console.log('Saved public/markaan-watermark-full.png');

  // Also write SVG string to a file for preview/inspection
  fs.writeFileSync('public/markaan-watermark.svg', fullWatermarkSvg);
  console.log('Saved public/markaan-watermark.svg');

  console.log('All Markaan logo assets generated successfully!');
}

processLogo().catch(console.error);
