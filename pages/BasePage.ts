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
    try {
      // Cookie banner is client-side — wait up to 5s for it to appear after hydration
      await this.cookieBanner.waitFor({ state: 'visible', timeout: 5_000 });
      // force:true bypasses pointer-event interception from overlays during loading
      await this.acceptCookiesBtn.click({ force: true });
      await this.cookieBanner.waitFor({ state: 'hidden', timeout: 10_000 });
    } catch {
      // Banner did not appear — nothing to dismiss
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
