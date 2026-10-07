import {expect, it} from 'vitest';
import {readStructuredProduct} from '../structuredProduct';
const url = 'https://shop.example/products/shoes';
const offer = (price: unknown = '129.95', currency = 'EUR') => ({'@type': 'Offer', price, priceCurrency: currency});
const product = (offers: unknown = offer()) => ({'@type': 'Product', name: 'Walking shoes', offers});
const read = (value: unknown, page = url) => readStructuredProduct([JSON.stringify(value)], page);

it('reads a product without a store-specific rule', () => {
  expect(read(product())).toEqual({productName: 'Walking shoes', price: '129.95', currencyHint: 'EUR'});
});
it('reads graphs, type arrays and linked offers', () => {
  expect(read({'@graph': [{...product({'@id':'#offer'}), '@type':['Thing','https://schema.org/Product']}, {...offer(42, 'CAD'), '@id':'#offer'}]})?.price).toBe('42');
});
it('skips malformed blocks and never evaluates code', () => {
  expect(readStructuredProduct(['{bad', 'alert(1)', JSON.stringify(product())], url)?.price).toBe('129.95');
});
it('resolves an offer defined before its reference', () => {
  expect(read({'@graph':[{...offer(42),'@id':'#offer'}, product({'@id':'#offer'})]})?.price).toBe('42');
});
it('selects the product matching the page, not an unrelated recommendation', () => {
  expect(read([{...product(offer(5)),url:'/other'}, {...product(offer(80)),url}])?.price).toBe('80');
});
it('does not pick an arbitrary product on listing pages', () => {
  expect(read([product(), product(offer(8))])?.price).toBe('');
  expect(read({'@type':'ItemList',itemListElement:[product()]})).toBeNull();
});
it('selects the exact Shopify-style variant URL', () => {
  expect(read({'@type':'ProductGroup',name:'Shoes',url,hasVariant:[
    {...product(offer(100)),url:url+'?variant=1'}, {...product(offer(120)),url:url+'?variant=2'},
  ]},url+'?variant=2')?.price).toBe('120');
});
it('selects an exact offer URL when several prices exist', () => {
  expect(read(product([{...offer(100),url:url+'?variant=1'}, {...offer(120),url:url+'?variant=2'}]),url+'?variant=2')?.price).toBe('120');
});
it.each([
  [{'@type':'AggregateOffer',lowPrice:10,highPrice:20,priceCurrency:'USD'}],
  [offer(10),offer(20)], [offer(10,'USD'),offer(10,'CAD')], [offer(-1)],
  [offer('10 - 20')], [offer('Infinity')], [offer(0)], [offer(10,'')],
].map(offers => [offers]))('leaves ambiguous or invalid prices empty: %j', offers => {
  expect(read(product(offers))?.price).toBe('');
});
it('accepts repeated offers only if price and currency agree', () => {
  expect(read(product([offer(10),offer(10)]))?.price).toBe('10');
});
it('preserves decimal precision in machine-readable prices', () => {
  expect(read(product(offer('1.234','KWD')))?.price).toBe('1.234');
});
