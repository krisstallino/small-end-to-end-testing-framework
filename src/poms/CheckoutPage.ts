import type { Locator, Page } from '@playwright/test';
import { BasePage } from './_base/BasePage';

export class CheckoutPage extends BasePage {
  readonly path = '/checkout-step-one.html';

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  /** A CSS class, not a data-test attribute. */
  readonly errorContainer: Locator;

  readonly summary: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly finishButton: Locator;

  readonly completeContainer: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
    this.errorContainer = page.locator('.error-message-container.error');

    this.summary = page.getByTestId('checkout-summary-container');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.paymentInfo = page.getByTestId('payment-info-value');
    this.shippingInfo = page.getByTestId('shipping-info-value');
    this.finishButton = page.getByTestId('finish');

    this.completeContainer = page.getByTestId('checkout-complete-container');
    this.completeHeader = page.getByTestId('complete-header');
  }
}
