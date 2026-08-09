import { test, expect } from '@playwright/test';
import { GameDetailPage } from '../../pages/GameDetailPage';
import { TEST_GAMES } from '../../utils/test-data';

test.describe('Страница на игра', () => {
  let gameDetailPage: GameDetailPage;

  test.beforeEach(async ({ page }) => {
    gameDetailPage = new GameDetailPage(page);
    await gameDetailPage.open(TEST_GAMES.withExpansionsSlug);
    await gameDetailPage.acceptCookiesIfVisible();
  });

  test('страницата зарежда успешно', async ({ page }) => {
    await expect(page).toHaveURL(/\/igri\/.+/);
    await expect(gameDetailPage.gameTitle).toBeVisible();
  });

  test('показва заглавието на играта', async () => {
    const title = await gameDetailPage.getGameTitle();
    expect(title.length).toBeGreaterThan(0);
  });

  test('показва секцията с разширения', async () => {
    await expect(gameDetailPage.expansionsHeading).toBeVisible();
  });

  test('разширенията имат линкове към собствените им страници', async () => {
    const count = await gameDetailPage.gameCardLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('клик на разширение отива на неговата страница', async ({ page }) => {
    await gameDetailPage.clickFirstExpansion();
    await expect(page).toHaveURL(/\/igri\/.+/);
    await expect(gameDetailPage.gameTitle).toBeVisible();
  });
});
