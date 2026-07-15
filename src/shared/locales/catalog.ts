export const languageCodes = [
  'en',
  'tr',
  'es',
  'de',
  'fr',
  'pt-BR',
  'ru',
  'ar',
  'ja',
  'zh-CN',
] as const;

export type Language = (typeof languageCodes)[number];

export interface LanguageConfig {
  code: Language;
  nativeName: string;
  englishName: string;
  flag: string;
  dateLocale: string;
  chromeLocale: string;
  direction: 'ltr' | 'rtl';
}

export const languages: readonly LanguageConfig[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', flag: '🇺🇸', dateLocale: 'en-US', chromeLocale: 'en', direction: 'ltr' },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', flag: '🇹🇷', dateLocale: 'tr-TR', chromeLocale: 'tr', direction: 'ltr' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', flag: '🇪🇸', dateLocale: 'es-ES', chromeLocale: 'es', direction: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German', flag: '🇩🇪', dateLocale: 'de-DE', chromeLocale: 'de', direction: 'ltr' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', flag: '🇫🇷', dateLocale: 'fr-FR', chromeLocale: 'fr', direction: 'ltr' },
  { code: 'pt-BR', nativeName: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', flag: '🇧🇷', dateLocale: 'pt-BR', chromeLocale: 'pt_BR', direction: 'ltr' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian', flag: '🇷🇺', dateLocale: 'ru-RU', chromeLocale: 'ru', direction: 'ltr' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', flag: '🇸🇦', dateLocale: 'ar', chromeLocale: 'ar', direction: 'rtl' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', flag: '🇯🇵', dateLocale: 'ja-JP', chromeLocale: 'ja', direction: 'ltr' },
  { code: 'zh-CN', nativeName: '简体中文', englishName: 'Chinese (Simplified)', flag: '🇨🇳', dateLocale: 'zh-CN', chromeLocale: 'zh_CN', direction: 'ltr' },
];

const languageByCode = new Map(languages.map((language) => [language.code, language]));

export function getLanguageConfig(code: Language): LanguageConfig {
  return languageByCode.get(code) || languages[0];
}

export function resolveLanguage(locale?: string | null): Language {
  if (!locale) return 'en';

  const normalized = locale.replace('_', '-').toLowerCase();
  const exact = languages.find((language) => language.code.toLowerCase() === normalized);
  if (exact) return exact.code;

  const base = normalized.split('-')[0];
  const baseMatch = languages.find((language) => language.code.toLowerCase().split('-')[0] === base);
  return baseMatch?.code || 'en';
}

export function applyDocumentLanguage(code: Language): void {
  if (typeof document === 'undefined') return;
  const config = getLanguageConfig(code);
  document.documentElement.lang = code;
  document.documentElement.dir = config.direction;
}
