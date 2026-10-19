import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class GameDetailPage extends BasePage {
  readonly gameTitle: Locator;
  readonly expansionsHeading: Locator;
  readonly gameCardLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.gameTitle = page.getByRole('heading', { level: 1 });
    this.expansionsHeading = page.getByRole('heading', { level: 2, name: /Разширения/ });
    // Matches expansion cards AND "similar games" cards — both use a[href*="/igri/"] + h3
    this.gameCardLinks = page.locator('a[href*="/igri/"]').filter({ has: page.locator('h3') });
  }

  async open(slug: string): Promise<void> {
    await this.page.goto(`/igri/${slug}`);
    await this.gameTitle.waitFor({ state: 'visible' });
  }

  async getGameTitle(): Promise<string> {
    return (await this.gameTitle.textContent()) ?? '';
  }

  async clickFirstExpansion(): Promise<void> {
    // Разширения section appears before Подобни игри in DOM, so first card is an expansion
    await this.gameCardLinks.first().waitFor({ state: 'visible' });
    await this.gameCardLinks.first().click();
    await this.page.waitForURL(/\/igri\/.+/);
  }
}
