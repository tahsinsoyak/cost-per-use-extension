# Permission justifications

## `storage`

Stores the user's settings, calculator inputs, saved calculations, and comparison list locally in `chrome.storage.local`. The extension has no server and does not transmit this data.

## `activeTab`

Provides temporary access to the tab where the user opens the extension. If the user has enabled auto-fill, the extension reads only that page's product title, displayed price, currency hint, and URL hostname to fill the calculator locally.

## `scripting`

Injects the extension's packaged `assets/content.js` scraper into the active tab only after the user opens the toolbar popup and auto-fill is enabled. It does not inject code globally or download remote code.

## Remote code

Select: `No, I am not using remote code.`

All executable JavaScript is bundled inside the uploaded extension ZIP. The extension does not download or execute remote scripts, WebAssembly, or string-evaluated code.
