import { test } from '@playwright/test';
import type { Customer } from '../test-data/customer';
import type { Product } from '../test-data/products';
import type { ShopPages } from '../fixtures/shop';

export async function addProductToCart(shop: ShopPages, product: Product): Promise<void> {
  await test.step(`Add "${product.slug}" to the cart`, async () => {
    await shop.inventory.addToCartButton(product.slug).click();
  });
}

export async function removeProductFromInventory(shop: ShopPages, product: Product): Promise<void> {
  await test.step(`Remove "${product.slug}" from the inventory page`, async () => {
    await shop.inventory.removeButton(product.slug).click();
  });
}

export async function openCart(shop: ShopPages): Promise<void> {
  await test.step('Open the cart', async () => {
    await shop.inventory.cartLink.click();
    await shop.cart.list.waitFor({ state: 'visible' });
  });
}

export async function startCheckout(shop: ShopPages): Promise<void> {
  await test.step('Start checkout', async () => {
    await shop.cart.checkoutButton.click();
    await shop.checkout.firstName.waitFor({ state: 'visible' });
  });
}

export async function enterCustomerInfo(shop: ShopPages, customer: Customer): Promise<void> {
  await test.step('Enter customer information', async () => {
    await shop.checkout.firstName.fill(customer.firstName);
    await shop.checkout.lastName.fill(customer.lastName);
    await shop.checkout.postalCode.fill(customer.postalCode);
  });
}

export async function continueCheckout(shop: ShopPages): Promise<void> {
  await test.step('Continue to the order summary', async () => {
    await shop.checkout.continueButton.click();
  });
}

export async function fillCustomerInfo(shop: ShopPages, customer: Customer): Promise<void> {
  await test.step('Submit customer information', async () => {
    await enterCustomerInfo(shop, customer);
    await continueCheckout(shop);
  });
}

export async function finishCheckout(shop: ShopPages): Promise<void> {
  await test.step('Finish the checkout', async () => {
    await shop.checkout.finishButton.click();
  });
}

export async function submitOrder(shop: ShopPages): Promise<void> {
  await test.step('Submit the order', async () => {
    await finishCheckout(shop);
    await shop.checkout.completeContainer.waitFor({ state: 'visible' });
  });
}

export async function addProductAndReachCheckout(shop: ShopPages, product: Product): Promise<void> {
  await test.step('Add a product and reach the checkout form', async () => {
    await addProductToCart(shop, product);
    await openCart(shop);
    await startCheckout(shop);
  });
}
