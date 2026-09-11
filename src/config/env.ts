function loadDotEnvIfPresent(): void {
  try {
    process.loadEnvFile();
  } catch {
    // No .env file.
  }
}

loadDotEnvIfPresent();

export const env = {
  baseURL: process.env['BASE_URL'] || 'https://www.saucedemo.com',
  isCI: !!process.env['CI'],
  standardUser: process.env['SAUCEDEMO_USER'] || 'standard_user',
  lockedOutUser: process.env['SAUCEDEMO_LOCKED_OUT_USER'] || 'locked_out_user',
  problemUser: process.env['SAUCEDEMO_PROBLEM_USER'] || 'problem_user',
  errorUser: process.env['SAUCEDEMO_ERROR_USER'] || 'error_user',
  password: process.env['SAUCEDEMO_PASSWORD'] || 'secret_sauce',
} as const;
