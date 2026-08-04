import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly nav: Locator;
  readonly logo: Locator;
  readonly cookieBanner: Locator;
  readonly acceptCookiesBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole('navigation', { name: 'Главна навигация' });
    this.logo = page.getByRole('link', { name: '🎲 MeeplesBG' }).first();
    this.cookieBanner = page.getByRole('dialog', { name: 'Управление на бисквитките' });
    this.acceptCookiesBtn = page.getByRole('button', { name: 'Приемам всички' });
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async acceptCookiesIfVisible(): Promise<void> {
    const visible = await this.cookieBanner.isVisible().catch(() => false);
    if (visible) {
      await this.acceptCookiesBtn.click();
      await this.cookieBanner.waitFor({ state: 'hidden' });
    }
  }

  async clickNavLink(name: string): Promise<void> {
    await this.nav.getByRole('link', { name }).click();
  }

  async isLoggedIn(): Promise<boolean> {
    const userMenuBtn = this.page.getByRole('button', { name: 'Потребителско меню' });
    return userMenuBtn.isVisible();
  }
}
