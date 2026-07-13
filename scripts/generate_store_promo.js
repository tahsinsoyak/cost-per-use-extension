import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const outputDir = path.join(rootDir, 'store-assets');
const iconPath = path.join(rootDir, 'public', 'icons', 'icon128.png');

const escapeXml = (value) => value.replace(/[<>&'\"]/g, (character) => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
}[character]));

const createPromo = async ({ width, height, filename, titleSize, subtitleSize, iconSize }) => {
  const icon = await sharp(iconPath).resize(iconSize, iconSize).png().toBuffer();
  const textX = Math.round(width * 0.37);
  const titleY = Math.round(height * 0.48);
  const subtitleY = Math.round(height * 0.64);
  const overlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#10243f"/>
          <stop offset="0.55" stop-color="#081527"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stop-color="#22d3ee" stop-opacity="0.25"/>
          <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#background)"/>
      <circle cx="${Math.round(width * 0.22)}" cy="${Math.round(height * 0.5)}" r="${Math.round(height * 0.55)}" fill="url(#glow)"/>
      <text x="${textX}" y="${titleY}" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="${titleSize}">${escapeXml('Cost Per Use')}</text>
      <text x="${textX}" y="${subtitleY}" fill="#cbd5e1" font-family="Segoe UI, Arial, sans-serif" font-size="${subtitleSize}">${escapeXml('Know the real value before you buy')}</text>
    </svg>
  `);
  const output = path.join(outputDir, filename);

  await sharp(overlay)
    .composite([{ input: icon, left: Math.round(width * 0.1), top: Math.round((height - iconSize) / 2) }])
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log(`Generated ${output}`);
};

await createPromo({
  width: 440,
  height: 280,
  filename: 'promo-tile-small.png',
  titleSize: 35,
  subtitleSize: 15,
  iconSize: 112,
});

await createPromo({
  width: 1400,
  height: 560,
  filename: 'promo-tile-marquee.png',
  titleSize: 76,
  subtitleSize: 34,
  iconSize: 260,
});
