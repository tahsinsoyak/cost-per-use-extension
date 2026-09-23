# Manual review before the next extension update

Automated release checks cover calculation rules, translated interfaces, storage, import/export, and autofill on a controlled product fixture. Use these additional checks for real browsing conditions.

- Export saved history before testing an update. Confirm saved purchases, comparison entries, language, and theme remain available after updating an existing installation.
- Open a product page you normally use. With autofill disabled, confirm the extension does not fill page details. Enable autofill, reopen the popup, and compare its title, price, and currency with the page. Record the product URL and browser version for any mismatch; avoid sharing account or checkout information.
- Navigate the popup and settings using only the keyboard. Check visible focus, field labels, error messages, and closing dialogs with Escape.
- Review the website at narrow phone widths, tablet width, and desktop width. Open the mobile menu, follow each section link, expand calculator details, and change languages, including Arabic.
- Check a real phone browser when available. Desktop browser viewport emulation does not verify every mobile browser or physical device.

Report expected behavior, actual behavior, reproduction steps, extension version, browser version, and interface language. Remove personal information from screenshots and exported files before attaching them to a public issue.
