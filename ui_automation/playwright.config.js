import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Carpeta donde están los archivos de prueba
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 0,
  reporter: [['html', { open: 'on-failure' }]],
  use: {
    headless: false,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    workers: 1,
  },
});
