import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class GamesPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmitBtn: Locator;
  readonly gameCards: Locator;
  readonly emptyState: Locator;
  readonly resultsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByLabel('Търси настолна игра');
    this.searchSubmitBtn = page.getByRole('button', { name: 'Търси' });
    this.gameCards = page.locator('a[href*="/igri/"]').filter({ has: page.locator('h3') });
    this.emptyState = page.getByText('Няма намерени игри');
    this.resultsHeading = page.getByRole('heading', { level: 2 });
  }

  async open(): Promise<void> {
    await this.page.goto('/igri', { waitUntil: 'domcontentloaded' });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchSubmitBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getGameCardCount(): Promise<number> {
    return this.gameCards.count();
  }

  async getFirstGameTitle(): Promise<string> {
    return (await this.gameCards.first().locator('h3').textContent()) ?? '';
  }

  async clickFirstGame(): Promise<void> {
    await this.gameCards.first().click();
    await this.page.waitForURL(/\/igri\/.+/);
  }
}
