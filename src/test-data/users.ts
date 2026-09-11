import { env } from '../config/env';

export interface Credentials {
  readonly username: string;
  readonly password: string;
}

export const USERS = {
  standard: { username: env.standardUser, password: env.password },
  lockedOut: { username: env.lockedOutUser, password: env.password },
  problem: { username: env.problemUser, password: env.password },
  error: { username: env.errorUser, password: env.password },
} as const satisfies Record<string, Credentials>;

export const INVALID_CREDENTIALS = {
  unknownUser: { username: 'no_such_user', password: env.password },
  wrongPassword: { username: env.standardUser, password: 'not_the_password' },
  emptyUsername: { username: '', password: env.password },
  emptyPassword: { username: env.standardUser, password: '' },
} as const satisfies Record<string, Credentials>;
