import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const languages = ['en', 'tr', 'es', 'de', 'fr', 'pt-BR', 'ru', 'ar', 'ja', 'zh-CN'];
const server = await createServer({ server: { host: '127.0.0.1', port: 4174, strictPort: true } });
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ headless: true });
  for (const language of languages) {
    for (const theme of ['light', 'dark']) {
      const currency = language === 'tr' ? 'TRY' : language === 'ja' ? 'CUSTOM' : 'USD';
      const page = await browser.newPage({ viewport: { width: 400, height: 600 }, locale: 'en-US' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(({ language, theme, currency }) => {
        localStorage.setItem('lastSeenReleaseVersion', JSON.stringify('1.0.2'));
        localStorage.setItem('settings', JSON.stringify({
          defaultCurrency: currency, customCurrencySymbol: '¥', defaultDurationValue: 1,
          defaultDurationUnit: 'years', defaultUsesPerWeek: 5,
          language, theme, autoFillEnabled: false,
        }));
      }, { language, theme, currency });
      await page.goto('http://127.0.0.1:4174');
      await page.locator('input[type="number"][placeholder="0.00"]').first().fill('261');
      await page.locator('button[type="submit"]').click();
      const card = page.getByTestId('cost-target');
      const input = card.getByRole('spinbutton');
      const result = page.getByTestId('cost-target-result');
      await input.waitFor();
      assert.equal(await result.count(), 0, 'The target is optional, with no automatic judgment.');
      const title = await card.locator('h3').textContent();
      const label = await card.locator('label').textContent();
      assert.ok(title && !title.includes('results.'));
      if (language !== 'en') assert.notEqual(title, 'Your cost-per-use target');
      assert.ok(label.includes(currency === 'CUSTOM' ? '¥' : currency));
      assert.equal(await card.locator('label').getAttribute('for'), await input.getAttribute('id'));

      await input.fill('0.5');
      await result.waitFor();
      assert.equal(await result.locator('dd').textContent(), (522).toLocaleString(language));
      if (language === 'en') assert.match(await result.textContent(), /beyond your estimate: 261/);
      await card.scrollIntoViewIfNeeded();
      const fits = await card.evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= 400 &&
          [...element.querySelectorAll('h3, p, label, input, dd')].every(child => child.scrollWidth <= child.clientWidth + 1);
      });
      assert.ok(fits, `${language}/${theme}: card content overflows`);
      assert.equal(await page.locator('html').getAttribute('dir'), language === 'ar' ? 'rtl' : 'ltr');
      if (theme === 'light' && ['en', 'ar'].includes(language)) {
        await input.blur();
        await mkdir('docs/screenshots', { recursive: true });
        await page.screenshot({ path: `docs/screenshots/cost-target-${language}.png`, animations: 'disabled' });
      }

      await input.fill('2');
      assert.equal(await result.locator('dd').textContent(), (131).toLocaleString(language));
      if (language === 'en') assert.match(await result.textContent(), /enough to reach/);
      for (const invalid of ['0', '-1', '1e-30']) {
        await input.fill(invalid);
        assert.equal(await input.getAttribute('aria-invalid'), 'true');
        assert.equal(await result.count(), 0);
      }
      await input.fill('');
      assert.equal(await input.getAttribute('aria-invalid'), 'false');
      assert.equal(await result.count(), 0);

      if (language === 'en' && theme === 'light') {
        await input.fill('0.5');
        await page.locator('form select').first().selectOption('EUR');
        await page.locator('button[type="submit"]').click();
        assert.equal(await input.inputValue(), '', 'A new calculation resets the old target.');
        assert.match(await card.locator('label').textContent(), /EUR/);
        await input.fill('0.5');
        await page.getByRole('button', { name: 'Save Calculation', exact: true }).click();
        await page.getByRole('button', { name: /History/ }).click();
        const history = await page.evaluate(() => JSON.parse(localStorage.getItem('history')));
        assert.equal(history[0].usesPerWeek, 5);
        assert.equal(history[0].costPerUse, 1);
        assert.equal(history[0].currency, 'EUR');
        assert.equal(Object.keys(history[0]).some(key => /target/i.test(key)), false);
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log('Cost target UI passed: 10 languages, 2 themes, currency labels, input errors, reset and saved-history checks.');
} finally {
  await browser?.close();
  await server.close();
}
