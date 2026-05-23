import { Currency } from '../types/calculation';

/**
 * Parses a price string to extract the numerical value and identify the currency.
 * Handles diverse locales (e.g., dot as thousand separator vs. dot as decimal).
 */
export function parsePriceAndCurrency(
  priceStr: string,
  currencyHint?: string | null
): { price: string; currency: Currency; customSymbol?: string } {
  // Strip HTML tags and normalize whitespace
  let cleanPriceStr = priceStr
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If there are no digits at all, it's invalid
  if (!/\d/.test(cleanPriceStr)) {
    return { price: '', currency: 'USD', customSymbol: undefined };
  }

  let currency: Currency = 'USD';
  let customSymbol = '';

  const hint = currencyHint?.toUpperCase().trim();
  if (hint === 'TRY' || hint === 'TL') {
    currency = 'TRY';
  } else if (hint === 'USD') {
    currency = 'USD';
  } else if (hint === 'EUR') {
    currency = 'EUR';
  } else if (hint === 'GBP') {
    currency = 'GBP';
  } else if (hint) {
    currency = 'CUSTOM';
    customSymbol = hint;
  } else {
    // Detect currency from symbols/keywords in the string
    if (
      cleanPriceStr.includes('₺') ||
      cleanPriceStr.toUpperCase().includes('TL') ||
      cleanPriceStr.toUpperCase().includes('TRY')
    ) {
      currency = 'TRY';
    } else if (
      cleanPriceStr.includes('$') ||
      cleanPriceStr.toUpperCase().includes('USD')
    ) {
      currency = 'USD';
    } else if (
      cleanPriceStr.includes('€') ||
      cleanPriceStr.toUpperCase().includes('EUR')
    ) {
      currency = 'EUR';
    } else if (
      cleanPriceStr.includes('£') ||
      cleanPriceStr.toUpperCase().includes('GBP')
    ) {
      currency = 'GBP';
    } else {
      // Try to find any custom currency symbol (excluding standard letters/spaces/punctuation)
      const matches = cleanPriceStr.match(/[^\w\s.,\-+]/gu);
      if (matches && matches.length > 0) {
        currency = 'CUSTOM';
        customSymbol = matches[0];
      }
    }
  }

  // Extract digits, dots, and commas
  let cleanDigits = cleanPriceStr.replace(/[^\d.,\-+]/g, '').trim();
  if (!cleanDigits) {
    return {
      price: '',
      currency,
      customSymbol: currency === 'CUSTOM' ? (customSymbol || hint || '') : undefined,
    };
  }

  const lastDot = cleanDigits.lastIndexOf('.');
  const lastComma = cleanDigits.lastIndexOf(',');

  let finalPrice = '';

  if (lastDot !== -1 && lastComma !== -1) {
    // Both separators are present. The last one is the decimal separator.
    if (lastComma > lastDot) {
      // Comma is decimal separator (e.g. 1.249,00)
      finalPrice = cleanDigits.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // Dot is decimal separator (e.g. 1,249.00)
      finalPrice = cleanDigits.replace(/,/g, '');
    }
  } else if (lastComma !== -1) {
    // Only comma is present (e.g. 99,90 or 15,000 or 12,5)
    const digitsAfterComma = cleanDigits.length - 1 - lastComma;
    
    if (digitsAfterComma === 3) {
      // If exactly 3 digits follow a sole comma, it is most likely a thousand separator (e.g. 15,000)
      finalPrice = cleanDigits.replace(/,/g, '');
    } else {
      // E.g. 99,90 or 12,5 -> comma is decimal
      finalPrice = cleanDigits.replace(/,/g, '.');
    }
  } else if (lastDot !== -1) {
    // Only dot is present (e.g. 99.90 or 15.000 or 12.5)
    const digitsAfterDot = cleanDigits.length - 1 - lastDot;
    
    if (digitsAfterDot === 3) {
      // If exactly 3 digits follow a sole dot, it is most likely a thousand separator (e.g. 15.000)
      finalPrice = cleanDigits.replace(/\./g, '');
    } else {
      // E.g. 99.90 or 12.5 -> dot is decimal
      finalPrice = cleanDigits;
    }
  } else {
    // No separators present
    finalPrice = cleanDigits;
  }

  const num = parseFloat(finalPrice);
  return {
    price: isNaN(num) ? '' : num.toString(),
    currency,
    customSymbol: currency === 'CUSTOM' ? (customSymbol || hint || '') : undefined,
  };
}
