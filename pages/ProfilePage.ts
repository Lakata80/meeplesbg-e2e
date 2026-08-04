import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly pageTitle: Locator;
  readonly collectionTab: Locator;
  readonly wishlistTab: Locator;
  readonly bggImportLink: Locator;
  readonly userMenuBtn: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.collectionTab = page.getByRole('link', { name: /Колекция/ });
    this.wishlistTab = page.getByRole('link', { name: /Искам да играя/ });
    this.bggImportLink = page.getByRole('link', { name: /Синхронизирай с BGG|Импортирай от BGG/ });
    this.userMenuBtn = page.getByRole('button', { name: 'Потребителско меню' });
    this.logoutBtn = page.getByRole('button', { name: 'Изход' });
  }

  async open(): Promise<void> {
    await this.goto('/profil');
  }

  async getDisplayedUsername(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async logout(): Promise<void> {
    await this.userMenuBtn.click();
    await this.logoutBtn.waitFor({ state: 'visible' });
    await this.logoutBtn.click();
    await this.page.waitForURL('/');
  }

  async getCollectionCount(): Promise<number> {
    const countEl = this.page
      .locator('.rounded-2xl')
      .filter({ hasText: 'Игри в колекцията' })
      .locator('p')
      .first();
    const text = await countEl.textContent();
    return parseInt(text ?? '0', 10);
  }
}
