import en from './locales/en.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';
import zhCN from './locales/zh-CN.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ptBR from './locales/pt-BR.json';
import ru from './locales/ru.json';
import es from './locales/es.json';
import type { SiteLanguage } from './language';

export type SiteCopy = typeof en;
export const copy: Record<SiteLanguage, SiteCopy> = {
  'en': en,
  'tr': tr,
  'ar': ar,
  'zh-CN': zhCN,
  'fr': fr,
  'de': de,
  'ja': ja,
  'pt-BR': ptBR,
  'ru': ru,
  'es': es,
};
