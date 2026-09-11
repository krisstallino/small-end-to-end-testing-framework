import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { TIMEOUT } from './src/config/timeouts';

export default defineConfig({
  testDir: './src/tests',

  timeout: TIMEOUT.TEST,
  expect: { timeout: TIMEOUT.ASSERTION },
  globalTimeout: env.isCI ? TIMEOUT.GLOBAL_CI : undefined,

  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 1 : 0,
  workers: env.isCI ? 2 : undefined,

  reporter: env.isCI
    ? [['github'], ['html', { open: 'never' }], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: env.baseURL,
    navigationTimeout: TIMEOUT.NAVIGATION,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
