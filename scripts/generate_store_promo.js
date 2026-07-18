import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const outputDir = path.join(rootDir, 'store-assets');
const iconPath = path.join(rootDir, 'public', 'icons', 'icon128.png');

const background = `
  <defs>
    <linearGradient id="navy" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#142b4a"/>
      <stop offset="0.52" stop-color="#0d1929"/>
      <stop offset="1" stop-color="#07111e"/>
    </linearGradient>
    <radialGradient id="blueGlow">
      <stop offset="0" stop-color="#1f5eff" stop-opacity=".34"/>
      <stop offset="1" stop-color="#1f5eff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#ffffff" opacity=".08"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#navy)"/>
  <circle cx="18%" cy="4%" r="42%" fill="url(#blueGlow)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
`;

async function writePromo(svg, iconSize, iconLeft, iconTop, filename) {
  const icon = await sharp(iconPath).resize(iconSize, iconSize).png().toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: icon, left: iconLeft, top: iconTop }])
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, filename));
}

const smallSvg = `
  <svg width="440" height="280" xmlns="http://www.w3.org/2000/svg">
    ${background}
    <text x="94" y="57" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="24" font-weight="750">Cost Per Use</text>
    <text x="30" y="108" fill="#9bb8ff" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700" letter-spacing="1.7">REAL VALUE, BEFORE YOU BUY</text>
    <text x="28" y="184" fill="#ffffff" font-family="Consolas, monospace" font-size="55" font-weight="700" letter-spacing="-4">$0.39</text>
    <text x="210" y="179" fill="#8de7c2" font-family="Segoe UI, sans-serif" font-size="18" font-weight="700">per use</text>
    <rect x="30" y="220" width="380" height="1" fill="#ffffff" opacity=".15"/>
    <text x="30" y="248" fill="#c1ccda" font-family="Segoe UI, sans-serif" font-size="14">Turn one price into a smarter decision.</text>
  </svg>
`;

const marqueeSvg = `
  <svg width="1400" height="560" xmlns="http://www.w3.org/2000/svg">
    ${background}
    <text x="182" y="110" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="40" font-weight="750">Cost Per Use</text>
    <text x="78" y="244" fill="#9bb8ff" font-family="Segoe UI, sans-serif" font-size="15" font-weight="700" letter-spacing="2.4">REAL-WORLD PURCHASE CLARITY</text>
    <text x="78" y="322" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="57" font-weight="780" letter-spacing="-2.4">The price tag is only</text>
    <text x="78" y="382" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="57" font-weight="780" letter-spacing="-2.4">the beginning.</text>
    <text x="80" y="438" fill="#b9c6d6" font-family="Segoe UI, sans-serif" font-size="22">Compare real value across time, use, resale, and maintenance.</text>

    <rect x="972" y="82" width="352" height="396" rx="30" fill="#fffdf8"/>
    <rect x="998" y="108" width="300" height="128" rx="20" fill="#132f58"/>
    <text x="1022" y="143" fill="#a9b9cf" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700" letter-spacing="1.2">PRODUCT PRICE</text>
    <text x="1020" y="202" fill="#ffffff" font-family="Consolas, monospace" font-size="48" font-weight="700" letter-spacing="-3">$349</text>
    <text x="998" y="282" fill="#68778a" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" letter-spacing="1">COST PER USE</text>
    <text x="996" y="355" fill="#132235" font-family="Consolas, monospace" font-size="62" font-weight="700" letter-spacing="-4">$0.39</text>
    <rect x="998" y="394" width="126" height="42" rx="21" fill="#e2f5ed"/>
    <text x="1021" y="421" fill="#119b72" font-family="Segoe UI, sans-serif" font-size="15" font-weight="700">Excellent</text>
    <text x="1161" y="420" fill="#68778a" font-family="Segoe UI, sans-serif" font-size="14">782 uses</text>
  </svg>
`;

await writePromo(smallSvg, 52, 28, 24, 'promo-tile-small.png');
await writePromo(marqueeSvg, 82, 78, 54, 'promo-tile-marquee.png');

console.log(`Generated updated Chrome Web Store promotional tiles in ${outputDir}`);
