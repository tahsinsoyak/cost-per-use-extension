import { readStructuredProduct } from '../shared/lib/structuredProduct';
import { parsePriceAndCurrency } from '../shared/lib/priceParser';

interface ScraperRule {
  domains: string[];
  titleSelector: string;
  priceSelector: string;
}

const SITE_RULES: ScraperRule[] = [
  {
    domains: ['amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.es', 'amazon.it', 'amazon.com.tr', 'amazon.ca', 'amazon.com.au', 'amazon.co.jp', 'amazon.in', 'amazon.com.br', 'amazon.com.mx'],
    titleSelector: '#productTitle',
    priceSelector: '#price_inside_buybox, .apexPriceToPay .a-offscreen, .a-price .a-offscreen, #priceblock_ourprice, #priceblock_dealprice, .a-price .a-color-base, #price_inside_buybox_mobile'
  },
  {
    domains: ['trendyol.com'],
    titleSelector: '[data-testid="product-title"], h1.product-title, .pr-new-br, .pr-in-cn, h1.pr-new-br-bd',
    priceSelector: '.price-container .discounted, [data-testid="normal-price"] .discounted, [data-testid="normal-price"], .prc-dsc, .prc-slg, .prc-slg-sb, .discounted, .price-container, .price-wrapper'
  },
  {
    domains: ['hepsiburada.com'],
    titleSelector: 'header.title-wrapper h1, #product-name',
    priceSelector: '[data-test-id="price-current-price"], .extra-discount-price, #offering-price'
  },
  {
    domains: ['ebay.com', 'ebay.co.uk', 'ebay.de', 'ebay.ca', 'ebay.com.au'],
    titleSelector: '.x-item-title__mainTitle, #itemTitle',
    priceSelector: '.x-price-primary, #prcIsum'
  }
];

export function scrapeProductDetails() {
  const hostname = window.location.hostname;
  const structured = readStructuredProduct(Array.from(document.querySelectorAll('script[type="application/ld+json"]'), script => script.textContent || ''), window.location.href);
  let title = structured?.productName || '';
  let structuredPrice = false;
  let priceText = '';
  let currencyHint: string | null = null;

  // 1. Try site-specific selectors
  const rule = SITE_RULES.find(r => r.domains.some(d => (hostname === d || hostname.endsWith('.' + d))));
  if (rule) {
    const titleEl = document.querySelector(rule.titleSelector);
    if (titleEl) {
      title = (titleEl as HTMLElement).innerText || titleEl.textContent || '';
    }

    const priceEl = rule.priceSelector.split(',').map(selector => document.querySelector(selector.trim())).find(element => element?.textContent?.trim());
    if (priceEl) {
      priceText = (priceEl as HTMLElement).innerText || priceEl.textContent || '';
    }
  }

  if (!priceText.trim() && structured?.price) {
    priceText = structured.price;
    currencyHint = structured.currencyHint;
    structuredPrice = true;
  }

  // 2. Generic fallback for title/product name
  if (!title.trim()) {
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                    document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    const h1 = document.querySelector('h1')?.innerText;
    title = ogTitle || h1 || document.title || '';
  }

  // 3. Generic fallback for price
  if (!priceText.trim() && !structured) {
    // Try meta tags
    const ogPrice = document.querySelector('meta[property="product:price:amount"]')?.getAttribute('content') ||
                    document.querySelector('meta[property="og:price:amount"]')?.getAttribute('content');

    // Try schema itemprop
    const products = document.querySelectorAll('[itemscope][itemtype$="/Product"]');
    const product = products.length === 1 ? products[0] : null;
    const prices = product?.querySelectorAll('[itemprop="price"]');
    const priceElement = prices?.length === 1 ? prices[0] : null;
    const itempropPrice = priceElement?.getAttribute('content') || priceElement?.textContent;
    currencyHint = product?.querySelector('[itemprop="priceCurrency"]')?.getAttribute('content') ||
                   product?.querySelector('[itemprop="priceCurrency"]')?.textContent || null;

    // Try common price selectors
    priceText = ogPrice || itempropPrice || '';
  }

  // 4. Extract currency hints
  const ogCurrency = document.querySelector('meta[property="product:price:currency"]')?.getAttribute('content') ||
                     document.querySelector('meta[property="og:price:currency"]')?.getAttribute('content');
  if (ogCurrency && !structuredPrice) {
    currencyHint = ogCurrency;
  }

  // Clean title
  title = title.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
  if (title.length > 100) {
    title = title.substring(0, 97) + '...';
  }

  // Parse price text
  const parsed = parsePriceAndCurrency(priceText, currencyHint);

  return {
    productName: title,
    price: structuredPrice ? priceText : (Number.isFinite(Number(parsed.price)) && Number(parsed.price) > 0 ? parsed.price : ''),
    currency: parsed.currency,
    customCurrencySymbol: parsed.customSymbol
  };
}
