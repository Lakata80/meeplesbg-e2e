import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TopPage extends BasePage {
  readonly pageTitle: Locator;
  readonly categoryCards: Locator;
  readonly viewRankingLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { level: 1, name: 'Топ класации' });
    this.categoryCards = page.locator('.grid > div').filter({ has: page.locator('h2') });
    this.viewRankingLinks = page.getByRole('link', { name: /Виж класацията/ });
  }

  async open(): Promise<void> {
    await this.goto('/top');
  }

  async getCategoryTitles(): Promise<string[]> {
    const headings = this.categoryCards.locator('h2');
    const count = await headings.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      if (text) titles.push(text.trim());
    }
    return titles;
  }

  async clickFirstCategory(): Promise<void> {
    await this.viewRankingLinks.first().click();
    await this.page.waitForURL(/\/top\/.+/);
  }

  async getRankingGameCount(): Promise<number> {
    return this.page.locator('ol li, [data-testid="ranking-item"]').count();
  }
}
