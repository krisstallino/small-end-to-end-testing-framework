import { expect, test } from '../fixtures/shop';
import { loginAs } from '../business-functions/auth';
import {
  addProductAndReachCheckout,
  continueCheckout,
  enterCustomerInfo,
} from '../business-functions/shopping';
import { generateCustomer } from '../test-data/customer';
import { PRODUCTS } from '../test-data/products';
import { USERS } from '../test-data/users';

const PRODUCT = PRODUCTS.backpack;

test.describe('Problem user', () => {
  test.beforeEach(async ({ shop }) => {
    await loginAs(shop, USERS.problem);
  });

  test('checkout form accepts the customer information as entered', async ({ shop, page }) => {
    test.fail(
      true,
      'Known bug: typing into Last Name overwrites First Name and leaves Last Name empty',
    );

    const customer = generateCustomer();
    await addProductAndReachCheckout(shop, PRODUCT);
    await enterCustomerInfo(shop, customer);

    await test.step('Form holds what was entered', async () => {
      await expect.soft(shop.checkout.firstName).toHaveValue(customer.firstName);
      await expect.soft(shop.checkout.lastName).toHaveValue(customer.lastName);
      await expect.soft(shop.checkout.postalCode).toHaveValue(customer.postalCode);
    });

    await continueCheckout(shop);

    await expect(page).toHaveURL(/checkout-step-two\.html$/);
  });
});
