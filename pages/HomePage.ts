import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSearchBar: Locator;
  readonly quizCta: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('section').first();
    this.heroTitle = page.getByRole('heading', { level: 1 });
    this.heroSearchBar = page.getByPlaceholder('Търси игра по заглавие...');
    this.quizCta = page.getByRole('link', { name: /Квиз/ }).first();
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async getHeroTitleText(): Promise<string> {
    return (await this.heroTitle.textContent()) ?? '';
  }

  async getVisibleGameSectionHeadings(): Promise<string[]> {
    const headings = this.page.getByRole('heading', { level: 2 });
    const count = await headings.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  async searchForGame(query: string): Promise<void> {
    await this.heroSearchBar.fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForURL(/\/igri/);
  }
}
