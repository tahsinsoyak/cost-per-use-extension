import { en } from './en';
import { tr } from './tr';

export type Language = 'en' | 'tr';

const translations: Record<Language, any> = { en, tr };

/**
 * Resolves a nested localization key in the specified language.
 * Falls back to English if the key is missing in the target language.
 * E.g., translate('calculator.errors.priceRequired', 'tr')
 */
export function translate(key: string, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value = translations[lang] || translations['en'];

  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      // Fallback path using English
      let fb = translations['en'];
      for (const fbk of keys) {
        fb = fb?.[fbk];
      }
      return typeof fb === 'string' ? fb : key;
    }
  }

  return typeof value === 'string' ? value : key;
}
