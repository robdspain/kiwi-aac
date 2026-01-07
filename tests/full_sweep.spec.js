import { test, expect } from '@playwright/test';
import path from 'path';

// Define screenshot directory
const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');

test.describe('Full Application Sweep', () => {
    test.beforeEach(async ({ page }) => {
        // Set onboarding complete to bypass initial modal
        await page.addInitScript(() => {
            localStorage.setItem('kiwi-onboarding-complete', 'true');
        });

        // Go to app
        await page.goto('http://localhost:5173/');

        // Wait for Splash screen to disappear (2s)
        await page.waitForTimeout(3500);
    });

    const takeScreenshot = async (page, name) => {
        await page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: true });
    };

    test('Verify Global Connectivity & Core Navigation', async ({ page }) => {
        // 1. Initial Load
        await takeScreenshot(page, '01_initial_load');
        await expect(page.locator('#settings-button')).toBeVisible({ timeout: 10000 });

        // 2. Open Settings
        await page.locator('#settings-button').click();
        await page.waitForTimeout(500);
        await takeScreenshot(page, '02_settings_open');

        // 3. Tab Navigation Sweep
        const tabs = ['Basic', 'Avatar', 'Access', 'Extra', 'Data'];
        for (const tabName of tabs) {
            const tab = page.getByRole('tab', { name: tabName });
            if (await tab.isVisible()) {
                await tab.click();
                await page.waitForTimeout(500);
                await takeScreenshot(page, `03_tab_${tabName.toLowerCase()}`);
            }
        }
    });

    test('Linguistic Environment: Talk Sampler Deep Dive', async ({ page }) => {
        await page.locator('#settings-button').click();
        await page.waitForTimeout(500);

        // Transition to Data tab
        await page.getByRole('tab', { name: 'Data' }).click();
        await page.waitForTimeout(500);

        // Click Mic Icon (Engagement Sampler)
        // More specific locator for the green circle with mic
        const samplerSection = page.getByText('LINGUISTIC ENVIRONMENT');
        await expect(samplerSection).toBeVisible();

        const micIcon = page.locator('div').filter({ hasText: 'LINGUISTIC ENVIRONMENT' }).locator('ion-icon[icon*="mic"]').first();
        await micIcon.click();
        await page.waitForTimeout(500);
        await takeScreenshot(page, '04_talk_sampler_modal');

        // Start sampling
        await page.getByRole('button', { name: 'START SAMPLING' }).click();
        await page.waitForTimeout(500);
        await takeScreenshot(page, '05_sampling_active');

        // Stop sampling
        await page.getByRole('button', { name: 'STOP & ANALYZE' }).click();
        await page.waitForTimeout(500);
        await takeScreenshot(page, '06_sampling_results');

        // Close results
        await page.getByRole('button', { name: 'Done' }).click();
        await page.waitForTimeout(300);
    });

    test('Physical Scaling: Motor Accessibility Flow', async ({ page }) => {
        await page.locator('#settings-button').click();
        await page.waitForTimeout(500);

        // Transition to Extra tab
        await page.getByRole('tab', { name: 'Extra' }).click();
        await page.waitForTimeout(500);

        // Open Calibration
        await page.getByText('Screen Size Calibration').click();
        await page.waitForTimeout(500);
        await takeScreenshot(page, '07_physical_calibration');

        // Adjust slider (simulated)
        // await page.locator('input[type="range"]').fill('120');

        await page.getByRole('button', { name: 'Save Calibration' }).click();
        await page.waitForTimeout(300);
    });

    test('Clinical Flow: Hanley SBT & Data Visualization', async ({ page }) => {
        await page.locator('#settings-button').click();
        await page.waitForTimeout(500);

        // Transition to Data tab
        await page.getByRole('tab', { name: 'Data' }).click();
        await page.waitForTimeout(500);

        // Open Dashboard to verify visual consistency
        await page.locator('div').filter({ hasText: /^AVG WPM$/ }).first().click(); // Open Dashboard via the summary card
        await page.waitForTimeout(800);
        await takeScreenshot(page, '08_dashboard_view');

        // Close dashboard (finding the close button)
        const closeBtn = page.getByRole('button', { name: '✕' }).first();
        if (await closeBtn.isVisible()) {
            await closeBtn.click();
        } else {
            await page.getByRole('button', { name: 'Close' }).first().click();
        }
        await page.waitForTimeout(500);

        // Enter SBT Mode
        await page.getByText('Essential Skills (FCR)').click();
        await page.waitForTimeout(500);
        await takeScreenshot(page, '09_sbt_logic_start');

        // Cycle through stages
        await page.getByText('MY WAY').click();
        await page.waitForTimeout(300);
        await takeScreenshot(page, '10_sbt_stage_2');

        await page.getByText('OKAY').click();
        await page.waitForTimeout(300);
        await takeScreenshot(page, '11_sbt_stage_3');

        await page.getByText('DONE').click();
        await page.waitForTimeout(300);
        await takeScreenshot(page, '12_sbt_complete');
    });
});
