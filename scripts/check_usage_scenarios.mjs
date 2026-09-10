import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

// Run against the local preview: npm run dev -- --host 127.0.0.1 --port 4173
const baseUrl = process.env.STORE_PREVIEW_URL || 'http://127.0.0.1:4173';
const languages = ['en', 'tr', 'es', 'de', 'fr', 'pt-BR', 'ru', 'ar', 'ja', 'zh-CN'];
const browser = await chromium.launch({ headless: true });
try {
  for (const language of languages) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width: 400, height: 600 }, locale: 'en-US' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('lastSeenReleaseVersion', JSON.stringify('1.0.2'));
        localStorage.setItem('settings', JSON.stringify({
          defaultCurrency: 'USD', defaultDurationValue: 1,
          defaultDurationUnit: 'years', defaultUsesPerWeek: 5,
          language, theme, autoFillEnabled: false,
        }));
      }, { language, theme });
      await page.goto(baseUrl);
      await page.locator('input[type="number"][placeholder="0.00"]').first().fill('261');
      await page.locator('button[type="submit"]').click();
      const scenario = page.getByTestId('usage-scenarios');
      await scenario.waitFor();
      await page.waitForFunction(() => document.querySelector('[data-testid="calculation-result"]')?.classList.contains('opacity-100'));
      await scenario.scrollIntoViewIfNeeded();
      const values = await scenario.locator('dd').allTextContents();
      assert.match(values[0], /\$1\.00/);
      assert.match(values[1], /\$2\.00/);
      const title = await scenario.locator('h3').textContent();
      assert.ok(title && !title.includes('results.'));
      if (language !== 'en') assert.notEqual(title, 'What if I use it less?');
      assert.equal(await page.locator('html').getAttribute('dir'), language === 'ar' ? 'rtl' : 'ltr');
      const fits = await scenario.evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= 400 && element.scrollWidth <= element.clientWidth + 1;
      });
      assert.ok(fits, `${language}/${theme}: scenario overflows popup`);
      assert.deepEqual(errors, []);
      if (language === 'en' && theme === 'light') {
        await mkdir('docs/screenshots', { recursive: true });
        await page.screenshot({ path: 'docs/screenshots/usage-scenarios.png', animations: 'disabled' });
        await page.getByRole('button', { name: 'Save Calculation', exact: true }).click();
        await page.getByRole('button', { name: /History/ }).click();
        assert.equal(await page.getByTestId('usage-scenarios').count(), 0);
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('history')));
        assert.equal(saved[0].usesPerWeek, 5);
        assert.equal(saved[0].costPerUse, 1);
      }
      await page.close();
    }
  }
  console.log('Usage scenario UI passed in all 10 languages, light/dark themes, with saved inputs unchanged.');
} finally {
  await browser.close();
}
