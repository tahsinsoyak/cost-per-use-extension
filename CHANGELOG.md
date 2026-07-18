# Changelog

All notable user-facing changes to Cost Per Use are recorded here.

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

- Complete interface localization for English, Turkish, Spanish, German, French, Brazilian Portuguese, Russian, Arabic, Japanese, and Simplified Chinese.
- Automatic browser-language selection with English fallback and right-to-left layout for Arabic.
- Localized Chrome package titles and summaries plus matching detailed Store descriptions.
- Five production Store screenshots and refreshed small and marquee promotional tiles.
- Repeatable Store screenshot, promotional-asset, and package validation workflows.

### Changed

- Redesigned the calculator, result, comparison, history, and settings experiences.
- Improved typography, spacing, visual hierarchy, responsive behavior, and light/dark themes.
- Changed optional shopping-page auto-fill to run only after the user opens the extension and enables auto-fill.
- Updated the privacy policy, permission justifications, Store disclosures, and submission documentation.

### Privacy

- Removed the broad always-on content-script declaration.
- Kept all calculations, preferences, comparisons, and history on the user's device.
- Added no analytics, advertising, accounts, remote code, or cloud synchronization.

## [1.0.0] - 2026-06-03

- Initial public release.

[1.0.2]: https://github.com/tahsinsoyak/cost-per-use-extension/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/tahsinsoyak/cost-per-use-extension/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/tahsinsoyak/cost-per-use-extension/releases/tag/v1.0.0
