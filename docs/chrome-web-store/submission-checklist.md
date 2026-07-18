# Submission checklist

## Developer account

- Add and verify a monitored contact email.
- Choose trader or non-trader status based on the real legal/commercial context.
- Use truthful publisher identity and address information where Google requires it.
- Enable review-completed and publication notifications.

## Extension package

- Run `npm test`.
- Run `npm run build`.
- Run `npm run package:validate`.
- Run `npm run store:validate`.
- Run `npm run zip`.
- Load `dist` unpacked in `chrome://extensions` and test popup, options, saving, import/export, comparison, and optional auto-fill.
- Open the existing Chrome Web Store item and use **Package > Upload new package**.
- Upload `cost-per-use-extension.zip`; do not create a second Store item for this update.
- Confirm the dashboard recognizes package version `1.0.2`.

## Dashboard

- Review the shared fields in `listing.md`.
- Paste each detailed description from `listings` into its matching Store language.
- Upload the 128x128 icon, five screenshots, small promo tile, and marquee promo tile from `store-assets`.
- Paste permission explanations from `permission-justifications.md`.
- Complete data disclosures from `privacy-practices.md`.
- Select `No remote code`.
- Add the public privacy-policy URL.
- Keep the current payment, visibility, and region settings unless the distribution plan is intentionally changing.
- Add the no-login reviewer instructions from `releases/v1.0.2.md`; leave username and password blank.

## Final review

- Verify the Patreon link is voluntary and does not unlock features.
- Confirm every listing claim matches version `1.0.2`.
- Preview all 10 localized listings and verify the Arabic layout is right-to-left.
- Confirm **No remote code** is selected and all three Limited Use certifications are checked.
- Submit for review only after the dashboard shows no missing required fields.
- Decide whether the update should publish automatically after approval or be staged for manual publishing.
