import { test, expect } from '@playwright/test';
import { GamesPage } from '../../pages/GamesPage';
import { TEST_GAMES } from '../../utils/test-data';

test.describe('Търсене на игри', () => {
  let gamesPage: GamesPage;

  test.beforeEach(async ({ page }) => {
    gamesPage = new GamesPage(page);
    await gamesPage.open();
    await gamesPage.acceptCookiesIfVisible();
  });

  test('търсенето за "Catan" връща резултати', async ({ page }) => {
    await gamesPage.search(TEST_GAMES.popular);
    await expect(page).toHaveURL(/q=Catan/i);
    const count = await gamesPage.getGameCardCount();
    expect(count).toBeGreaterThan(0);
  });

  test('клик на резултат отива на страницата на играта', async ({ page }) => {
    await gamesPage.search(TEST_GAMES.popular);
    const count = await gamesPage.getGameCardCount();
    expect(count).toBeGreaterThan(0);
    await gamesPage.clickFirstGame();
    await expect(page).toHaveURL(/\/igri\/.+/);
  });

  test('несъществуваща игра показва empty state', async ({ page }) => {
    await gamesPage.search(TEST_GAMES.nonexistent);
    await expect(page).toHaveURL(new RegExp(encodeURIComponent(TEST_GAMES.nonexistent), 'i'));
    await expect(gamesPage.emptyState).toBeVisible({ timeout: 15_000 });
  });
});
