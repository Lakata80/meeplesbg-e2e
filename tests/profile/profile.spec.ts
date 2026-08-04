import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/ProfilePage';

test.describe('Потребителски профил', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await profilePage.open();
  });

  test('профилната страница е достъпна след вход', async ({ page }) => {
    await expect(page).toHaveURL('/profil');
    await expect(page).toHaveTitle(/профил|MeeplesBG/i);
  });

  test('показва името на потребителя', async () => {
    await expect(profilePage.pageTitle).toBeVisible();
    const name = await profilePage.getDisplayedUsername();
    expect(name.trim().length).toBeGreaterThan(0);
  });

  test('показва таба "Колекция"', async () => {
    await expect(profilePage.collectionTab).toBeVisible();
  });

  test('BGG import линкът е видим', async () => {
    await expect(profilePage.bggImportLink).toBeVisible();
  });

  test('logout работи успешно', async ({ page }) => {
    await profilePage.logout();
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('link', { name: 'Вход / Регистрация' })
    ).toBeVisible();
  });
});
