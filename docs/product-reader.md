# Product autofill: next release

These changes are unreleased. The submitted 1.1.0 ZIP has not been replaced. Source and unpacked development builds contain the changes; assign a new version before packaging the next Store update.

## Coverage

- Existing store rules: Amazon's listed regional domains, Trendyol, Hepsiburada, and eBay's listed regional domains.
- New general support: Schema.org Product JSON-LD and ProductGroup variants, graph-linked offers, single-product microdata, and product price metadata. This can work on compatible Shopify and other storefronts without adding a rule for every domain.
- A selected variant can be identified by an exact page URL match. Ambiguous JSON-LD prices, unrelated products, and aggregate price ranges do not supply a guessed price. Some variant configurations still require manual entry.

These are format-level capabilities, not a guarantee that every store or product page works. Browser fixtures cover representative markup; live retailer pages have not been certified. Standard data can also be stale, so users should compare the extracted amount with the selected product's displayed price.

## Behavior and privacy

Automatic reads fill empty fields and preserve typed or restored values. The explicit autofill button refreshes detected fields, while keeping fields whose values were not found. A title without an exact price produces an informational message instead of success.

Extraction runs locally on the active page with the existing optional autofill setting and temporary activeTab permission. No new permissions, network requests, accounts, or external services are added. JSON-LD is parsed as data, never executed. The current page URL is compared locally with product/offer URLs to select a variant; these URLs are not saved or transmitted.

## Verification

Run `npm test`, `npm run build`, then `npm run scraper:check`. The scraper check runs the built content script against local, intercepted browser fixtures. `node scripts/check_extension_release.mjs` additionally checks actual toolbar autofill and temporary activeTab access in an isolated browser profile.

To request a store-specific improvement, provide a public product URL, the expected selected product/price/currency, and what autofill returned. Do not include account or checkout information.

References: [Schema.org Product](https://schema.org/Product), [Offer](https://schema.org/Offer), and [Shopify structured data](https://shopify.dev/docs/api/liquid/filters/structured_data).
