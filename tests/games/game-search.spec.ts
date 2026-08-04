import { test, expect } from '@playwright/test';
import { GamesPage } from '../../pages/GamesPage';
import { TEST_GAMES } from '../../utils/test-data';

test.describe('Търсене на игри', () => {
  test('търсенето за "Catan" връща резултати', async ({ page }) => {
    const gamesPage = new GamesPage(page);
    await gamesPage.open(TEST_GAMES.popular);
    await gamesPage.acceptCookiesIfVisible();
    await expect(page).toHaveURL(/q=Catan/i);
    const count = await gamesPage.getGameCardCount();
    expect(count).toBeGreaterThan(0);
  });

  test('клик на резултат отива на страницата на играта', async ({ page }) => {
    const gamesPage = new GamesPage(page);
    await gamesPage.open(TEST_GAMES.popular);
    await gamesPage.acceptCookiesIfVisible();
    const count = await gamesPage.getGameCardCount();
    expect(count).toBeGreaterThan(0);
    await gamesPage.clickFirstGame();
    await expect(page).toHaveURL(/\/igri\/.+/);
  });

  test('несъществуваща игра показва empty state', async ({ page }) => {
    const gamesPage = new GamesPage(page);
    await gamesPage.open(TEST_GAMES.nonexistent);
    await gamesPage.acceptCookiesIfVisible();
    await expect(page).toHaveURL(new RegExp(encodeURIComponent(TEST_GAMES.nonexistent), 'i'));
    await expect(gamesPage.emptyState).toBeVisible();
  });
});
