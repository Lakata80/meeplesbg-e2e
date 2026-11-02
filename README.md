# MeeplesBG E2E Testing Framework

[![E2E Tests](https://github.com/Lakata80/meeplesbg-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/Lakata80/meeplesbg-e2e/actions/workflows/e2e.yml)

End-to-end test suite for [meeplesbg.com](https://meeplesbg.com) built with **Playwright** and **TypeScript**, following the **Page Object Model** pattern.

**Quick start** (no credentials needed for public tests):

```sh
npm ci && npx playwright install chromium && npx playwright test --project=chromium
```

See [Setup](#setup) for the authenticated profile tests.

## What this demonstrates

- **Page Object Model** with a shared `BasePage` capturing cookie banners and navigation helpers
- An **auth `setup` project** that logs in once and reuses `storageState` across all authenticated tests
- **Safe read-only testing against a live production site** — no data is created or modified
- A **CI quality gate** (typecheck → lint → format check) that runs before the E2E suite, plus HTML reports and failure artifacts

## Tech Stack

| Tool                                 | Version  | Purpose                          |
| ------------------------------------ | -------- | -------------------------------- |
| [Playwright](https://playwright.dev) | ^1.62    | Browser automation & test runner |
| TypeScript                           | ^5       | Type-safe test authoring         |
| Node.js                              | >=22     | Runtime                          |
| ESLint + typescript-eslint           | ^10 / ^8 | Static analysis                  |
| Prettier                             | ^3       | Code formatting                  |

## Project Structure

```
meeplesbg-e2e/
├── playwright.config.ts       # Multi-project Playwright config
├── pages/                     # Page Object Models
│   ├── BasePage.ts            # Shared navigation, cookie helpers
│   ├── HomePage.ts
│   ├── GamesPage.ts
│   ├── GameDetailPage.ts
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
│   │   ├── game-search.spec.ts
│   │   └── game-detail.spec.ts  # Expansions section
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
npm ci

# 2. Install browsers
npx playwright install chromium

# 3. Configure environment (only needed for authenticated tests)
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

| Project         | Description                                         |
| --------------- | --------------------------------------------------- |
| `setup`         | Logs in once and saves session to `.auth/user.json` |
| `chromium`      | Runs all public-page tests (no auth required)       |
| `chromium-auth` | Runs profile tests using the saved session          |

## Page Object Model

Each page class extends `BasePage` and encapsulates:

- **Locators** — typed `Locator` properties for page elements
- **Actions** — async methods for user interactions (`login()`, `search()`, etc.)

Example:

```typescript
// pages/GamesPage.ts
export class GamesPage extends BasePage {
  readonly searchInput = this.page.getByLabel('Търси настолна игра');
  readonly gameCards = this.page
    .locator('a[href*="/igri/"]')
    .filter({ has: this.page.locator('h3') });

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

| Variable             | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `BASE_URL`           | Base URL to test against (default: `https://meeplesbg.com`) |
| `TEST_USER_EMAIL`    | Email of the dedicated test account                         |
| `TEST_USER_PASSWORD` | Password of the dedicated test account                      |

> **Never commit `.env`** — it is gitignored. Use `.env.example` as the template.

## CI/CD

The repository includes a single GitHub Actions workflow: [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml).

| Property     | Value                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| Trigger      | Push and pull requests to `main` / `master`; manual (`workflow_dispatch`) |
| Runner       | `ubuntu-latest`                                                           |
| Node         | 22                                                                        |
| Browser      | Chromium                                                                  |
| Quality gate | typecheck → lint → format check (must pass before E2E runs)               |
| Credentials  | Injected via GitHub Secrets (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`)     |
| Artifacts    | HTML report (30 days) + failure screenshots / traces (7 days)             |

**Why tests run against production:** meeplesbg.com has no staging or development environment — there is only one live instance. All tests use a dedicated test account and execute only read operations (browsing, searching, viewing profile). No content is created and no real user data is touched. This is a deliberate trade-off: accepted risk of minor production load vs. the cost of maintaining a full staging clone.

## Design Decisions

**Why Playwright over Cypress?**
Playwright's TypeScript support is first-class, its `setup` project makes single-login-per-run trivial via `storageState`, its auto-waiting semantics eliminate most flakiness, and the built-in trace viewer gives full step-by-step replay of any failure without extra tooling.

**Why TypeScript?**
Page objects are contracts between the test layer and the UI. TypeScript enforces those contracts at compile time — a renamed method or wrong argument type is a build error, not a silent runtime failure at 2 AM.

**Why Page Object Model?**
POM decouples locator maintenance from test logic. When the site updates a selector, one file changes (`pages/GamesPage.ts`), not every test that touches that element. `BasePage` captures shared behaviour (cookie banner, navigation) once, inherited everywhere.

**Why the `setup` project pattern?**
Logging in once per run and reusing `.auth/user.json` cuts auth setup time from O(n tests) to O(1). Playwright's built-in `storageState` makes session reuse safe across parallel workers.

## Test Coverage

| Area         | Tests                          | Auth Required |
| ------------ | ------------------------------ | ------------- |
| Homepage     | Hero, navigation, logo         | No            |
| Games list   | Cards, pagination              | No            |
| Game search  | MeiliSearch, empty state       | No            |
| Game detail  | Expansions section             | No            |
| Top rankings | Categories, navigation         | No            |
| News         | Articles, category filters     | No            |
| Profile      | Collection, BGG import, logout | **Yes**       |

31 tests across 8 spec files.

## Known limitations

- The site has no staging environment, so tests run against production. They are read-only, but live data such as the news list and rankings changes over time — tests assert structure and behaviour rather than exact content.
- CI runs Chromium only.
- The CI runner uses `workers: 1` to keep load on the production site low.

## Author

**Lazar Endarov** — QA / Quality Engineering Lead · [LinkedIn](https://www.linkedin.com/in/lazar-endarov-32b27b3a/)

## License

MIT
