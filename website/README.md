# Cost Per Use website

The public-facing website source lives beside the extension and imports its calculation, usage-scenario, and cost-target functions. The extension build is unchanged; website output goes to `build/`.

- `npm run web:dev`: local development on port 4180.
- `npm run web:build`: typecheck and build the website.
- `npm test`: includes website input validation and calculation tests.

The website supports English, Arabic, Simplified Chinese, French, German, Japanese, Brazilian Portuguese, Russian, Spanish, and Turkish. This includes calculator validation, product examples, navigation, FAQ, and support content. Arabic uses a right-to-left layout; amounts and numbers follow the selected locale. Currency remains a separate choice: switching language does not convert a purchase or change its currency.

On first visit, the website selects the first supported browser language, falling back to English. Regional Portuguese preferences use Brazilian Portuguese. Traditional Chinese preferences are skipped because only Simplified Chinese is provided. A manual selection is remembered in local storage and takes priority on future visits. If storage is blocked, language switching still works for the current visit. Calculator inputs stay in memory and reset when the page reloads. Site hosting may process ordinary web requests; calculator inputs are not transmitted by this application.

Translations live in `website/locales/`. The shared type and translation tests check completeness and interpolation tokens. Built-in product names follow language changes; names entered by visitors are preserved. The extension preview image remains an English screenshot, with translated alternative text. The translations have not yet had native-speaker editorial review.

An optional `set_purchase_estimate` WebMCP tool uses the same calculation and state as the UI. It is feature-detected and does not affect unsupported browsers. No supported WebMCP validation context was available during initial authoring, so this experimental integration has not been runtime-verified.

## Publish on GitHub Pages

The website can be hosted publicly from this repository at
`https://tahsinsoyak.github.io/cost-per-use-extension/`.
No separate repository or application server is needed.

1. In the repository's **Settings > Pages > Build and deployment**, select **GitHub Actions** as the source (one-time setup).
2. Review locally with `npm run web:dev` and commit/push the reviewed changes to `main`.
3. The **Publish website to GitHub Pages** workflow starts automatically. You can also select **Run workflow** on `main` under Actions to republish manually.
4. After the deployment succeeds, open the URL shown by the `github-pages` environment.

Every push to `main` builds and publishes the website automatically. Pushes to other branches do not publish. A failed build prevents deployment. The workflow publishes only the generated `build/` directory; the extension has its own build and release process.

The workflow gets the site's base path from GitHub Pages and passes it to Vite, so scripts, fonts, and images work under the repository URL. It also supports a custom domain configured in Pages settings. To validate the repository path locally, run:

```sh
npm run web:build -- --base /cost-per-use-extension/
```

GitHub Pages serves this website publicly; visitors do not need a GitHub account. The calculator runs in their browser. See [GitHub's workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
