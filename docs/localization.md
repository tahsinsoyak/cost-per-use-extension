# Localization

English is the canonical source locale. Every other language is created by merging translated values over the complete English message tree, so a missing translation always has readable English copy.

## Supported languages

- English (`en`)
- Turkish (`tr`)
- Spanish (`es`)
- German (`de`)
- French (`fr`)
- Brazilian Portuguese (`pt-BR`)
- Russian (`ru`)
- Arabic (`ar`, right-to-left)
- Japanese (`ja`)
- Simplified Chinese (`zh-CN`)

Chrome Web Store metadata uses matching folders in `public/_locales`. The in-extension interface uses the catalog in `src/shared/locales/catalog.ts`.

## Add another language

1. Add the language code and metadata to `src/shared/locales/catalog.ts`.
2. Create a locale file with `createLocale({ ... })`, translating from `src/shared/locales/en.ts`.
3. Register that locale in `src/shared/locales/index.ts`.
4. Add `public/_locales/<chrome_locale>/messages.json` for the localized extension name and description.
5. Add the language to the locale tests and run `npm test` and `npm run build`.

New interface text must be added to English first. Other locale files may then override it independently without breaking the extension.
