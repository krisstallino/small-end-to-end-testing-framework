import type { Locator, Page } from '@playwright/test';
import { BasePage } from './_base/BasePage';

export class CartPage extends BasePage {
  readonly path = '/cart.html';

  readonly list: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.list = page.getByTestId('cart-list');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemQuantities = page.getByTestId('item-quantity');
    this.checkoutButton = page.getByTestId('checkout');
  }
}
