import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  timeout: 180_000,
  expect: { timeout: 10_000 },
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://meeplesbg.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 90_000,
  },

  projects: [
    // Auth setup — runs once before authenticated tests
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // Public pages — no login required
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/auth/**', '**/profile/**'],
    },

    // Authenticated pages — depends on setup
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      testMatch: '**/profile/**',
      dependencies: ['setup'],
    },
  ],
});
