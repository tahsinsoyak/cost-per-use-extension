type Node = Record<string, unknown>;
export interface StructuredProduct {
  productName: string;
  price: string;
  currencyHint: string;
}
const object = (value: unknown): value is Node => !!value && typeof value === 'object' && !Array.isArray(value);
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : value === undefined ? [] : [value];
const typeIs = (node: Node, type: string) => list(node['@type']).some(value => typeof value === 'string' && value.split(/[/#]/).pop() === type);
const string = (value: unknown) => typeof value === 'string' ? value.trim() : '';

/** Reads data only. Never executes scripts or fetches linked resources. */
export function readStructuredProduct(scripts: string[], pageUrl: string): StructuredProduct | null {
  const nodes: Node[] = [];
  const visit = (value: unknown, depth = 0) => {
    if (depth > 12 || nodes.length >= 2000) return;
    if (Array.isArray(value)) { value.slice(0, 200).forEach(item => visit(item, depth + 1)); return; }
    if (!object(value)) return;
    nodes.push(value);
    // Do not treat recommendation/list items as the main product.
    for (const key of ['@graph', 'mainEntity', 'hasVariant', 'offers']) visit(value[key], depth + 1);
  };
  for (const script of scripts.slice(0, 20)) {
    if (script.length > 1_000_000) continue;
    try { visit(JSON.parse(script)); } catch { /* Other valid blocks may still describe the product. */ }
  }
  const refs = new Map(nodes.filter(n => typeof n['@id'] === 'string' && Object.keys(n).length > 1).map(n => [n['@id'], n]));
  const resolve = (value: unknown): Node | undefined => object(value) ? (Object.keys(value).length === 1 ? refs.get(value['@id']) ?? value : value) : undefined;
  const normalizedUrl = (value: unknown) => {
    if (!string(value)) return '';
    try { const url = new URL(string(value), pageUrl); url.hash = ''; return url.href; } catch { return ''; }
  };
  const matches = (node: Node) => [node.url, node['@id']].some(url => normalizedUrl(url) === normalizedUrl(pageUrl));
  const products = nodes.filter(node => typeIs(node, 'Product') || typeIs(node, 'ProductGroup'));
  const matched = products.filter(matches);
  const candidates = matched.length ? matched : products;
  // Multiple unrelated products or variants need an explicit selection.
  if (candidates.length !== 1) return products.length ? {productName: '', price: '', currencyHint: ''} : null;
  const product = candidates[0];
  const result = {productName: string(product.name), price: '', currencyHint: ''};
  let offers = list(product.offers).map(resolve).filter((n): n is Node => !!n);
  const matchedOffers = offers.filter(matches);
  if (matchedOffers.length) offers = matchedOffers;
  const prices = offers.map(offer => {
    // Ranges and aggregate offers are not an exact selected product price.
    if (typeIs(offer, 'AggregateOffer') || offer.lowPrice !== undefined || offer.highPrice !== undefined) return null;
    const price = typeof offer.price === 'number' ? offer.price : /^\d+(\.\d+)?$/.test(string(offer.price)) ? Number(offer.price) : NaN;
    const currency = string(offer.priceCurrency).toUpperCase();
    return Number.isFinite(price) && price > 0 && /^[A-Z]{3}$/.test(currency) ? {price: String(price), currency} : null;
  });
  if (!prices.length || prices.some(price => !price)) return result;
  const unique = new Map(prices.filter((p): p is NonNullable<typeof p> => !!p).map(p => [`${p.price}:${p.currency}`, p]));
  if (unique.size !== 1) return result;
  const price = [...unique.values()][0];
  return {...result, price: price.price, currencyHint: price.currency};
}
