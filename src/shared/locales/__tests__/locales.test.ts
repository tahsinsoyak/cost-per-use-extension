import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  getLanguageConfig,
  languageCodes,
  languages,
  resolveLanguage,
  translate,
} from '..';

describe('locale catalog', () => {
  it('keeps every supported language registered exactly once', () => {
    expect(languages.map(({ code }) => code)).toEqual(languageCodes);
    expect(new Set(languageCodes).size).toBe(languageCodes.length);
  });

  it.each([
    ['tr-TR', 'tr'],
    ['pt', 'pt-BR'],
    ['pt_BR', 'pt-BR'],
    ['zh-TW', 'zh-CN'],
    ['de-AT', 'de'],
    ['unsupported', 'en'],
    [undefined, 'en'],
  ] as const)('resolves browser locale %s to %s', (browserLocale, expected) => {
    expect(resolveLanguage(browserLocale)).toBe(expected);
  });

  it('provides direction and date formatting metadata', () => {
    expect(getLanguageConfig('ar').direction).toBe('rtl');
    expect(getLanguageConfig('ja').dateLocale).toBe('ja-JP');
  });
});

describe('translations', () => {
  it.each(languageCodes)('provides localized core copy for %s', (language) => {
    expect(translate('common.appName', language)).not.toBe('common.appName');
    expect(translate('calculator.btnCalculate', language)).not.toBe('calculator.btnCalculate');
  });

  it('uses the canonical English copy for untranslated advanced fields', () => {
    expect(translate('calculator.paymentsHelp', 'es')).toBe(
      "If paying in installments, enter the total you'll pay (including interest). Leave blank if paying upfront.",
    );
  });

  it('returns an unknown key unchanged', () => {
    expect(translate('missing.translation', 'fr')).toBe('missing.translation');
  });
});

describe('Chrome Web Store localization assets', () => {
  it.each(languages)('keeps the $englishName package metadata and listing copy aligned', (language) => {
    const messagesPath = resolve(
      process.cwd(),
      'public',
      '_locales',
      language.chromeLocale,
      'messages.json',
    );
    const listingPath = resolve(
      process.cwd(),
      'docs',
      'chrome-web-store',
      'listings',
      `${language.code}.md`,
    );
    const messages = JSON.parse(readFileSync(messagesPath, 'utf8')) as {
      extName: { message: string };
      extDescription: { message: string };
    };
    const listing = readFileSync(listingPath, 'utf8');

    expect(messages.extName.message.length).toBeGreaterThan(0);
    expect(messages.extName.message.length).toBeLessThanOrEqual(75);
    expect(messages.extDescription.message.length).toBeGreaterThan(0);
    expect(messages.extDescription.message.length).toBeLessThanOrEqual(132);
    expect(listing).toContain(`\`${messages.extName.message}\``);
    expect(listing).toContain(`\`${messages.extDescription.message}\``);
  });
});
