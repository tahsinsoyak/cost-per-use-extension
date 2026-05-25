import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function createChunk(type, data) {
  const header = Buffer.alloc(8);
  header.writeUInt32BE(data.length, 0);
  header.write(type, 4);
  const footer = Buffer.alloc(4);
  footer.writeUInt32BE(crc32(Buffer.concat([header.subarray(4), data])), 0);
  return Buffer.concat([header, data, footer]);
}

/**
 * Renders a beautiful icon with:
 * - Rounded-square gradient background (blue→green)
 * - White ÷ (division) symbol centered
 * - Anti-aliased edges
 */
function generateIconPng(size) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const cx = size / 2, cy = size / 2;
  const radius = size * 0.22; // corner radius for rounded square
  const margin = size * 0.08;
  const innerL = margin, innerR = size - margin, innerT = margin, innerB = size - margin;

  // Division symbol geometry
  const barW = size * 0.42, barH = Math.max(2, size * 0.10);
  const barX1 = cx - barW / 2, barX2 = cx + barW / 2;
  const barY1 = cy - barH / 2, barY2 = cy + barH / 2;
  const dotR = Math.max(1.5, size * 0.075);
  const dotTopY = cy - size * 0.20;
  const dotBotY = cy + size * 0.20;

  for (let y = 0; y < size; y++) {
    const off = y * (size * 4 + 1);
    raw[off] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const px = off + 1 + x * 4;
      
      // Rounded rectangle SDF
      const dx = Math.max(innerL + radius - x, 0, x - (innerR - radius));
      const dy = Math.max(innerT + radius - y, 0, y - (innerB - radius));
      const dist = Math.sqrt(dx * dx + dy * dy) - radius;
      const insideRect = x >= innerL && x <= innerR && y >= innerT && y <= innerB;
      
      let bgAlpha;
      if (dist <= -1 && insideRect) bgAlpha = 1;
      else if (dist <= 0 && insideRect) bgAlpha = -dist;
      else if (insideRect) bgAlpha = 1;
      else bgAlpha = Math.max(0, 1 - dist);

      bgAlpha = Math.min(1, Math.max(0, bgAlpha));

      if (bgAlpha <= 0) {
        raw[px] = 0; raw[px+1] = 0; raw[px+2] = 0; raw[px+3] = 0;
        continue;
      }

      // Gradient: top-left blue (#2563EB) → bottom-right green (#10B981)
      const t = ((x - innerL) + (y - innerT)) / ((innerR - innerL) + (innerB - innerT));
      let r = Math.round(37 + (16 - 37) * t);
      let g = Math.round(99 + (185 - 99) * t);
      let b = Math.round(235 + (129 - 235) * t);

      // Draw white symbol on top
      let symbolAlpha = 0;

      // Horizontal bar
      if (x >= barX1 && x <= barX2 && y >= barY1 && y <= barY2) {
        // Soft edges
        const edgeX = Math.min(x - barX1, barX2 - x, barH);
        const edgeY = Math.min(y - barY1, barY2 - y, barH);
        symbolAlpha = Math.min(1, Math.min(edgeX, edgeY) + 0.5);
      }

      // Top dot
      const dtTop = Math.sqrt((x - cx) ** 2 + (y - dotTopY) ** 2);
      if (dtTop <= dotR + 0.5) {
        symbolAlpha = Math.max(symbolAlpha, Math.min(1, dotR + 0.5 - dtTop));
      }

      // Bottom dot
      const dtBot = Math.sqrt((x - cx) ** 2 + (y - dotBotY) ** 2);
      if (dtBot <= dotR + 0.5) {
        symbolAlpha = Math.max(symbolAlpha, Math.min(1, dotR + 0.5 - dtBot));
      }

      symbolAlpha = Math.min(1, symbolAlpha);

      // Composite white symbol over gradient
      const fr = Math.round(r * (1 - symbolAlpha) + 255 * symbolAlpha);
      const fg = Math.round(g * (1 - symbolAlpha) + 255 * symbolAlpha);
      const fb = Math.round(b * (1 - symbolAlpha) + 255 * symbolAlpha);
      const fa = Math.round(bgAlpha * 255);

      raw[px] = Math.min(255, fr);
      raw[px+1] = Math.min(255, fg);
      raw[px+2] = Math.min(255, fb);
      raw[px+3] = fa;
    }
  }

  const idat = createChunk('IDAT', zlib.deflateSync(raw, { level: 9 }));
  return Buffer.concat([sig, createChunk('IHDR', ihdr), idat, createChunk('IEND', Buffer.alloc(0))]);
}

function generate() {
  const iconsDir = path.join(__dirname, '../public/icons');
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  for (const s of [16, 32, 48, 128]) {
    fs.writeFileSync(path.join(iconsDir, `icon${s}.png`), generateIconPng(s));
    console.log(`  ✓ icon${s}.png  (${fs.statSync(path.join(iconsDir, `icon${s}.png`)).size} bytes)`);
  }
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateIconPng(32));
  console.log('Icons generated with ÷ symbol on gradient background.');
}
generate();
