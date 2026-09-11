import { expect, test } from '../fixtures/shop';
import { loginAs } from '../business-functions/auth';
import {
  addProductAndReachCheckout,
  addProductToCart,
  fillCustomerInfo,
  openCart,
  startCheckout,
  submitOrder,
} from '../business-functions/shopping';
import { generateCustomer } from '../test-data/customer';
import { PRODUCTS, TAX_RATE } from '../test-data/products';
import { USERS } from '../test-data/users';
import { parseMoney, roundHalfUpToCents } from '../utils/money';

const PRODUCT = PRODUCTS.backpack;

test.describe('Purchase journey', () => {
  test.beforeEach(async ({ shop }) => {
    await loginAs(shop, USERS.standard);
  });

  test('completes a purchase from login to order confirmation', async ({ shop, page }) => {
    await test.step('Inventory is available after login', async () => {
      await expect(shop.inventory.items.first()).toBeVisible();
    });

    await addProductAndReachCheckout(shop, PRODUCT);
    await fillCustomerInfo(shop, generateCustomer());

    await test.step('Order summary is complete', async () => {
      await expect(shop.checkout.summary).toBeVisible();
      await expect(shop.checkout.paymentInfo).not.toBeEmpty();
      await expect(shop.checkout.shippingInfo).not.toBeEmpty();
    });

    await submitOrder(shop);

    await test.step('Order is confirmed', async () => {
      await expect(page).toHaveURL(/checkout-complete\.html$/);
      await expect(shop.checkout.completeContainer).toBeVisible();
      await expect(shop.checkout.completeHeader).not.toBeEmpty();
    });
  });

  test('cart shows the same product and price as the catalogue', async ({ shop }) => {
    const listed = await test.step('Read the catalogue entry', async () => ({
      name: await shop.inventory.itemName(PRODUCT.slug).innerText(),
      price: await shop.inventory.itemPrice(PRODUCT.slug).innerText(),
    }));

    await addProductToCart(shop, PRODUCT);
    await openCart(shop);

    await test.step('Cart matches the catalogue', async () => {
      await expect(shop.cart.items).toHaveCount(1);
      await expect(shop.cart.itemNames).toHaveText(listed.name);
      await expect(shop.cart.itemPrices).toHaveText(listed.price);
      await expect(shop.cart.itemQuantities).toHaveText('1');
    });
  });

  test('order summary totals are arithmetically correct', async ({ shop }) => {
    const listedPrice = await test.step('Read the catalogue price', async () =>
      parseMoney(await shop.inventory.itemPrice(PRODUCT.slug).innerText()));

    await addProductAndReachCheckout(shop, PRODUCT);
    await fillCustomerInfo(shop, generateCustomer());

    const totals = await test.step('Read the order totals', async () => {
      await expect(shop.checkout.summary).toBeVisible();
      return {
        subtotal: parseMoney(await shop.checkout.subtotalLabel.innerText()),
        tax: parseMoney(await shop.checkout.taxLabel.innerText()),
        total: parseMoney(await shop.checkout.totalLabel.innerText()),
      };
    });

    expect(totals.subtotal).toBe(listedPrice);
    expect(roundHalfUpToCents(totals.subtotal + totals.tax)).toBe(totals.total);
    expect(totals.tax).toBe(roundHalfUpToCents(totals.subtotal * TAX_RATE));
  });

  test('cart badge appears only while the cart holds items', async ({ shop }) => {
    await test.step('Badge is absent while the cart is empty', async () => {
      await expect(shop.inventory.cartBadge).toHaveCount(0);
    });

    await addProductToCart(shop, PRODUCT);

    await test.step('Badge counts the added item', async () => {
      await expect(shop.inventory.cartBadge).toHaveText('1');
    });

    await openCart(shop);
    await startCheckout(shop);
    await fillCustomerInfo(shop, generateCustomer());
    await submitOrder(shop);

    await test.step('Badge clears once the order completes', async () => {
      await expect(shop.checkout.cartBadge).toHaveCount(0);
    });
  });
});
