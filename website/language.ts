export const siteLanguages = [
  {code: 'en', label: 'English', locale: 'en-US'},
  {code: 'ar', label: 'العربية', locale: 'ar'},
  {code: 'zh-CN', label: '简体中文', locale: 'zh-CN'},
  {code: 'fr', label: 'Français', locale: 'fr-FR'},
  {code: 'de', label: 'Deutsch', locale: 'de-DE'},
  {code: 'ja', label: '日本語', locale: 'ja-JP'},
  {code: 'pt-BR', label: 'Português (Brasil)', locale: 'pt-BR'},
  {code: 'ru', label: 'Русский', locale: 'ru-RU'},
  {code: 'es', label: 'Español', locale: 'es-ES'},
  {code: 'tr', label: 'Türkçe', locale: 'tr-TR'},
] as const;
export type SiteLanguage = typeof siteLanguages[number]['code'];
const LANGUAGE_KEY = 'cost-per-use.website.language';

export function isSiteLanguage(value: unknown): value is SiteLanguage {
  return siteLanguages.some(language => language.code === value);
}

export function languageLocale(language: SiteLanguage): string {
  return siteLanguages.find(item => item.code === language)!.locale;
}

export function yearUnit(language: SiteLanguage, years: number): string {
  return new Intl.NumberFormat(languageLocale(language), {style: 'unit', unit: 'year', unitDisplay: 'long'})
    .formatToParts(Number.isFinite(years) ? years : 0).find(part => part.type === 'unit')?.value ?? '';
}

export function matchLanguage(locale: string): SiteLanguage | undefined {
  const normalized = locale.toLowerCase().replaceAll('_', '-');
  const base = normalized.split('-')[0];
  if (base === 'pt') return 'pt-BR';
  // Do not silently label Traditional Chinese preferences as Simplified Chinese.
  if (base === 'zh') {
    if (normalized.includes('hant') || /-(tw|hk|mo)(-|$)/.test(normalized)) return undefined;
    return 'zh-CN';
  }
  return isSiteLanguage(base) ? base : undefined;
}

export function initialLanguage(): SiteLanguage {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (isSiteLanguage(saved)) return saved;
  } catch {
    // Browser preferences still work when storage is unavailable.
  }
  if (typeof navigator === 'undefined') return 'en';
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of preferred) {
    const language = matchLanguage(locale ?? '');
    if (language) return language;
  }
  return 'en';
}

export function rememberLanguage(language: SiteLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // The switch still works for this visit if storage is blocked.
  }
}
