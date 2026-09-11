import { expect, test } from '../fixtures/shop';
import { loginAs } from '../business-functions/auth';
import {
  addProductAndReachCheckout,
  addProductToCart,
  fillCustomerInfo,
  finishCheckout,
  removeProductFromInventory,
} from '../business-functions/shopping';
import { generateCustomer } from '../test-data/customer';
import { PRODUCTS } from '../test-data/products';
import { USERS } from '../test-data/users';

const PRODUCT = PRODUCTS.backpack;

test.describe('Error user', () => {
  test.beforeEach(async ({ shop }) => {
    await loginAs(shop, USERS.error);
  });

  test('finishing the checkout confirms the order', async ({ shop, page }) => {
    test.fail(true, 'Known bug: Finish throws an uncaught error and the order silently stalls');

    await addProductAndReachCheckout(shop, PRODUCT);
    await fillCustomerInfo(shop, generateCustomer());

    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await finishCheckout(shop);

    await test.step('Order is confirmed without script errors', async () => {
      await expect.soft(page).toHaveURL(/checkout-complete\.html$/);
      await expect.soft(shop.checkout.completeContainer).toBeVisible();
      expect(pageErrors).toEqual([]);
    });
  });

  test('removing a product on the inventory page empties the cart', async ({ shop, page }) => {
    test.fail(true, 'Known bug: Remove throws an uncaught error and the item stays in the cart');

    await addProductToCart(shop, PRODUCT);

    await test.step('Item is in the cart', async () => {
      await expect(shop.inventory.cartBadge).toHaveText('1');
    });

    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await removeProductFromInventory(shop, PRODUCT);

    await test.step('Cart is empty without script errors', async () => {
      await expect.soft(shop.inventory.cartBadge).toHaveCount(0);
      await expect.soft(shop.inventory.addToCartButton(PRODUCT.slug)).toBeVisible();
      expect(pageErrors).toEqual([]);
    });
  });
});
