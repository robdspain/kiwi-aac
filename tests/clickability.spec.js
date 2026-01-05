import { test, expect } from '@playwright/test';

const ROUTES = [
  { name: 'app', path: '/' },
];

const CLICKABLE_SELECTOR = [
  'a[href]',
  'button',
  'input[type="button"]',
  'input[type="submit"]',
  '[role="button"]',
  '[role="link"]',
].join(',');

const SKIP_TEXT = [
  /delete/i,
  /remove/i,
  /reset/i,
  /clear/i,
  /sign out/i,
  /log out/i,
  /erase/i,
  /lock app/i,
  /guided access/i,
  /restore purchases/i,
  /manage subscription/i,
  /privacy/i,
  /terms/i,
  /support/i,
  /skip to main content/i,
];

const SKIP_HREF = [/^mailto:/i, /^tel:/i, /^https?:\/\//i];
const CLOSE_SELECTOR = '.ios-close-button, button[aria-label="Close"]';
const IGNORED_CONSOLE_ERRORS = [
  /RevenueCat configuration error: Web not supported in this plugin/i,
  /Error refreshing customer info: Web not supported in this plugin/i,
  /Error loading offerings: Web not supported in this plugin/i,
  /Error checking entitlement: Web not supported in this plugin/i,
];

const getLabel = (element) => {
  const text = (element.innerText || '').trim();
  if (text) return text;
  const aria = element.getAttribute('aria-label');
  if (aria) return aria.trim();
  const alt = element.getAttribute('alt');
  if (alt) return alt.trim();
  const value = element.getAttribute('value');
  if (value) return value.trim();
  return element.tagName.toLowerCase();
};

test.describe('Clickability sweep', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kiwi-onboarding-complete', 'true');
    });
  });

  const closeOverlays = async (page) => {
    const closeButtons = page.locator(CLOSE_SELECTOR);
    for (let pass = 0; pass < 5; pass += 1) {
      const count = await closeButtons.count();
      if (count === 0) break;
      for (let i = 0; i < count; i += 1) {
        const button = closeButtons.nth(i);
        if (await button.isVisible()) {
          await button.click();
          await page.waitForTimeout(100);
        }
      }
    }
  };

  const clickVisible = async (page, scope = page) => {
    const failures = [];
    const clickable = scope.locator(CLICKABLE_SELECTOR);
    const total = await clickable.count();

    for (let i = 0; i < total; i += 1) {
      const item = clickable.nth(i);
      let isVisible = false;

      try {
        isVisible = await item.isVisible();
      } catch (error) {
        failures.push(`Unable to inspect element #${i}: ${error.message}`);
        continue;
      }

      if (!isVisible) continue;

      const label = await item.evaluate(getLabel);
      const ariaLabel = await item.getAttribute('aria-label');
      if ((ariaLabel || '').toLowerCase() === 'close settings') continue;
      if (SKIP_TEXT.some((pattern) => pattern.test(label))) continue;

      const tagName = await item.evaluate((element) => element.tagName.toLowerCase());
      const href = tagName === 'a' ? await item.getAttribute('href') : null;

      if (tagName === 'a' && href && SKIP_HREF.some((pattern) => pattern.test(href))) {
        continue;
      }

      try {
        await item.click({ timeout: 3000 });
      } catch (error) {
        failures.push(`Click failed on "${label}" (#${i}): ${error.message}`);
      }

      await closeOverlays(page);
      await page.waitForTimeout(100);
    }

    return failures;
  };

  const openSettings = async (page) => {
    const settingsButton = page.locator('#settings-button');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await page.waitForTimeout(150);
    }
  };

  const closeSettings = async (page) => {
    const doneButton = page.getByRole('button', { name: 'Done' });
    if (await doneButton.isVisible()) {
      await doneButton.click();
      await page.waitForTimeout(150);
    }
  };

  for (const route of ROUTES) {
    test(`clicks all visible interactive elements in app (${route.name})`, async ({ page }, testInfo) => {
      const baseURL = testInfo.project.use.baseURL || 'http://127.0.0.1:5173';
      const url = new URL(route.path, baseURL).toString();
      const consoleErrors = [];

      page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
      page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const text = msg.text();
        if (IGNORED_CONSOLE_ERRORS.some((pattern) => pattern.test(text))) return;
        consoleErrors.push(`console: ${text}`);
      });
      page.on('dialog', (dialog) => {
        dialog.dismiss().catch(() => {});
      });

      await page.goto(url, { waitUntil: 'networkidle' });

      const failures = [];
      failures.push(...await clickVisible(page));

      await openSettings(page);
      const controls = page.locator('#controls-content');
      if (await controls.isVisible()) {
        const tabLabels = ['Basic', 'Avatar', 'Access', 'Extra', 'Data'];
        for (const label of tabLabels) {
          const tabButton = page.getByRole('button', { name: label });
          if (await tabButton.isVisible()) {
            await tabButton.click();
            await page.waitForTimeout(150);
            failures.push(...await clickVisible(page, controls));
          }
        }
      }
      await closeSettings(page);

      if (consoleErrors.length > 0) {
        failures.push(`Console errors: ${consoleErrors.join(' | ')}`);
      }

      expect(failures, failures.join('\n')).toEqual([]);
    });
  }
});
