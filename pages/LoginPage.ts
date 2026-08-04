import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly errorMessage: Locator;
  readonly loginTab: Locator;
  readonly registerTab: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Имейл');
    this.passwordInput = page.getByLabel('Парола');
    this.submitBtn = page.getByRole('button', { name: 'Влез' });
    this.errorMessage = page.locator('.rounded-xl.bg-red-50');
    this.loginTab = page.getByRole('button', { name: 'Вход' });
    this.registerTab = page.getByRole('button', { name: 'Регистрация' });
  }

  async open(): Promise<void> {
    await this.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginTab.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage.first().textContent()) ?? '';
  }
}
