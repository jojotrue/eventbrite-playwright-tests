// spec: specs/eventbrite.test.plan.md (1.1)

const { test, expect } = require('../../fixtures/homePage.fixture');

test.describe('Navigation', () => {
  test('1.1 Music category link opens music or concert listings', async ({ homePage, page }) => {
    // "For Concerts" or "Music", depending on which homepage version Eventbrite serves
    await expect(homePage.musicCategoryLink).toBeVisible();

    await homePage.musicCategoryLink.click();

    await expect(page).toHaveURL(/concerts|music/);
    await expect(homePage.listingHeading).toContainText(/concert|music/i);
  });
});
