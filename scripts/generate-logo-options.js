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

// -------------------------------------------------------------
// Layout Options (Varying themes on your original 256x256 shape)
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// Fresh Logo Concepts (Designed from scratch by AI)
// -------------------------------------------------------------
const concept1 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Concept 1: Mobius Loop</title>
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="loopGradient" x1="48" y1="128" x2="208" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="16" y="16" width="224" height="224" rx="56" fill="url(#bg)" stroke="#334155" stroke-width="2"/>
  <path d="M128 128 C96 85 54 85 54 128 C54 171 96 171 128 128 C160 85 202 85 202 128 C202 171 160 171 128 128 Z" stroke="url(#loopGradient)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3" filter="url(#glow)"/>
  <path d="M128 128 C96 85 54 85 54 128 C54 171 96 171 128 128 C160 85 202 85 202 128 C202 171 160 171 128 128 Z" stroke="url(#loopGradient)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M128 128 C96 85 54 85 54 128 C54 171 96 171 128 128 C160 85 202 85 202 128 C202 171 160 171 128 128 Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8"/>
  <text x="128" y="142" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="42" font-weight="900" text-anchor="middle" filter="url(#glow)">$</text>
</svg>`;

const concept2 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Concept 2: Hourglass Coins</title>
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="256">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="16" y="16" width="224" height="224" rx="56" fill="url(#bg)" stroke="#334155" stroke-width="2"/>
  <path d="M70 60 H186 V72 H70 V60 Z M70 184 H186 V196 H70 V184 Z" fill="#64748B"/>
  <rect x="74" y="72" width="10" height="112" fill="#475569" rx="2"/>
  <rect x="172" y="72" width="10" height="112" fill="#475569" rx="2"/>
  <path d="M86 72 C86 110 116 128 128 128 C140 128 170 110 170 72 Z M86 184 C86 146 116 128 128 128 C140 128 170 146 170 184 Z" fill="#3B82F6" fill-opacity="0.1" stroke="#3B82F6" stroke-width="4" stroke-opacity="0.5"/>
  <ellipse cx="128" cy="88" rx="26" ry="7" fill="url(#gold)" filter="url(#glow)"/>
  <ellipse cx="128" cy="94" rx="24" ry="6.5" fill="url(#gold)"/>
  <ellipse cx="128" cy="100" rx="22" ry="6" fill="url(#gold)"/>
  <circle cx="128" cy="116" r="4.5" fill="#FBBF24"/>
  <circle cx="128" cy="128" r="4.5" fill="#FBBF24"/>
  <circle cx="128" cy="140" r="4.5" fill="#FBBF24"/>
  <ellipse cx="128" cy="178" rx="30" ry="8" fill="#10B981" filter="url(#glow)"/>
  <ellipse cx="128" cy="172" rx="28" ry="7.5" fill="#10B981"/>
  <ellipse cx="112" cy="166" rx="14" ry="4" fill="#059669"/>
  <ellipse cx="144" cy="166" rx="14" ry="4" fill="#059669"/>
</svg>`;

const concept3 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Concept 3: Tag Calendar</title>
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect x="16" y="16" width="224" height="224" rx="56" fill="url(#bg)" stroke="#334155" stroke-width="2"/>
  <rect x="60" y="60" width="136" height="136" rx="16" fill="#1E293B" stroke="#475569" stroke-width="3" filter="url(#shadow)"/>
  <path d="M60 76 C60 68 68 60 76 60 H180 C188 60 196 60 196 76 V90 H60 V76 Z" fill="#EF4444"/>
  <rect x="90" y="46" width="12" height="24" rx="6" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
  <rect x="154" y="46" width="12" height="24" rx="6" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
  <g transform="translate(128, 138) rotate(-12) translate(-128, -138)" filter="url(#shadow)">
    <rect x="80" y="96" width="96" height="74" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
    <circle cx="100" cy="133" r="6" fill="#1E293B"/>
    <path d="M125 116H160M125 133H160M125 150H150" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
    <text x="100" y="140" fill="#EF4444" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">$</text>
  </g>
