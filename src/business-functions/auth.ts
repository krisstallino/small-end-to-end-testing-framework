import { test } from '@playwright/test';
import type { Credentials } from '../test-data/users';
import type { ShopPages } from '../fixtures/shop';

/** Submits the form without waiting for success, so rejection cases can use it too. */
export async function submitLogin(shop: ShopPages, credentials: Credentials): Promise<void> {
  await test.step(`Submit login as "${credentials.username}"`, async () => {
    await shop.login.goto();
    await shop.login.username.fill(credentials.username);
    await shop.login.password.fill(credentials.password);
    await shop.login.loginButton.click();
  });
}

export async function loginAs(shop: ShopPages, credentials: Credentials): Promise<void> {
  await test.step(`Log in as "${credentials.username}"`, async () => {
    await submitLogin(shop, credentials);
    await shop.inventory.list.waitFor({ state: 'visible' });
  });
}

export async function dismissLoginError(shop: ShopPages): Promise<void> {
  await test.step('Dismiss the login error', async () => {
    await shop.login.errorDismissButton.click();
  });
}
