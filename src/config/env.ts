function loadDotEnvIfPresent(): void {
  try {
    process.loadEnvFile();
  } catch {
    // No .env file.
  }
}

loadDotEnvIfPresent();

/** `||` not `??`: an empty value in .env or an unset CI secret must fall through. */
export const env = {
  baseURL: process.env['BASE_URL'] || 'https://www.saucedemo.com',
  isCI: !!process.env['CI'],
  standardUser: process.env['SAUCEDEMO_USER'] || 'standard_user',
  lockedOutUser: process.env['SAUCEDEMO_LOCKED_OUT_USER'] || 'locked_out_user',
  password: process.env['SAUCEDEMO_PASSWORD'] || 'secret_sauce',
} as const;
