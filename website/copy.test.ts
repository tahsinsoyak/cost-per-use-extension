import { describe, expect, it } from 'vitest';
import { copy } from './copy';
import { siteLanguages } from './language';
import { productExamples, productName } from './examples';

function strings(value: unknown, path = ''): Record<string, string> {
  if (typeof value === 'string') return {[path]: value};
  return Object.assign({}, ...Object.entries(value as object).map(([key, child]) => strings(child, `${path}.${key}`)));
}

describe('complete website translations', () => {
  const reference = strings(copy.en);
  it.each(siteLanguages)('$label covers all strings, arrays, and interpolation tokens', ({code}) => {
    const translated = strings(copy[code]);
    expect(Object.keys(translated).sort()).toEqual(Object.keys(reference).sort());
    for (const [key, value] of Object.entries(translated)) {
      expect(value.trim(), `${code}${key}`).not.toBe('');
      expect(value, `${code}${key}`).not.toContain('\uFFFD');
      expect(value.match(/\{\w+\}/g) ?? [], `${code}${key}`).toEqual(reference[key].match(/\{\w+\}/g) ?? []);
    }
    expect(copy[code].examples).toEqual([1,2,0].map(index => productName(productExamples[index], code)));
    expect(new Set(copy[code].ui.products).size).toBe(productExamples.length);
  });
});
