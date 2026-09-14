import { afterEach, expect, it, vi } from 'vitest';
import { initialLanguage, rememberLanguage } from './language';

afterEach(() => { vi.unstubAllGlobals(); });

function browser(languages: string[], saved: string | null = null) {
  vi.stubGlobal('navigator', { languages, language: languages[0] });
  const storage = { getItem: vi.fn(() => saved), setItem: vi.fn() };
  vi.stubGlobal('localStorage', storage);
  return storage;
}

it.each([
  [['tr-TR'], 'tr'],
  [['en-GB', 'tr'], 'en'],
  [['de-DE', 'TR-tr', 'en'], 'tr'],
  [['fr-FR'], 'en'],
  [[], 'en'],
])('selects the first supported browser preference from %j', (languages, expected) => {
  browser(languages as string[]);
  expect(initialLanguage()).toBe(expected);
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
