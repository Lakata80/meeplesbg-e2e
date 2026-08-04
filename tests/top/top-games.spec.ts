import { test, expect } from '@playwright/test';
import { TopPage } from '../../pages/TopPage';
import { TOP_CATEGORIES } from '../../utils/test-data';

test.describe('Топ класации', () => {
  let topPage: TopPage;

  test.beforeEach(async ({ page }) => {
    topPage = new TopPage(page);
    await topPage.open();
    await topPage.acceptCookiesIfVisible();
  });

  test('страницата зарежда успешно', async ({ page }) => {
    await expect(page).toHaveURL(/\/top/);
    await expect(topPage.pageTitle).toBeVisible();
  });

  test('показва 6 категории', async () => {
    const titles = await topPage.getCategoryTitles();
    expect(titles.length).toBe(TOP_CATEGORIES.length);
  });

  test('всяка категория има "Виж класацията" линк', async () => {
    const count = await topPage.viewRankingLinks.count();
    expect(count).toBe(TOP_CATEGORIES.length);
  });

  test('клик на категория отива на класация страница', async ({ page }) => {
    await topPage.clickFirstCategory();
    await expect(page).toHaveURL(/\/top\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
