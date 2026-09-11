import { expect, test } from '../fixtures/shop';
import { dismissLoginError, submitLogin } from '../business-functions/auth';
import type { Credentials } from '../test-data/users';
import { INVALID_CREDENTIALS, USERS } from '../test-data/users';
import { AUTH_ERROR } from '../test-data/errors';

interface RejectionCase {
  readonly description: string;
  readonly credentials: Credentials;
  readonly expectedError: string;
}

const REJECTION_CASES: readonly RejectionCase[] = [
  {
    description: 'a locked-out account',
    credentials: USERS.lockedOut,
    expectedError: AUTH_ERROR.LOCKED_OUT,
  },
  {
    description: 'an unknown username',
    credentials: INVALID_CREDENTIALS.unknownUser,
    expectedError: AUTH_ERROR.BAD_CREDENTIALS,
  },
  {
    description: 'a valid username with the wrong password',
    credentials: INVALID_CREDENTIALS.wrongPassword,
    expectedError: AUTH_ERROR.BAD_CREDENTIALS,
  },
  {
    description: 'an empty username',
    credentials: INVALID_CREDENTIALS.emptyUsername,
    expectedError: AUTH_ERROR.USERNAME_REQUIRED,
  },
  {
    description: 'an empty password',
    credentials: INVALID_CREDENTIALS.emptyPassword,
    expectedError: AUTH_ERROR.PASSWORD_REQUIRED,
  },
];

test.describe('Login rejection', () => {
  for (const { description, credentials, expectedError } of REJECTION_CASES) {
    test(`refuses ${description}`, async ({ shop, page }) => {
      await submitLogin(shop, credentials);

      await expect(shop.login.errorContainer).toBeVisible();
      await expect(shop.login.errorMessage).toBeVisible();
      await expect(shop.login.erroredInputs).toHaveCount(2);
      await expect(page).toHaveURL(shop.login.path);

      await expect(shop.login.errorMessage).toHaveText(expectedError);
    });
  }

  test('dismissing the error clears the failure state', async ({ shop }) => {
    await submitLogin(shop, USERS.lockedOut);
    await expect(shop.login.errorMessage).toBeVisible();
    await expect(shop.login.erroredInputs).toHaveCount(2);

    await dismissLoginError(shop);

    await expect(shop.login.errorMessage).toHaveCount(0);
    await expect(shop.login.erroredInputs).toHaveCount(0);
  });
});
