import { test, expect } from '@playwright/test';
import { NewsPage } from '../../pages/NewsPage';

test.describe('Новини и статии', () => {
  let newsPage: NewsPage;

  test.beforeEach(async ({ page }) => {
    newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.acceptCookiesIfVisible();
  });

  test('страницата зарежда успешно', async ({ page }) => {
    await expect(page).toHaveURL(/\/novini/);
    await expect(newsPage.pageTitle).toBeVisible();
  });

  test('показва статии', async () => {
    const count = await newsPage.getArticleCount();
    expect(count).toBeGreaterThan(0);
  });

  test('клик на статия отива на статия страница', async ({ page }) => {
    await newsPage.openFirstArticle();
    await expect(page).toHaveURL(/\/novini\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('категорийни табове са видими', async () => {
    const tabsCount = await newsPage.categoryTabs.count();
    expect(tabsCount).toBeGreaterThanOrEqual(4);
  });
});
