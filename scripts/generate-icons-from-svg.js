import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const iconsDir = path.join(__dirname, '../public/icons');
const publicDir = path.join(__dirname, '../public');

async function run() {
  try {
    if (!fs.existsSync(inputSvg)) {
      console.error(`Input SVG not found at: ${inputSvg}`);
      process.exit(1);
    }
    
    for (const size of [16, 32, 48, 128]) {
      const dest = path.join(iconsDir, `icon${size}.png`);
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(dest);
      console.log(`✓ Generated icon${size}.png`);
    }
    
    // Also generate favicon
    await sharp(inputSvg)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log(`✓ Generated favicon.ico`);
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
}

run();
