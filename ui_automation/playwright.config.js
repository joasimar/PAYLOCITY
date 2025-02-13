import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', 
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 0,
  reporter: [['html', { open: 'on-failure' }]],
  use: {
    headless: true,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    workers: 1,
  },
});
