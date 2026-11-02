import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../../pages/LoginPage';

const authFile = '.auth/user.json';

setup('authenticate as test user', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  // eslint-disable-next-line playwright/no-conditional-in-test
  if (!email || !password) {
    throw new Error('Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in .env — see .env.example');
  }

  const dir = path.dirname(authFile);
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.acceptCookiesIfVisible();

  await loginPage.login(email, password);

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20_000 });

  await expect(
    page
      .locator(
        'header a[href="/profile"], header button[aria-label*="меню"], header button[aria-label*="профил"]'
      )
      .or(
        page
          .locator('header')
          .getByRole('button')
          .filter({ hasText: /^[A-ZА-Я]{1,3}$/ })
      )
      .first(),
    'Login failed — check test credentials'
  ).toBeVisible({ timeout: 15_000 });

  await page.context().storageState({ path: authFile });
});
