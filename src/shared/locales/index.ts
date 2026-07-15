import { ar } from './ar';
import { Language } from './catalog';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { ja } from './ja';
import { LocaleMessages } from './createLocale';
import { ptBR } from './ptBR';
import { ru } from './ru';
import { tr } from './tr';
import { zhCN } from './zhCN';

export {
  applyDocumentLanguage,
  getLanguageConfig,
  languageCodes,
  languages,
  resolveLanguage,
} from './catalog';
export type { Language, LanguageConfig } from './catalog';

const translations: Record<Language, LocaleMessages> = {
  en,
  tr,
  es,
  de,
  fr,
  'pt-BR': ptBR,
  ru,
  ar,
  ja,
  'zh-CN': zhCN,
};

function resolveKey(messages: LocaleMessages, path: readonly string[]): unknown {
  let value: unknown = messages;

  for (const segment of path) {
    if (!value || typeof value !== 'object' || !(segment in value)) return undefined;
    value = (value as Record<string, unknown>)[segment];
  }

  return value;
}

/** Resolves a locale key and always falls back to the canonical English copy. */
export function translate(key: string, language: Language = 'en'): string {
  const path = key.split('.');
  const localized = resolveKey(translations[language], path);
  if (typeof localized === 'string') return localized;

  const fallback = resolveKey(en, path);
  return typeof fallback === 'string' ? fallback : key;
}
