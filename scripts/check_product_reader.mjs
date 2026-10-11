import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';

// Local fixtures at intercepted URLs: no requests are sent to these stores.
const script = await readFile('dist/assets/content.js', 'utf8');
const json = data => `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
const product = { '@type':'Product', name:'Walking shoes', offers:{'@type':'Offer',price:'129.95',priceCurrency:'CAD'} };
const fixtures = [
  {name:'JSON-LD store',url:'https://shop.example/product',html:json(product),price:'129.95',currency:'CUSTOM'},
  {name:'malformed block fallback',url:'https://shop.example/product',html:'<script type="application/ld+json">{broken</script>'+json(product),price:'129.95'},
  {name:'ambiguous offers',url:'https://shop.example/product',html:json({...product,offers:[product.offers,{...product.offers,price:200}]})+'<span class="price">5</span>',price:''},
  {name:'product microdata',url:'https://shop.example/product',html:'<div itemscope itemtype="https://schema.org/Product"><h1>Shoes</h1><meta itemprop="price" content="80"><meta itemprop="priceCurrency" content="GBP"></div>',price:'80',currency:'GBP'},
  {name:'unrelated listing prices',url:'https://shop.example/list',html:'<h1>Category</h1><span class="price">50</span><span class="price">90</span>',price:''},
  {name:'metadata',url:'https://shop.example/product',html:'<meta property="product:price:amount" content="200"><meta property="product:price:currency" content="USD">',price:'200'},
  {name:'Amazon selected price priority',url:'https://www.amazon.com.tr/product',html:'<h1 id="productTitle">Shoes</h1><span class="a-price"><span class="a-offscreen">300 TL</span></span><span class="apexPriceToPay"><span class="a-offscreen">200 TL</span></span>',price:'200',currency:'TRY'},
  {name:'Trendyol',url:'https://www.trendyol.com/product',html:'<h1 data-testid="product-title">Shoes</h1><span class="prc-dsc">200 TL</span>',price:'200'},
  {name:'Hepsiburada',url:'https://www.hepsiburada.com/product',html:'<h1 id="product-name">Shoes</h1><span data-test-id="price-current-price">200 TL</span>',price:'200'},
  {name:'eBay',url:'https://www.ebay.de/item',html:'<h1 class="x-item-title__mainTitle">Shoes</h1><span class="x-price-primary">200 EUR</span>',price:'200',currency:'EUR'},
  {name:'domain boundary',url:'https://amazon.com.other.example/product',html:'<h1 id="productTitle">Shoes</h1><span id="price_inside_buybox">200 USD</span>',price:''},
];
const browser = await chromium.launch();
try {
  for (const fixture of fixtures) {
    const page = await browser.newPage();
    await page.route('**/*', route => route.fulfill({contentType:'text/html',body:fixture.html}));
    await page.goto(fixture.url);
    await page.evaluate(() => {
      window.chrome = {runtime:{onMessage:{addListener:listener => {window.readerListener = listener;}}}};
    });
    await page.addScriptTag({content:script});
    const result = await page.evaluate(() => new Promise(resolve => window.readerListener({action:'scrapeProduct'}, {}, resolve)));
    assert.equal(result.price, fixture.price, fixture.name);
    if (fixture.currency) assert.equal(result.currency, fixture.currency, fixture.name);
    await page.close();
  }
  console.log(`Product reader: ${fixtures.length} browser fixtures passed (not live-store certification).`);
} finally { await browser.close(); }