</svg>`;

const concept4 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Concept 4: Cost Optimization Chart</title>
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect x="16" y="16" width="224" height="224" rx="56" fill="url(#bg)" stroke="#334155" stroke-width="2"/>
  <g transform="translate(60, 160)" filter="url(#shadow)">
    <path d="M-15 0 L0 10 L15 0 L0 -10 Z" fill="#0284C7"/>
    <path d="M-15 0 V-40 L0 -30 V10 Z" fill="#0369A1"/>
    <path d="M15 0 V-40 L0 -30 V10 Z" fill="#075985"/>
    <path d="M-15 -40 L0 -30 L15 -40 L0 -50 Z" fill="#38BDF8"/>
    <circle cx="0" cy="-68" r="8" fill="#EF4444"/>
    <text x="0" y="-65" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="10" font-weight="900" text-anchor="middle">1</text>
  </g>
  <g transform="translate(128, 160)" filter="url(#shadow)">
    <path d="M-15 0 L0 10 L15 0 L0 -10 Z" fill="#0284C7"/>
    <path d="M-15 0 V-25 L0 -15 V10 Z" fill="#0369A1"/>
    <path d="M15 0 V-25 L0 -15 V10 Z" fill="#075985"/>
    <path d="M-15 -25 L0 -15 L15 -25 L0 -35 Z" fill="#38BDF8"/>
    <circle cx="0" cy="-53" r="8" fill="#F59E0B"/>
    <text x="0" y="-50" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="10" font-weight="900" text-anchor="middle">5</text>
  </g>
  <g transform="translate(196, 160)" filter="url(#shadow)">
    <path d="M-15 0 L0 10 L15 0 L0 -10 Z" fill="#10B981"/>
    <path d="M-15 0 V-12 L0 -2 V10 Z" fill="#059669"/>
    <path d="M15 0 V-12 L0 -2 V10 Z" fill="#047857"/>
    <path d="M-15 -12 L0 -2 L15 -12 L0 -22 Z" fill="#34D399"/>
    <circle cx="0" cy="-40" r="8" fill="#10B981"/>
    <text x="0" y="-37" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="9" font-weight="900" text-anchor="middle">50</text>
  </g>
  <path d="M60 80 Q128 105 196 122" fill="none" stroke="#10B981" stroke-width="4" stroke-dasharray="8 4" stroke-linecap="round"/>
  <path d="M196 122 L186 116 M196 122 L188 129" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const concept5 = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Concept 5: CU Monogram</title>
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="cGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="uGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect x="16" y="16" width="224" height="224" rx="56" fill="url(#bg)" stroke="#334155" stroke-width="2"/>
  <g filter="url(#shadow)">
    <path d="M176 80 C156 60 110 60 90 80 C68 102 68 154 90 176 C110 196 156 196 176 176" stroke="url(#cGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="M116 100 V136 C116 148 126 156 138 156 C150 156 160 148 160 136 V100" stroke="url(#uGrad)" stroke-width="16" stroke-linecap="round" fill="none"/>
    <path d="M84 172 L172 84" stroke="#F8FAFC" stroke-width="10" stroke-linecap="round"/>
  </g>
</svg>`;

const files = [
  { name: 'option1', svg: option1 },
  { name: 'option2', svg: option2 },
  { name: 'option3', svg: option3 },
  { name: 'option4', svg: option4 },
  { name: 'option5', svg: option5 },
  { name: 'concept1', svg: concept1 },
  { name: 'concept2', svg: concept2 },
  { name: 'concept3', svg: concept3 },
  { name: 'concept4', svg: concept4 },
  { name: 'concept5', svg: concept5 },
];

async function run() {
  try {
    for (const file of files) {
      // Save SVG
      const svgPath = path.join(targetDir, `${file.name}.svg`);
      fs.writeFileSync(svgPath, file.svg);
      console.log(`✓ Saved ${file.name}.svg`);

      // Generate 512x512 PNG
      const pngPath = path.join(targetDir, `${file.name}.png`);
      await sharp(Buffer.from(file.svg))
        .resize(512, 512)
        .png()
        .toFile(pngPath);
      console.log(`✓ Generated ${file.name}.png (512x512)`);
    }
    console.log('\nAll 10 designs (5 layout options + 5 fresh concepts) generated inside "logo_options/" folder!');
  } catch (err) {
    console.error('Error generating files:', err);
    process.exit(1);
  }
}

run();
