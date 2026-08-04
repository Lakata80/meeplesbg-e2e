import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { NAV_LINKS } from '../../utils/test-data';

test.describe('Начална страница', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
    await homePage.acceptCookiesIfVisible();
  });

  test('зарежда успешно', async ({ page }) => {
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/MeeplesBG/);
  });

  test('показва Hero секцията с правилно заглавие', async () => {
    await expect(homePage.heroSection).toBeVisible();
    const title = await homePage.getHeroTitleText();
    expect(title).toContain('следващата');
  });

  test('показва бутон "Направи куиза"', async () => {
    await expect(homePage.quizCta).toBeVisible();
  });

  test('навигацията съдържа основните линкове', async () => {
    for (const name of Object.values(NAV_LINKS)) {
      await expect(
        homePage.nav.getByRole('link', { name })
      ).toBeVisible();
    }
  });

  test('Header показва логото', async () => {
    await expect(homePage.logo).toBeVisible();
  });
});
