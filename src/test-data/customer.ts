import { faker } from '@faker-js/faker';

export interface Customer {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
}

export function generateCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    ...overrides,
  };
}
