import { describe, it, expect } from 'vitest';
import { parsePriceAndCurrency } from '../priceParser';

describe('parsePriceAndCurrency', () => {
  it('should parse Turkish Lira formats correctly', () => {
    expect(parsePriceAndCurrency('₺1.249,00')).toEqual({
      price: '1249',
      currency: 'TRY',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('1.249,50 TL')).toEqual({
      price: '1249.5',
      currency: 'TRY',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('₺ 150')).toEqual({
      price: '150',
      currency: 'TRY',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('150 TRY')).toEqual({
      price: '150',
      currency: 'TRY',
      customSymbol: undefined,
    });
  });

  it('should parse US Dollar formats correctly', () => {
    expect(parsePriceAndCurrency('$1,249.00')).toEqual({
      price: '1249',
      currency: 'USD',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('$45.99')).toEqual({
      price: '45.99',
      currency: 'USD',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('150.00 USD')).toEqual({
      price: '150',
      currency: 'USD',
      customSymbol: undefined,
    });
  });

  it('should parse Euro formats correctly', () => {
    expect(parsePriceAndCurrency('99,90 €')).toEqual({
      price: '99.9',
      currency: 'EUR',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('€ 99.90')).toEqual({
      price: '99.9',
      currency: 'EUR',
      customSymbol: undefined,
    });
  });

  it('should parse GBP formats correctly', () => {
    expect(parsePriceAndCurrency('£10.50')).toEqual({
      price: '10.5',
      currency: 'GBP',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('£ 1,000.00')).toEqual({
      price: '1000',
      currency: 'GBP',
      customSymbol: undefined,
    });
  });

  it('should handle custom currency hints', () => {
    expect(parsePriceAndCurrency('¥15,000', 'JPY')).toEqual({
      price: '15000',
      currency: 'CUSTOM',
      customSymbol: 'JPY',
    });
    expect(parsePriceAndCurrency('CHF 150.50', 'CHF')).toEqual({
      price: '150.5',
      currency: 'CUSTOM',
      customSymbol: 'CHF',
    });
  });

  it('should fall back to detecting custom symbol from the string', () => {
    expect(parsePriceAndCurrency('¥15.000')).toEqual({
      price: '15000',
      currency: 'CUSTOM',
      customSymbol: '¥',
    });
  });

  it('should handle clean numeric inputs gracefully', () => {
    expect(parsePriceAndCurrency('1250')).toEqual({
      price: '1250',
      currency: 'USD',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('12.5')).toEqual({
      price: '12.5',
      currency: 'USD',
      customSymbol: undefined,
    });
    expect(parsePriceAndCurrency('12,5')).toEqual({
      price: '12.5',
      currency: 'USD',
      customSymbol: undefined,
    });
  });

  it('should handle empty or invalid price strings', () => {
    expect(parsePriceAndCurrency('abc')).toEqual({
      price: '',
      currency: 'USD',
      customSymbol: undefined,
    });
  });
});
