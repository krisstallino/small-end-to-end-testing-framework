import type { Locator, Page } from '@playwright/test';
import { BasePage } from './_base/BasePage';

export class LoginPage extends BasePage {
  readonly path = '/';

  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorDismissButton: Locator;
  /** A CSS class, not a data-test attribute. */
  readonly errorContainer: Locator;
  readonly erroredInputs: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
    this.errorDismissButton = page.getByTestId('error-button');
    this.errorContainer = page.locator('.error-message-container.error');
    this.erroredInputs = page.locator('input.error');
  }
}
