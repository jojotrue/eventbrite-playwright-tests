class HomePage {
  constructor(page) {
    this.page = page;

    // Header (the same on every page and every homepage version)
    this.homeLink = page.getByTestId('global-nav').getByRole('link', { name: 'Home' });
    this.searchInput = page.getByRole('searchbox', { name: /search events/i });
    this.searchButton = page.getByRole('button', { name: /search button/i });

    // Music category link. Eventbrite serves different homepage versions:
    // some label it "For Concerts", others "Music". Either one counts.
    this.musicCategoryLink = page.getByRole('link', { name: /^(For Concerts|Music)$/ });

    // Listing pages: some Eventbrite pages render more than one h1, so the main heading is the first one
    this.listingHeading = page.getByRole('heading', { level: 1 }).first();
  }

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  // Opens a city listing directly, e.g. 'co--denver', so results don't depend on where the runner is located
  async gotoCityEvents(citySlug) {
    await this.goto(`/d/${citySlug}/events/`);
  }

  async searchFor(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }
}

module.exports = HomePage;
