import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

const LOCATOR_FACTORIES = [
  'locator',
  'getByTestId',
  'getByRole',
  'getByText',
  'getByLabel',
  'getByPlaceholder',
  'getByTitle',
  'getByAltText',
  '$',
  '$$',
];

const locatorSelector = LOCATOR_FACTORIES.map(
  (name) => `CallExpression[callee.property.name="${name}"]`,
).join(', ');

const UI_ACTIONS = [
  'click',
  'dblclick',
  'fill',
  'type',
  'press',
  'check',
  'uncheck',
  'selectOption',
  'setInputFiles',
  'hover',
  'dragTo',
  'tap',
  'goto',
];

const uiActionSelector = UI_ACTIONS.map(
  (name) => `CallExpression[callee.property.name="${name}"]`,
).join(', ');

export default tseslint.config(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { module: 'writable', require: 'readonly', __dirname: 'readonly' },
    },
  },

  {
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'page',
          property: 'waitForTimeout',
          message:
            'Hard waits cause flake. Wait on a real signal instead: a locator assertion, a response, or a URL change.',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  {
    files: ['src/business-functions/**/*.ts', 'src/tests/**/*.ts', 'src/fixtures/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: locatorSelector,
          message:
            'Locators belong in the POM layer. Add a named locator to the relevant page object and use it here.',
        },
      ],
    },
  },

  {
    files: ['src/business-functions/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['expect'],
              message:
                'Business functions perform actions; specs own the assertions. Return what the spec needs and assert there.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/poms/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['expect'],
              message: 'Page objects expose locators. Assertions belong in specs.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/tests/**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'no-restricted-syntax': [
        'error',
        {
          selector: locatorSelector,
          message:
            'Locators belong in the POM layer. Add a named locator to the relevant page object and use it here.',
        },
        {
          selector: uiActionSelector,
          message:
            'Specs observe; business functions act. Move this interaction into src/business-functions/ and call it from here.',
        },
      ],
      'playwright/no-skipped-test': 'warn',
      'playwright/expect-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
    },
  },
);
