# Eventbrite Playwright Tests

![Playwright Tests](https://github.com/jojotrue/eventbrite-playwright-tests/actions/workflows/playwright.yml/badge.svg)

End-to-end tests for [Eventbrite.com](https://www.eventbrite.com) written in Playwright and JavaScript, using the Page Object Model and a custom fixture. The tests were drafted with AI test agents, then reviewed, corrected, and re-verified by hand against the live site in November 2026.

This repo is mostly about that review. The generated tests passed without testing anything, and the live site changed underneath them. Both problems, and how I handled them, are documented below.

---

## What's Covered

| Plan ID | Test | What it checks |
|---------|------|----------------|
| 1.1 | Music category | Clicking the homepage's music category ("For Concerts" or "Music") opens a music or concert listing |
| 1.6 | Logo navigation | From the Denver events page, the header logo returns to the homepage |
| 2.1 | Keyword search | Searching "music" opens matching results and keeps the keyword in the search box |

The full test plan, with implementation status, is in [specs/eventbrite.test.plan.md](specs/eventbrite.test.plan.md).

**Last verified:** November 2026, Chromium.

---

## Project Structure

```
eventbrite-playwright-tests/
├── .github/
│   ├── agents/                      # Playwright test agent definitions (planner, generator, healer)
│   └── workflows/playwright.yml     # GitHub Actions CI
├── fixtures/
│   └── homePage.fixture.js          # Extends Playwright's test with a ready-to-use HomePage
├── pages/
│   └── homePage.js                  # Page Object Model
├── specs/
│   └── eventbrite.test.plan.md      # Test plan with implementation status
├── tests/
│   ├── navigation/concerts-category.spec.js
│   ├── navigation/logo-navigation.spec.js
│   ├── search/search-by-keyword.spec.js
│   └── eventbrite.seed.spec.js      # Scaffold for the generator agent (excluded from runs)
└── playwright.config.js
```

---

## Design

**Page Object Model.** `pages/homePage.js` holds every locator and action the tests use. Locators are role-based (`getByRole`) so they follow what a user sees rather than CSS classes. The header logo is scoped to Eventbrite's `global-nav` test ID, because city pages also have a "Home" breadcrumb link.

**Custom fixture.** `fixtures/homePage.fixture.js` creates the page object and opens the homepage before each test.

**Stable elements only.** Eventbrite serves different homepage versions at random (see below). The tests use only elements present on every version: the header logo, the search bar, and the music category link, which accepts either of its two labels.

---

## AI-Assisted Workflow and Review

The first drafts came from Playwright's three test agents:

| Agent | Role |
|-------|------|
| Planner | Explored the site and wrote the test plan |
| Generator | Wrote spec files from the plan using the page object and fixture |
| Healer | Suggested fixes when tests failed |

The generated suite ran green but did not test what it claimed to. These are the problems I found in review and how I fixed them:

| Problem in the generated code | Fix |
|-------------------------------|-----|
| `music-category.spec.js` was a copy of the Find Events test, with the same title, and never clicked Music | Rewrote it to click the music category and check the URL and heading |
| Neighborhood checks were wrapped in `try/catch` and `if` blocks, so the test passed when the section never loaded | Rewrote with required assertions; later removed the test when the section stopped appearing reliably (see below) |
| Breadcrumb checks ran only "if present," so they could never fail | Removed; breadcrumbs don't appear consistently |
| Assertions were loosened to get green builds (for example, a heading text check was dropped) | Restored meaningful assertions on URLs and headings |
| Fixed waits (`waitForTimeout`) used to paper over timing | Replaced with Playwright's auto-waiting assertions |
| A browser flag to hide automation from Eventbrite's bot detection | Removed; the tests don't try to get around a site's protections |
| Debug `console.log` statements left in tests | Removed |
| The empty seed spec ran as a passing test | Excluded from runs with `testIgnore` |
| The README described page object methods and coverage that didn't exist | Rewrote the README to match the code |

---

## Site Changes Found During Re-verification (November 2026)

When I re-ran the corrected tests, three failed. The page snapshots in Playwright's error reports showed the site had changed, not the tests:

- **The "Find Events" header link was removed.** Test 1.7 was dropped.
- **Eventbrite serves at least three homepage versions at random.** One is attendee-focused ("Find your next favorite thing"), one is organizer-focused ("Sell tickets Where Millions already Buy them"), and one leads with category links ("Browsing events in"). Content like the Top destinations carousel exists on only some of them, so tests built on it would pass or fail depending on which version loaded.
- **The music category has two labels.** It's "For Concerts" on some versions and "Music" on others. Test 1.1 accepts either, and still checks that the click leads to a music or concert listing.
- **The "Explore by neighborhood" section is no longer consistently present.** Test 3.5 was dropped.
- **City pages now include a "Home" breadcrumb,** which made the logo locator ambiguous. It's now scoped to the header.

I updated the tests to match the current site rather than loosening assertions until they passed.

---

## Running the Tests

**Prerequisites:** Node.js 18 or later.

```bash
git clone https://github.com/jojotrue/eventbrite-playwright-tests.git
cd eventbrite-playwright-tests
npm install
npx playwright install chromium

npm test                  # run all tests
npm run test:headed       # watch the browser
npm run report            # open the last HTML report
```

---

## CI

GitHub Actions runs the suite on pull requests to `main` and on demand (`workflow_dispatch`). There are no scheduled runs, because the tests hit the live Eventbrite site, which changes without notice. The badge shows the result of the last deliberate run. Each run uploads the HTML report as an artifact, and pull request runs post a pass/fail comment.

---

## Limitations

- **Live third-party site.** Eventbrite will keep changing. These tests reflect the site as of November 2026, and a future failure is more likely a site change than a defect.
- **Bot protection.** Eventbrite may challenge automated traffic, especially from CI servers. The suite does not try to bypass this.
- **Chromium only.** Firefox and WebKit are not configured.

---

## Author

Joanne Trujillo · [GitHub](https://github.com/jojotrue) · [LinkedIn](https://linkedin.com/in/joanne-trujillo)
