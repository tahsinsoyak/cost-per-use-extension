import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = resolve(root, 'store-assets');
const baseUrl = process.env.STORE_PREVIEW_URL || 'http://127.0.0.1:4173';

const calculations = [
  {
    id: 'headphones', productName: 'Premium noise-cancelling headphones', price: 349,
    currency: 'USD', ownershipDurationValue: 3, ownershipDurationUnit: 'years',
    usesPerWeek: 6, resaleValue: 65, maintenanceCost: 20, totalEstimatedUses: 938,
    netCost: 304, costPerUse: 0.32, costPerMonth: 8.44, costPerYear: 101.33,
    costPerDay: 0.28, valueRating: 'excellent', createdAt: '2026-07-15T09:30:00.000Z',
  },
  {
    id: 'chair', productName: 'Ergonomic task chair', price: 520,
    currency: 'USD', ownershipDurationValue: 6, ownershipDurationUnit: 'years',
    usesPerWeek: 5, resaleValue: 120, maintenanceCost: 35, totalEstimatedUses: 1564,
    netCost: 435, costPerUse: 0.28, costPerMonth: 6.04, costPerYear: 72.5,
    costPerDay: 0.2, valueRating: 'excellent', createdAt: '2026-07-14T14:15:00.000Z',
  },
  {
    id: 'espresso', productName: 'Home espresso machine', price: 680,
    currency: 'USD', ownershipDurationValue: 5, ownershipDurationUnit: 'years',
    usesPerWeek: 10, resaleValue: 150, maintenanceCost: 160, totalEstimatedUses: 2607,
    netCost: 690, costPerUse: 0.26, costPerMonth: 11.5, costPerYear: 138,
    costPerDay: 0.38, valueRating: 'excellent', createdAt: '2026-07-13T11:45:00.000Z',
  },
];

const stories = {
  calculator: {
    eyebrow: 'REAL-WORLD EXAMPLE',
    title: 'A price tag is only the beginning.',
    body: 'See what premium headphones really cost across three years of everyday listening.',
    product: 'Premium ANC headphones',
    price: '$349',
    detail: '3 years · 5 uses each week',
    accent: 'Calculate before you buy',
  },
  result: {
    eyebrow: 'THE USEFUL NUMBER',
    title: '$349 becomes $0.39 per use.',
    body: 'Resale value, maintenance, ownership time, and real usage turn one price into a decision you can compare.',
    product: 'Estimated net cost',
    price: '$304',
    detail: '782 expected uses',
    accent: 'Excellent long-term value',
  },
  compare: {
    eyebrow: 'COMPARE VALUE, NOT PRICES',
    title: 'The cheapest item is not always the best buy.',
    body: 'Put up to three real purchases side by side and compare the cost of actually living with each one.',
    product: '3 products compared',
    price: '$0.26–$0.32',
    detail: 'Cost-per-use range',
    accent: 'A clearer trade-off',
  },
  history: {
    eyebrow: 'YOUR PRIVATE DECISION LOG',
    title: 'Remember why a purchase made sense.',
    body: 'Saved calculations stay in your browser and can be restored, exported, or compared later.',
    product: 'Saved locally',
    price: '3 decisions',
    detail: 'No account · no tracking',
    accent: 'Private by design',
  },
};

function collectPageErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function seedLocalData(page) {
  await page.addInitScript((sample) => {
    localStorage.setItem('history', JSON.stringify(sample));
    localStorage.setItem('comparisonList', JSON.stringify(sample));
    localStorage.setItem('settings', JSON.stringify({
      defaultCurrency: 'USD', customCurrencySymbol: '', defaultDurationValue: 3,
      defaultDurationUnit: 'years', defaultUsesPerWeek: 5, theme: 'light',
      onboardingCompleted: true, showWorkCost: false, monthlySalary: 0,
      workHoursPerWeek: 40, hourlyWage: 0, language: 'en', autoFillEnabled: false,
    }));
  }, calculations);
}

