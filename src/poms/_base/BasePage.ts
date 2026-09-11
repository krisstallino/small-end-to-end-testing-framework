import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  abstract readonly path: string;

  protected readonly page: Page;
  readonly cartLink: Locator;
  /** Absent from the DOM when the cart is empty, not rendered as "0". */
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
