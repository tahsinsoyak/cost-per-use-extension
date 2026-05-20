import { Currency } from '../types/calculation';

export function getCurrencySymbol(currency: Currency, customCurrencySymbol?: string): string {
  switch (currency) {
    case 'TRY':
      return '₺';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'CUSTOM':
      return customCurrencySymbol || '¤';
    default:
      return '';
  }
}

export function formatCurrency(
  value: number,
  currency: Currency,
  customCurrencySymbol?: string,
  compact = false
): string {
  const symbol = getCurrencySymbol(currency, customCurrencySymbol);
  
  let formattedNumber: string;
  
  if (compact && value >= 1000) {
    if (value >= 1000000) {
      formattedNumber = (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else {
      formattedNumber = (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
  } else {
    // If number is very small (like cost per use), show decimals.
    // If it's a large whole number, omit decimals.
    const isWhole = value % 1 === 0;
    const decimals = isWhole && value >= 100 ? 0 : 2;
    
    formattedNumber = value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: 2,
    });
  }

  // Standard placement: Symbol first (e.g. ₺4,000, $120)
  return `${symbol}${formattedNumber}`;
}
