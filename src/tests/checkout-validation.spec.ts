import { expect, test } from '../fixtures/shop';
import { loginAs } from '../business-functions/auth';
import { addProductAndReachCheckout, fillCustomerInfo } from '../business-functions/shopping';
import type { Customer } from '../test-data/customer';
import { generateCustomer } from '../test-data/customer';
import { CHECKOUT_ERROR } from '../test-data/errors';
import { PRODUCTS } from '../test-data/products';
import { USERS } from '../test-data/users';

interface ValidationCase {
  readonly blankField: string;
  /** Applied to an otherwise valid customer, so exactly one field is empty. */
  readonly blank: Partial<Customer>;
  readonly expectedError: string;
}

const VALIDATION_CASES: readonly ValidationCase[] = [
  {
    blankField: 'first name',
    blank: { firstName: '' },
    expectedError: CHECKOUT_ERROR.FIRST_NAME_REQUIRED,
  },
  {
    blankField: 'last name',
    blank: { lastName: '' },
    expectedError: CHECKOUT_ERROR.LAST_NAME_REQUIRED,
  },
  {
    blankField: 'postal code',
    blank: { postalCode: '' },
    expectedError: CHECKOUT_ERROR.POSTAL_CODE_REQUIRED,
  },
];

test.describe('Checkout form validation', () => {
  test.beforeEach(async ({ shop }) => {
    await loginAs(shop, USERS.standard);
    await addProductAndReachCheckout(shop, PRODUCTS.backpack);
  });

  for (const { blankField, blank, expectedError } of VALIDATION_CASES) {
    test(`rejects a submission with a blank ${blankField}`, async ({ shop, page }) => {
      await fillCustomerInfo(shop, generateCustomer(blank));

      await test.step(`Rejected, naming the ${blankField}`, async () => {
        await expect(shop.checkout.errorContainer).toBeVisible();
        await expect(page).toHaveURL(/checkout-step-one\.html$/);
        await expect(shop.checkout.errorMessage).toHaveText(expectedError);
      });
    });
  }
});
