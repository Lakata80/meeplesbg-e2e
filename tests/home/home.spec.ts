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

  test('показва Hero секцията с непразно заглавие', async () => {
    await expect(homePage.heroSection).toBeVisible();
    const title = await homePage.getHeroTitleText();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('показва линк към Квиз', async () => {
    await expect(homePage.quizCta).toBeVisible();
  });

  test('навигацията съдържа основните линкове', async () => {
    for (const name of Object.values(NAV_LINKS)) {
      await expect(homePage.nav.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });

  test('Header показва логото', async () => {
    await expect(homePage.logo).toBeVisible();
  });
});
