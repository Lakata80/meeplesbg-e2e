import { test, expect } from '@playwright/test';
import { GamesPage } from '../../pages/GamesPage';

test.describe('Страница с игри', () => {
  let gamesPage: GamesPage;

  test.beforeEach(async ({ page }) => {
    gamesPage = new GamesPage(page);
    await gamesPage.open();
    await gamesPage.acceptCookiesIfVisible();
  });

  test('зарежда успешно', async ({ page }) => {
    await expect(page).toHaveURL(/\/igri/);
    await expect(page).toHaveTitle(/MeeplesBG/);
  });

  test('показва game cards', async () => {
    const count = await gamesPage.getGameCardCount();
    expect(count).toBeGreaterThan(0);
  });

  test('game card води до страницата на играта', async ({ page }) => {
    await gamesPage.clickFirstGame();
    await expect(page).toHaveURL(/\/igri\/.+/);
  });

  test('search полето е видимо', async () => {
    await expect(gamesPage.searchInput).toBeVisible();
  });
});
