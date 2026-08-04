import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly articleCards: Locator;
  readonly categoryTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.articleCards = page.locator('a[href^="/novini/"]').filter({ has: page.locator('h2') });
    this.categoryTabs = page.getByRole('link', { name: /Всички|Новини|Ревюта|Блог|Ръководства/ });
  }

  async open(): Promise<void> {
    await this.goto('/novini');
  }

  async getArticleCount(): Promise<number> {
    return this.articleCards.count();
  }

  async getArticleTitles(): Promise<string[]> {
    const count = await this.articleCards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.articleCards.nth(i).locator('h2').textContent();
      if (text) titles.push(text.trim());
    }
    return titles;
  }

  async openFirstArticle(): Promise<string> {
    const firstCard = this.articleCards.first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    await this.page.waitForURL(/\/novini\/.+/);
    return href ?? '';
  }

  async filterByCategory(name: string): Promise<void> {
    await this.page.getByRole('link', { name }).click();
    await this.page.waitForLoadState('networkidle');
  }
}
