import { test, expect } from '@playwright/test';

test.describe('Clinical & Engagement Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('kiwi-onboarding-complete', 'true');
        });
        await page.goto('http://localhost:5173/');
        // Wait for Splash screen to disappear (it takes 2s)
        await page.waitForTimeout(3000);
        // Wait for app to be ready
        await page.waitForSelector('#settings-button', { timeout: 15000 });
    });

    const openSettingsTab = async (page, tabName) => {
        await page.locator('#settings-button').click();
        await page.waitForTimeout(300);
        const tab = page.getByRole('button', { name: tabName });
        await tab.click();
        await page.waitForTimeout(300);
    };

    test('Linguistic Environment: Talk Sampler Flow', async ({ page }) => {
        await openSettingsTab(page, 'Data');

        // Find and click the Engagement Sampler button (mic icon circle)
        // Based on my implementation: <div ... onClick={() => setShowTalkSampler(true)}> <IonIcon icon={micOutline} /> </div>
        const samplerBtn = page.locator('div[style*="background: rgb(52, 199, 89)"]').filter({ has: page.locator('ion-icon[icon*="mic"]') });
        await samplerBtn.click();

        // Verify Modal is open
        await expect(page.getByText('Sample Your Talk')).toBeVisible();

        // Start Sampling
        await page.getByRole('button', { name: 'START SAMPLING' }).click();
        await expect(page.getByRole('button', { name: 'STOP & ANALYZE' })).toBeVisible();

        // Wait a bit to simulate sampling (though word count won't increase without real mic input in test, 
        // we can verify the UI states)
        await page.waitForTimeout(1000);

        // Stop Sampling
        await page.getByRole('button', { name: 'STOP & ANALYZE' }).click();

        // Verify Results
        await expect(page.getByText('Context')).toBeVisible();
        await expect(page.getByText('Words Spoken')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Done' })).toBeVisible();

        await page.getByRole('button', { name: 'Done' }).click();
    });

    test('Physical Scaling: Calibration Flow', async ({ page }) => {
        await openSettingsTab(page, 'Extra'); // 'advanced' tab label in my code was 'Extra'

        // Find "Screen Size Calibration" item
        const calibrationItem = page.getByText('Screen Size Calibration (mm)');
        await calibrationItem.click();

        // Verify Modal
        await expect(page.getByText('Physical Calibration')).toBeVisible();
        await expect(page.getByText('Reference Card (85.6mm)')).toBeVisible();

        // Save Calibration
        await page.getByRole('button', { name: 'Save Calibration' }).click();

        // Modal should be closed
        await expect(page.getByText('Physical Calibration')).not.toBeVisible();
    });

    test('Essential Skills: SBT Progression', async ({ page }) => {
        // Essential Skills is currently under 'Actions' in the Data tab or root items if pinned
        // But in my implementation I put it in Controls.jsx -> Data Tab
        await openSettingsTab(page, 'Data');

        const sbtBtn = page.getByText('Essential Skills (FCR)');
        await sbtBtn.click();

        // Step 1: Request
        await expect(page.getByText('STAGE 1: THE REQUEST')).toBeVisible();
        await page.getByText('MY WAY').click();

        // Step 2: Tolerance
        await expect(page.getByText('STAGE 2: TOLERANCE')).toBeVisible();
        await page.getByText('OKAY').click();

        // Step 3: Cooperation
        await expect(page.getByText('STAGE 3: COOPERATION')).toBeVisible();
        await page.getByText('DONE').click();

        // Reward State
        await expect(page.getByText('SUPERB!')).toBeVisible();
    });
});
