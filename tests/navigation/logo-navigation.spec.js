// spec: specs/eventbrite.test.plan.md (1.6)

const { test, expect } = require('../../fixtures/homePage.fixture');

test.describe('Navigation', () => {
  test('1.6 Eventbrite logo returns to the homepage', async ({ homePage, page }) => {
    await homePage.gotoCityEvents('co--denver');
    await expect(page).toHaveURL(/\/d\/co--denver\//);

    await homePage.homeLink.click();

    await expect(page).toHaveURL(/^https:\/\/www\.eventbrite\.com\/?(\?.*)?$/);
    await expect(homePage.searchInput).toBeVisible();
  });
});
