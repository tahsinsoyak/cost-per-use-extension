import { access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = resolve(root, 'store-assets');

const expectedAssets = [
  ['screenshot-calculator.png', 1280, 800],
  ['screenshot-result.png', 1280, 800],
  ['screenshot-compare.png', 1280, 800],
  ['screenshot-history.png', 1280, 800],
  ['screenshot-options.png', 1280, 800],
  ['promo-tile-small.png', 440, 280],
  ['promo-tile-marquee.png', 1400, 560],
];

const failures = [];

for (const [filename, expectedWidth, expectedHeight] of expectedAssets) {
  const assetPath = resolve(assetsDir, filename);
  try {
    await access(assetPath);
    const metadata = await sharp(assetPath).metadata();
    if (metadata.format !== 'png') failures.push(`${filename}: expected PNG, received ${metadata.format}`);
    if (metadata.width !== expectedWidth || metadata.height !== expectedHeight) {
      failures.push(`${filename}: expected ${expectedWidth}x${expectedHeight}, received ${metadata.width}x${metadata.height}`);
    }
    if (metadata.hasAlpha) failures.push(`${filename}: alpha channel is not allowed by the Store listing requirements`);
  } catch (error) {
    failures.push(`${filename}: ${error instanceof Error ? error.message : 'missing or unreadable'}`);
  }
}

if (failures.length > 0) {
  console.error(`Store asset validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Validated ${expectedAssets.length} Chrome Web Store assets.`);
