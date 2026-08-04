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
    // Both search inputs are in <header>; first() is the desktop variant (visible at 1280px)
    this.searchInput = page.getByLabel('Търси настолна игра').first();
    this.searchSubmitBtn = page.getByRole('button', { name: 'Търси' }).first();
    this.gameCards = page.locator('a[href*="/igri/"]').filter({ has: page.locator('h3') });
    // <h1> also shows this text when count=0; target the <p> inside the empty-state block
    this.emptyState = page.locator('p').filter({ hasText: /^Няма намерени игри$/ });
    this.resultsHeading = page.getByRole('heading', { level: 2 });
  }

  async open(query?: string): Promise<void> {
    const url = query ? `/igri?q=${encodeURIComponent(query)}` : '/igri';
    await this.page.goto(url, { timeout: 120_000 });
    // GameGrid is SSR-rendered (not in Suspense), visible immediately after goto()
    if (!query) {
      await this.gameCards.first().waitFor({ state: 'visible', timeout: 120_000 });
    }
  }

  async search(query: string): Promise<void> {
    // Navigate directly to avoid a second 90s SSR round-trip through the form
    await this.open(query);
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
