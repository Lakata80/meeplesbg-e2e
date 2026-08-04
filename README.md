# MeeplesBG E2E Testing Framework

End-to-end test suite for [meeplesbg.com](https://meeplesbg.com) built with **Playwright** and **TypeScript**, following the **Page Object Model** pattern.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.62 | Browser automation & test runner |
| TypeScript | ^7 | Type-safe test authoring |
| Node.js | >=22 | Runtime |

## Project Structure

```
meeplesbg-e2e/
├── playwright.config.ts       # Multi-project Playwright config
├── pages/                     # Page Object Models
│   ├── BasePage.ts            # Shared navigation, cookie helpers
│   ├── HomePage.ts
│   ├── GamesPage.ts
│   ├── LoginPage.ts
│   ├── TopPage.ts
│   ├── NewsPage.ts
│   └── ProfilePage.ts
├── tests/
│   ├── auth/
│   │   └── auth.setup.ts      # Saves session state for auth tests
│   ├── home/
│   │   └── home.spec.ts
│   ├── games/
│   │   ├── games-list.spec.ts
│   │   └── game-search.spec.ts
│   ├── top/
│   │   └── top-games.spec.ts
│   ├── news/
│   │   └── news.spec.ts
│   └── profile/               # Requires auth
│       └── profile.spec.ts
└── utils/
    └── test-data.ts           # Shared constants & test data
```

## Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/Lakata80/meeplesbg-e2e.git
cd meeplesbg-e2e
npm install

# 2. Install browsers
npx playwright install chromium

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in TEST_USER_EMAIL and TEST_USER_PASSWORD
```

## Running Tests

```bash
# Run all tests against production (https://meeplesbg.com)
npm test

# Run against local dev server
npm run test:local

# Interactive UI mode (great for debugging)
npm run test:ui

# Run with visible browser
npm run test:headed

# Open HTML report
npm run test:report
```

## Playwright Projects

The config defines three projects:

| Project | Description |
|---------|-------------|
| `setup` | Logs in once and saves session to `.auth/user.json` |
| `chromium` | Runs all public-page tests (no auth required) |
| `chromium-auth` | Runs profile tests using the saved session |

## Page Object Model

Each page class extends `BasePage` and encapsulates:
- **Locators** — typed `Locator` properties for page elements
- **Actions** — async methods for user interactions (`login()`, `search()`, etc.)

Example:

```typescript
// pages/GamesPage.ts
export class GamesPage extends BasePage {
  readonly searchInput = this.page.getByLabel('Търси настолна игра');
  readonly gameCards   = this.page.locator('a[href*="/igri/"]').filter({ has: this.page.locator('h3') });

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.getByRole('button', { name: 'Търси' }).click();
  }
}

// tests/games/game-search.spec.ts
test('searching for "Catan" returns results', async ({ page }) => {
  const gamesPage = new GamesPage(page);
  await gamesPage.open();
  await gamesPage.search('Catan');
  expect(await gamesPage.getGameCardCount()).toBeGreaterThan(0);
});
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BASE_URL` | Base URL to test against (default: `https://meeplesbg.com`) |
| `TEST_USER_EMAIL` | Email of the dedicated test account |
| `TEST_USER_PASSWORD` | Password of the dedicated test account |

> **Never commit `.env`** — it is gitignored. Use `.env.example` as the template.

## Test Coverage

| Area | Tests | Auth Required |
|------|-------|---------------|
| Homepage | Hero, navigation, logo | No |
| Games list | Cards, pagination | No |
| Game search | MeiliSearch, empty state | No |
| Top rankings | Categories, navigation | No |
| News | Articles, category filters | No |
| Profile | Collection, BGG import, logout | **Yes** |

## License

MIT
