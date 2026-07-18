# Chrome Web Store submission

Use these files when creating the Chrome Web Store item:

- [Store listing](listing.md)
- [Privacy practices](privacy-practices.md)
- [Permission justifications](permission-justifications.md)
- [Submission checklist](submission-checklist.md)
- [Version 1.0.1 update guide](releases/v1.0.1.md)
- [Privacy policy](../privacy-policy.md)

The upload archive is generated at the repository root:

```bash
npm run build
npm run package:validate
npm run zip
```

Upload `cost-per-use-extension.zip`. The archive contains the files from `dist` at its root.

For a full pre-release verification run, use `npm run release:check`.
