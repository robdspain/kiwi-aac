import { defineConfig } from '@playwright/test';
import os from 'node:os';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const browserChannel = process.env.PLAYWRIGHT_CHANNEL;
const browserName = process.env.PLAYWRIGHT_BROWSER || 'chromium';

// Force arm64 Playwright binaries on Apple Silicon when CPU metadata is missing.
if (
  !process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE
  && process.platform === 'darwin'
  && process.arch === 'arm64'
  && !os.cpus().some((cpu) => cpu.model.includes('Apple'))
) {
  const releaseMajor = Number(os.release().split('.')[0]);
  const macVersion = Math.min(releaseMajor - 9, 15);
  process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = `mac${macVersion}-arm64`;
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL,
    headless: true,
    browserName,
    ...(browserChannel && browserName === 'chromium' ? { channel: browserChannel } : {}),
  },
});
