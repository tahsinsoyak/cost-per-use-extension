# Changelog

All notable user-facing changes to Cost Per Use are recorded here.

## [1.2.0] - 2026-11-14

### Added

- Read Schema.org Product and ProductGroup JSON-LD, including linked offers and variants identified by the current page URL, for broader compatibility with stores that expose standard product data (including Shopify storefronts).
- Keyword-optimized store summaries highlighting cost-per-wear calculation, comparison, and impulse-buy prevention.
- Added repository discovery topics and updated GitHub homepage link.
- Product-reader fixtures and regression checks for structured data and autofill behavior.

### Fixed

- Preserve existing inputs during automatic reads and preserve missing fields during manual autofill.
- Avoid selecting arbitrary JSON-LD product prices or ranges; limit generic microdata extraction to a single product and price.
- Explain partial title-only results in all ten languages.

## [1.1.0] - 2026-09-16

### Added

- An optional personal cost-per-use target that shows the minimum whole uses required and compares it with estimated usage, with translations in all ten languages.
- A localized usage scenario card comparing expected cost per use with half as much use, keeping ownership duration and total costs fixed.

### Fixed

- Validate installment pairs, finite amounts, nonnegative costs, and practical usage totals; use the financed total for resale validation.
- Validate and recompute imported calculations while preserving valid record IDs and dates.
- Restore saved financing and hourly-wage inputs, and connect form controls to labels and errors.
- Replaced price-independent value judgments with neutral estimated-use bands in results and both history views, including saved and imported calculations.
- Localized usage labels and explanations in all ten languages and removed success/warning colors from usage badges.

## [1.0.2] - 2026-07-18

### Added

- A localized, one-time "What's new" dialog shown on the first popup open after each version update.
- Direct links from the update dialog to full release notes and voluntary Patreon support.

### Fixed

- Replaced conflicting and viewport-dependent popup dimensions with a Chrome-safe 400x600 document.
- Prevented calculator controls, currency selection, results, comparison cards, and action buttons from being clipped.
- Kept the header, navigation, scrollable content, and support footer inside the popup viewport.
- Improved narrow-layout behavior for long translated labels and right-to-left Arabic content.

## [1.0.1] - 2026-07-18

### Added

- Internationalization for 10 languages: English, Turkish, Spanish, German, French, Portuguese (Brazil), Russian, Arabic (RTL), Japanese, and Chinese (Simplified).
- Redesigned popup layout for enhanced contrast and readability.

## [1.0.0] - 2026-06-03

- Initial release with cost-per-use calculation, installment adjustments, side-by-side comparison, and local history.
