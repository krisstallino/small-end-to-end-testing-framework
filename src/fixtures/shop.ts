import { test as base } from '@playwright/test';
import { CartPage, CheckoutPage, InventoryPage, LoginPage } from '../poms';

export interface ShopPages {
  login: LoginPage;
  inventory: InventoryPage;
  cart: CartPage;
  checkout: CheckoutPage;
}

export const test = base.extend<{ shop: ShopPages }>({
  shop: async ({ page }, use) => {
    await use({
      login: new LoginPage(page),
      inventory: new InventoryPage(page),
      cart: new CartPage(page),
      checkout: new CheckoutPage(page),
    });
  },
});

export { expect } from '@playwright/test';
