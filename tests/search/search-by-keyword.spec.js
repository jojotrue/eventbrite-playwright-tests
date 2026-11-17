// spec: specs/eventbrite.test.plan.md (2.1)

const { test, expect } = require('../../fixtures/homePage.fixture');

test.describe('Search', () => {
  test('2.1 Keyword search opens matching results', async ({ homePage, page }) => {
    await expect(homePage.searchInput).toBeVisible();

    await homePage.searchFor('music');

    await expect(page).toHaveURL(/music/);
    await expect(homePage.listingHeading).toBeVisible();
    await expect(homePage.searchInput).toHaveValue('music');
  });
});
