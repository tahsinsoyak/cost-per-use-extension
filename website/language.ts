export type SiteLanguage = 'en' | 'tr';
const LANGUAGE_KEY = 'cost-per-use.website.language';

export function initialLanguage(): SiteLanguage {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'en' || saved === 'tr') return saved;
  } catch {
    // Browser preferences still work when storage is unavailable.
  }
  if (typeof navigator === 'undefined') return 'en';
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of preferred) {
    const language = locale?.toLowerCase().split(/[-_]/)[0];
    if (language === 'en' || language === 'tr') return language;
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
