import { parsePriceAndCurrency } from '../shared/lib/priceParser';

interface ScraperRule {
  domains: string[];
  titleSelector: string;
  priceSelector: string;
}

const SITE_RULES: ScraperRule[] = [
  {
    domains: ['amazon.'],
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

function scrapeProductDetails() {
  const hostname = window.location.hostname;
  let title = '';
  let priceText = '';
  let currencyHint: string | null = null;

  // 1. Try site-specific selectors
  const rule = SITE_RULES.find(r => r.domains.some(d => hostname.includes(d)));
  if (rule) {
    const titleEl = document.querySelector(rule.titleSelector);
    if (titleEl) {
      title = (titleEl as HTMLElement).innerText || titleEl.textContent || '';
    }

    const priceEl = document.querySelector(rule.priceSelector);
    if (priceEl) {
      priceText = (priceEl as HTMLElement).innerText || priceEl.textContent || '';
    }
  }

  // 2. Generic fallback for title/product name
  if (!title.trim()) {
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                    document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    const h1 = document.querySelector('h1')?.innerText;
    title = ogTitle || h1 || document.title || '';
  }

  // 3. Generic fallback for price
  if (!priceText.trim()) {
    // Try meta tags
    const ogPrice = document.querySelector('meta[property="product:price:amount"]')?.getAttribute('content') ||
                    document.querySelector('meta[property="og:price:amount"]')?.getAttribute('content');
    
    // Try schema itemprop
    const itempropPrice = document.querySelector('[itemprop="price"]')?.getAttribute('content') ||
                          document.querySelector('[itemprop="price"]')?.textContent;
    
    // Try common price selectors
    const genericPriceEl = document.querySelector('.price, .product-price, [class*="price-current" i], [class*="product__price" i]');
    const genericPrice = genericPriceEl ? (genericPriceEl as HTMLElement).innerText || genericPriceEl.textContent : '';

    priceText = ogPrice || itempropPrice || genericPrice || '';
  }

  // 4. Extract currency hints
  const ogCurrency = document.querySelector('meta[property="product:price:currency"]')?.getAttribute('content') ||
                     document.querySelector('meta[property="og:price:currency"]')?.getAttribute('content') ||
                     document.querySelector('[itemprop="priceCurrency"]')?.getAttribute('content');
  if (ogCurrency) {
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
    price: parsed.price,
    currency: parsed.currency,
    customCurrencySymbol: parsed.customSymbol
  };
}

if (!(window as any).__costPerUseScraperInitialized) {
  (window as any).__costPerUseScraperInitialized = true;

  // Listen for messages from the extension popup
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'scrapeProduct') {
      try {
        const result = scrapeProductDetails();
        sendResponse(result);
      } catch (error) {
        console.error('Cost Per Use scraper error:', error);
        sendResponse(null);
      }
      return true; // Keep message port open for asynchronous response
    }
    return false;
  });
}
