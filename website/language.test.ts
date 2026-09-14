import { afterEach, expect, it, vi } from 'vitest';
import { initialLanguage, rememberLanguage, siteLanguages, yearUnit } from './language';

afterEach(() => { vi.unstubAllGlobals(); });

it('uses the appropriate year unit for the quantity and language', () => {
  expect(yearUnit('en', 1)).toBe('year');
  expect(yearUnit('en', 3)).toBe('years');
  expect(yearUnit('ru', 1)).toBe('год');
  expect(yearUnit('ru', 3)).toBe('года');
  expect(yearUnit('ru', 5)).toBe('лет');
});

function browser(languages: string[], saved: string | null = null) {
  vi.stubGlobal('navigator', { languages, language: languages[0] });
  const storage = { getItem: vi.fn(() => saved), setItem: vi.fn() };
  vi.stubGlobal('localStorage', storage);
  return storage;
}

it.each([
  [['tr-TR'], 'tr'],
  [['en-GB', 'tr'], 'en'],
  [['de-DE', 'TR-tr', 'en'], 'de'],
  [['fr-CA'], 'fr'],
  [['pt_PT'], 'pt-BR'],
  [['zh-Hans-SG'], 'zh-CN'],
  [['zh-TW', 'en'], 'en'],
  [['zh-Hant', 'ja'], 'ja'],
  [['it-IT', 'es-MX'], 'es'],
  [['ar-SA'], 'ar'],
  [['ru-RU'], 'ru'],
  [['it-IT'], 'en'],
  [[], 'en'],
])('selects the first supported browser preference from %j', (languages, expected) => {
  browser(languages as string[]);
  expect(initialLanguage()).toBe(expected);
});

it.each(siteLanguages)('detects and remembers $label', ({code,locale}) => {
  browser([locale]);
  expect(initialLanguage()).toBe(code);
  browser(['en'], code);
  expect(initialLanguage()).toBe(code);
});

it('keeps a manual choice ahead of browser preferences on the next visit', () => {
  const storage = browser(['tr-TR']);
  rememberLanguage('en');
  expect(storage.setItem).toHaveBeenCalledWith('cost-per-use.website.language', 'en');
  storage.getItem.mockReturnValue('en');
  expect(initialLanguage()).toBe('en');
});

it('ignores an unsupported saved value', () => {
  browser(['tr'], 'invalid');
  expect(initialLanguage()).toBe('tr');
});

it('supports detection and switching even when storage is blocked', () => {
  browser(['tr-TR']);
  vi.stubGlobal('localStorage', {
    getItem: () => { throw new Error('Blocked'); },
    setItem: () => { throw new Error('Blocked'); },
  });
  expect(initialLanguage()).toBe('tr');
  expect(() => rememberLanguage('en')).not.toThrow();
});
