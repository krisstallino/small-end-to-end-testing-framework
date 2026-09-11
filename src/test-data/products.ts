export interface Product {
  /** The `data-test` slug in `add-to-cart-<slug>` / `remove-<slug>`. */
  readonly slug: string;
}

export const PRODUCTS = {
  backpack: { slug: 'sauce-labs-backpack' },
  bikeLight: { slug: 'sauce-labs-bike-light' },
  boltTShirt: { slug: 'sauce-labs-bolt-t-shirt' },
  fleeceJacket: { slug: 'sauce-labs-fleece-jacket' },
  onesie: { slug: 'sauce-labs-onesie' },
  redTShirt: { slug: 'test.allthethings()-t-shirt-(red)' },
} as const satisfies Record<string, Product>;

export const TAX_RATE = 0.08;
