# Cost Per Use website

The public-facing website source lives beside the extension and imports its calculation, usage-scenario, and cost-target functions. The extension build is unchanged; website output goes to `build/`.

- `npm run web:dev`: local development on port 4180.
- `npm run web:build`: typecheck and build the website.
- `npm test`: includes website input validation and calculation tests.

The initial design includes English and Turkish, editable example purchases, net-cost adjustments, usage scenarios, optional targets, extension links, and an FAQ. Inputs stay in memory and reset when the page reloads. Site hosting may process ordinary web requests; calculator inputs are not transmitted by this application.

An optional `set_purchase_estimate` WebMCP tool uses the same calculation and state as the UI. It is feature-detected and does not affect unsupported browsers. No supported WebMCP validation context was available during initial authoring, so this experimental integration has not been runtime-verified.

Sites preview access is private initially. Public launch and a custom domain are separate follow-up steps.
