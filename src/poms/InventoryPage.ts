import type { Locator, Page } from '@playwright/test';
import { BasePage } from './_base/BasePage';

export class InventoryPage extends BasePage {
  readonly path = '/inventory.html';

  readonly list: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.list = page.getByTestId('inventory-list');
    this.items = page.getByTestId('inventory-item');
  }

  /** getByTestId, not a CSS selector: one slug contains `.`, `(` and `)`. */
  addToCartButton(slug: string): Locator {
    return this.page.getByTestId(`add-to-cart-${slug}`);
  }

  removeButton(slug: string): Locator {
    return this.page.getByTestId(`remove-${slug}`);
  }

  /** Scoped by slug rather than by visible name, so renames do not break it. */
  itemBySlug(slug: string): Locator {
    return this.items.filter({ has: this.addToCartButton(slug) });
  }

  itemName(slug: string): Locator {
    return this.itemBySlug(slug).getByTestId('inventory-item-name');
  }

  itemPrice(slug: string): Locator {
    return this.itemBySlug(slug).getByTestId('inventory-item-price');
  }
}