async function addStoreFrame(page, story) {
  await page.evaluate((content) => {
    document.querySelector('.store-story')?.remove();
    const panel = document.createElement('aside');
    panel.className = 'store-story';
    panel.innerHTML = `
      <div class="story-kicker"><span></span>${content.eyebrow}</div>
      <h2>${content.title}</h2>
      <p>${content.body}</p>
      <div class="example-card">
        <div>
          <span class="example-label">${content.product}</span>
          <strong>${content.price}</strong>
        </div>
        <span class="example-detail">${content.detail}</span>
      </div>
      <div class="story-accent"><span>✓</span>${content.accent}</div>
    `;
    document.body.prepend(panel);
  }, story);

  await page.addStyleTag({ content: `
    html, body { width: 1280px !important; height: 800px !important; margin: 0 !important; overflow: hidden !important; }
    body {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) 420px !important;
      align-items: center !important;
      gap: 58px !important;
      padding: 64px 78px !important;
      background:
        radial-gradient(circle at 12% 12%, rgba(31,94,255,.18), transparent 31%),
        radial-gradient(circle at 82% 92%, rgba(17,155,114,.12), transparent 27%),
        #0d1929 !important;
      box-sizing: border-box !important;
    }
    body::before {
      position: fixed; inset: 0; pointer-events: none; content: '';
      background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.08) 1px, transparent 0);
      background-size: 24px 24px;
      opacity: .72;
    }
    #root {
      grid-column: 2;
      width: 420px !important;
      height: 620px !important;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 25px;
      overflow: hidden;
      box-shadow: 0 38px 90px rgba(0,0,0,.5), 0 0 0 9px rgba(255,255,255,.035);
    }
    .store-story { position: relative; z-index: 2; color: #fff; max-width: 560px; }
    .story-kicker { display: flex; align-items: center; gap: 10px; color: #9bb8ff; font-size: 12px; font-weight: 800; letter-spacing: .14em; }
    .story-kicker span { width: 32px; height: 2px; background: #5f8cff; border-radius: 10px; }
    .store-story h2 { max-width: 540px; margin: 22px 0 18px; font-size: 52px; line-height: .99; letter-spacing: -.055em; font-weight: 850; }
    .store-story > p { max-width: 500px; margin: 0; color: #b9c6d6; font-size: 17px; line-height: 1.65; letter-spacing: -.018em; }
    .example-card { display: flex; align-items: flex-end; justify-content: space-between; gap: 22px; max-width: 500px; margin-top: 34px; padding: 20px 22px; color: #132235; background: #fffdf8; border: 1px solid rgba(255,255,255,.35); border-radius: 19px; box-shadow: 0 24px 55px -28px rgba(0,0,0,.75); }
    .example-card > div { display: flex; flex-direction: column; gap: 6px; }
    .example-label { color: #68778a; font-size: 11px; font-weight: 750; letter-spacing: .05em; text-transform: uppercase; }
    .example-card strong { font-family: 'JetBrains Mono Variable', monospace; font-size: 29px; letter-spacing: -.06em; }
    .example-detail { color: #68778a; font-size: 12px; font-weight: 700; }
    .story-accent { display: inline-flex; align-items: center; gap: 8px; margin-top: 18px; color: #89e3bf; font-size: 12px; font-weight: 800; }
    .story-accent span { display: grid; width: 20px; height: 20px; place-items: center; color: #0d1929; background: #89e3bf; border-radius: 50%; }
    .popup-footer { backdrop-filter: none !important; }
  ` });
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function captureCalculatorAndResult(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
  const errors = collectPageErrors(page);
  await seedLocalData(page);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  await page.getByPlaceholder('What are you buying?').fill('Premium noise-cancelling headphones');
  await page.locator('input[type="number"][placeholder="0.00"]').first().fill('349');
  await page.getByRole('button').filter({ hasText: '3 yr' }).click();
  const advancedToggle = page.getByRole('button', { name: /Advanced/ });
  await advancedToggle.click();
  const amountInputs = page.locator('input[type="number"][placeholder="0.00"]');
  await amountInputs.nth(1).fill('65');
  await amountInputs.nth(2).fill('20');
  await advancedToggle.click();
  await addStoreFrame(page, stories.calculator);
  await page.screenshot({ path: resolve(assets, 'screenshot-calculator.png'), animations: 'disabled' });

  await page.getByRole('button', { name: 'Calculate Cost Per Use' }).click();
  const resultCard = page.getByTestId('calculation-result');
  await resultCard.waitFor({ state: 'attached' });
  await page.waitForFunction(() => (
    document.querySelector('[data-testid="calculation-result"]')?.classList.contains('opacity-100')
  ));
  await page.locator('main').evaluate((element) => {
    const result = element.querySelector(':scope > div > div:nth-child(2)');
    if (result) element.scrollTop = result.offsetTop - element.offsetTop - 8;
  });
  await addStoreFrame(page, stories.result);
  await page.screenshot({ path: resolve(assets, 'screenshot-result.png'), animations: 'disabled' });
  await page.close();
  if (errors.length) throw new Error(`Calculator page errors:\n${errors.join('\n')}`);
}

async function capturePopupTab(browser, tabName, filename, story) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
  const errors = collectPageErrors(page);
  await seedLocalData(page);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: tabName }).click();
  await addStoreFrame(page, story);
  await page.screenshot({ path: resolve(assets, filename), animations: 'disabled' });
  await page.close();
  if (errors.length) throw new Error(`${tabName} page errors:\n${errors.join('\n')}`);
}

async function captureOptions(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
  const errors = collectPageErrors(page);
  await seedLocalData(page);
  await page.goto(`${baseUrl}/options.html`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: resolve(assets, 'screenshot-options.png'), animations: 'disabled' });
  await page.close();
  if (errors.length) throw new Error(`Options page errors:\n${errors.join('\n')}`);
}

await mkdir(assets, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  await captureCalculatorAndResult(browser);
  await capturePopupTab(browser, 'Compare', 'screenshot-compare.png', stories.compare);
  await capturePopupTab(browser, 'History', 'screenshot-history.png', stories.history);
  await captureOptions(browser);
} finally {
  await browser.close();
}

console.log(`Captured five Store screenshots in ${assets}`);
