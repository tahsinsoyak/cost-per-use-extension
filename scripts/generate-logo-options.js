import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../logo_options');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const option1 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Option 1: Neon Glow</title>
  <defs>
    <radialGradient id="bgGradient" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="blueGradient" x1="58" y1="48" x2="198" y2="212" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00F0FF"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <linearGradient id="calculatorGradient" x1="156" y1="132" x2="214" y2="204" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <circle cx="128" cy="128" r="112" fill="url(#bgGradient)" filter="url(#softShadow)"/>
  <path d="M135 43 A86 86 0 1 0 148 207" stroke="url(#blueGradient)" stroke-width="14" stroke-linecap="round" fill="none" filter="url(#neonGlow)"/>
  <path d="M158 55 L151 80" stroke="#00F0FF" stroke-width="6" stroke-linecap="round"/>
  <path d="M184 70 L169 89" stroke="#00F0FF" stroke-width="6" stroke-linecap="round"/>
  <path d="M204 97 L181 109" stroke="#00F0FF" stroke-width="6" stroke-linecap="round"/>
  <path d="M211 126 L187 129" stroke="#00F0FF" stroke-width="6" stroke-linecap="round"/>
  <path d="M116 69 V88" stroke="#F8FAFC" stroke-width="13" stroke-linecap="round"/>
  <path d="M116 168 V187" stroke="#F8FAFC" stroke-width="13" stroke-linecap="round"/>
  <path d="M146 93 C139 76 115 70 96 80 C77 90 78 113 100 120 L132 130 C157 138 160 164 139 176 C116 189 89 181 80 160" stroke="#F8FAFC" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#neonGlow)"/>
  <rect x="154" y="132" width="62" height="74" rx="13" fill="url(#calculatorGradient)" stroke="#60A5FA" stroke-width="1.5"/>
  <rect x="165" y="146" width="40" height="16" rx="4" fill="#020617" stroke="#38BDF8" stroke-width="1"/>
  <rect x="167" y="173" width="15" height="15" rx="5" fill="#3B82F6"/>
  <rect x="190" y="173" width="15" height="15" rx="5" fill="#10B981"/>
  <rect x="167" y="195" width="15" height="15" rx="5" fill="#EF4444"/>
  <rect x="190" y="195" width="15" height="15" rx="5" fill="#F59E0B"/>
</svg>`;

const option2 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Option 2: Modern Flat</title>
  <defs>
    <linearGradient id="bgGradient" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="blueGradient" x1="58" y1="48" x2="198" y2="212" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="calculatorGradient" x1="156" y1="132" x2="214" y2="204" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="112" fill="url(#bgGradient)" stroke="#334155" stroke-width="3"/>
  <path d="M135 43 A86 86 0 1 0 148 207" stroke="url(#blueGradient)" stroke-width="14" stroke-linecap="round" fill="none"/>
  <path d="M158 55 L151 80" stroke="#60A5FA" stroke-width="6" stroke-linecap="round"/>
  <path d="M184 70 L169 89" stroke="#60A5FA" stroke-width="6" stroke-linecap="round"/>
  <path d="M204 97 L181 109" stroke="#60A5FA" stroke-width="6" stroke-linecap="round"/>
  <path d="M211 126 L187 129" stroke="#60A5FA" stroke-width="6" stroke-linecap="round"/>
  <path d="M116 69 V88" stroke="#F1F5F9" stroke-width="13" stroke-linecap="round"/>
  <path d="M116 168 V187" stroke="#F1F5F9" stroke-width="13" stroke-linecap="round"/>
  <path d="M146 93 C139 76 115 70 96 80 C77 90 78 113 100 120 L132 130 C157 138 160 164 139 176 C116 189 89 181 80 160" stroke="#F1F5F9" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="154" y="132" width="62" height="74" rx="13" fill="url(#calculatorGradient)" stroke="#64748B" stroke-width="1"/>
  <rect x="165" y="146" width="40" height="16" rx="4" fill="#0F172A"/>
  <rect x="167" y="173" width="15" height="15" rx="5" fill="#334155"/>
  <rect x="190" y="173" width="15" height="15" rx="5" fill="#334155"/>
  <rect x="167" y="195" width="15" height="15" rx="5" fill="#334155"/>
  <rect x="190" y="195" width="15" height="15" rx="5" fill="#10B981"/>
</svg>`;

const option3 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Option 3: Cyberpunk</title>
  <defs>
    <radialGradient id="bgGradient" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#2D0054"/>
      <stop offset="100%" stop-color="#0B001A"/>
    </radialGradient>
    <linearGradient id="magentaGradient" x1="58" y1="48" x2="198" y2="212" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF007F"/>
      <stop offset="100%" stop-color="#7900FF"/>
    </linearGradient>
    <linearGradient id="calculatorGradient" x1="156" y1="132" x2="214" y2="204" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF007F"/>
      <stop offset="100%" stop-color="#00F0FF"/>
    </linearGradient>
    <filter id="cyberGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <circle cx="128" cy="128" r="112" fill="url(#bgGradient)" filter="url(#softShadow)" stroke="#FF007F" stroke-width="1.5"/>
  <path d="M135 43 A86 86 0 1 0 148 207" stroke="url(#magentaGradient)" stroke-width="14" stroke-linecap="round" fill="none" filter="url(#cyberGlow)"/>
  <path d="M158 55 L151 80" stroke="#FF007F" stroke-width="6" stroke-linecap="round"/>
  <path d="M184 70 L169 89" stroke="#FF007F" stroke-width="6" stroke-linecap="round"/>
  <path d="M204 97 L181 109" stroke="#FF007F" stroke-width="6" stroke-linecap="round"/>
  <path d="M211 126 L187 129" stroke="#FF007F" stroke-width="6" stroke-linecap="round"/>
  <path d="M116 69 V88" stroke="#00F0FF" stroke-width="13" stroke-linecap="round" filter="url(#cyberGlow)"/>
  <path d="M116 168 V187" stroke="#00F0FF" stroke-width="13" stroke-linecap="round" filter="url(#cyberGlow)"/>
  <path d="M146 93 C139 76 115 70 96 80 C77 90 78 113 100 120 L132 130 C157 138 160 164 139 176 C116 189 89 181 80 160" stroke="#00F0FF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#cyberGlow)"/>
  <rect x="154" y="132" width="62" height="74" rx="13" fill="url(#calculatorGradient)" stroke="#FFFFFF" stroke-width="1"/>
  <rect x="165" y="146" width="40" height="16" rx="4" fill="#0B001A"/>
  <rect x="167" y="173" width="15" height="15" rx="5" fill="#00F0FF"/>
  <rect x="190" y="173" width="15" height="15" rx="5" fill="#FF007F"/>
  <rect x="167" y="195" width="15" height="15" rx="5" fill="#FF007F"/>
  <rect x="190" y="195" width="15" height="15" rx="5" fill="#00F0FF"/>
</svg>`;

const option4 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Option 4: Gold and Emerald</title>
  <defs>
    <radialGradient id="bgGradient" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="100%" stop-color="#022C22"/>
    </radialGradient>
    <linearGradient id="goldGradient" x1="58" y1="48" x2="198" y2="212" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="calculatorGradient" x1="156" y1="132" x2="214" y2="204" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <circle cx="128" cy="128" r="112" fill="url(#bgGradient)" filter="url(#softShadow)" stroke="#F59E0B" stroke-width="1"/>
  <path d="M135 43 A86 86 0 1 0 148 207" stroke="url(#goldGradient)" stroke-width="14" stroke-linecap="round" fill="none"/>
  <path d="M158 55 L151 80" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
  <path d="M184 70 L169 89" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
  <path d="M204 97 L181 109" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
  <path d="M211 126 L187 129" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
  <path d="M116 69 V88" stroke="#FEF08A" stroke-width="13" stroke-linecap="round"/>
  <path d="M116 168 V187" stroke="#FEF08A" stroke-width="13" stroke-linecap="round"/>
  <path d="M146 93 C139 76 115 70 96 80 C77 90 78 113 100 120 L132 130 C157 138 160 164 139 176 C116 189 89 181 80 160" stroke="url(#goldGradient)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="154" y="132" width="62" height="74" rx="13" fill="url(#calculatorGradient)" stroke="#F59E0B" stroke-width="1"/>
  <rect x="165" y="146" width="40" height="16" rx="4" fill="#022C22"/>
  <rect x="167" y="173" width="15" height="15" rx="5" fill="#022C22"/>
  <rect x="190" y="173" width="15" height="15" rx="5" fill="#022C22"/>
  <rect x="167" y="195" width="15" height="15" rx="5" fill="#022C22"/>
  <rect x="190" y="195" width="15" height="15" rx="5" fill="#D97706"/>
</svg>`;

const option5 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Option 5: Silver and Charcoal</title>
  <defs>
    <radialGradient id="bgGradient" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#374151"/>
      <stop offset="100%" stop-color="#111827"/>
    </radialGradient>
    <linearGradient id="silverGradient" x1="58" y1="48" x2="198" y2="212" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F3F4F6"/>
      <stop offset="50%" stop-color="#E5E7EB"/>
      <stop offset="100%" stop-color="#9CA3AF"/>
    </linearGradient>
    <linearGradient id="calculatorGradient" x1="156" y1="132" x2="214" y2="204" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#D1D5DB"/>
      <stop offset="100%" stop-color="#4B5563"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <circle cx="128" cy="128" r="112" fill="url(#bgGradient)" filter="url(#softShadow)" stroke="#6B7280" stroke-width="1"/>
  <path d="M135 43 A86 86 0 1 0 148 207" stroke="url(#silverGradient)" stroke-width="14" stroke-linecap="round" fill="none"/>
  <path d="M158 55 L151 80" stroke="#9CA3AF" stroke-width="6" stroke-linecap="round"/>
  <path d="M184 70 L169 89" stroke="#9CA3AF" stroke-width="6" stroke-linecap="round"/>
  <path d="M204 97 L181 109" stroke="#9CA3AF" stroke-width="6" stroke-linecap="round"/>
  <path d="M211 126 L187 129" stroke="#9CA3AF" stroke-width="6" stroke-linecap="round"/>
  <path d="M116 69 V88" stroke="#F9FAFB" stroke-width="13" stroke-linecap="round"/>
  <path d="M116 168 V187" stroke="#F9FAFB" stroke-width="13" stroke-linecap="round"/>
  <path d="M146 93 C139 76 115 70 96 80 C77 90 78 113 100 120 L132 130 C157 138 160 164 139 176 C116 189 89 181 80 160" stroke="url(#silverGradient)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="154" y="132" width="62" height="74" rx="13" fill="url(#calculatorGradient)" stroke="#9CA3AF" stroke-width="1"/>
  <rect x="165" y="146" width="40" height="16" rx="4" fill="#111827"/>
  <rect x="167" y="173" width="15" height="15" rx="5" fill="#374151"/>
  <rect x="190" y="173" width="15" height="15" rx="5" fill="#374151"/>
  <rect x="167" y="195" width="15" height="15" rx="5" fill="#374151"/>
  <rect x="190" y="195" width="15" height="15" rx="5" fill="#111827"/>
</svg>`;

const options = [
  { name: 'option1', svg: option1 },
  { name: 'option2', svg: option2 },
  { name: 'option3', svg: option3 },
  { name: 'option4', svg: option4 },
  { name: 'option5', svg: option5 },
];

async function run() {
  try {
    for (const opt of options) {
      // Write SVG
      const svgPath = path.join(targetDir, `${opt.name}.svg`);
      fs.writeFileSync(svgPath, opt.svg);
      console.log(`✓ Saved ${opt.name}.svg`);

      // Write 512x512 PNG
      const pngPath = path.join(targetDir, `${opt.name}.png`);
      await sharp(Buffer.from(opt.svg))
        .resize(512, 512)
        .png()
        .toFile(pngPath);
      console.log(`✓ Generated ${opt.name}.png (512x512)`);
    }
    console.log('\\nAll 5 logo options generated successfully inside "logo_options/" folder!');
  } catch (err) {
    console.error('Error generating options:', err);
    process.exit(1);
  }
}

run();
