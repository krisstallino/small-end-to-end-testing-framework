# Rules for AI coding agents — SauceDemo E2E Suite

Instructions for any AI agent (Claude Code, Codex, Cursor, Copilot, …) working in this repo.
Human contributors: the same rules apply; `README.md` is the tour, this is the rulebook.

TypeScript + Playwright E2E suite for [saucedemo.com](https://www.saucedemo.com). Three-layer
architecture, risk-based test selection, ESLint-enforced boundaries.

Scope decisions are listed at the bottom **with reasons** — read them before "fixing"
something that looks deliberately absent.

## Rules

**1. Locators live in POMs.** Never construct one (`page.locator()`, `getByTestId()`, …) in a
spec, fixture or business function. Use `getByTestId()`, never `[data-test=…]` CSS — the slug
`test.allthethings()-t-shirt-(red)` parses as CSS and silently matches nothing. _(ESLint)_

**2. POMs hold locators, not behaviour.** `readonly` fields declared on the class, assigned in
the constructor from the `page` parameter — not getters, and not field initializers, which
fail with TS2729 in the class declaring `page`. Parameterised locators (`addToCartButton(slug)`)
are methods because they take an argument. No `expect`. _(ESLint)_ No unused locators — ESLint
cannot see across files, so add a locator with its first caller and delete it with its last.
The one exception is `BasePage.goto()`, which navigates to the page's own `path` — a page
knowing its URL is addressing, not behaviour. Do not add a second; anything else a user does is
a business function.

**3. Business functions act, specs observe.**

- Every action a spec performs — click, fill, select, navigate — goes through a business
  function, however small. `dismissLoginError` is one click and still belongs there.
- Specs touch POM locators only to assert and read. Never to drive the UI. _(ESLint)_
- No `expect` in a business function. They synchronise with `waitFor()`. _(ESLint)_
- They take the whole `ShopPages` factory. The fixture is `shop`, not `pages`, so it cannot
  be misread as Playwright's `page`.
- Each wraps its body in one `test.step()`, so every spec gets a trace tree for free. Composites
  (`loginAs`, `addProductAndReachCheckout`) call other business functions and nest their steps —
  that is the tree.

**4. Three layers.**

| Layer              | Directory                 | Responsibility             | `expect`?   |
| ------------------ | ------------------------- | -------------------------- | ----------- |
| POMs               | `src/poms/`               | Locators only              | No (ESLint) |
| Business functions | `src/business-functions/` | Interactions + waits       | No (ESLint) |
| Specs              | `src/tests/`              | Orchestration + assertions | Yes         |

A fourth layer, `src/validation/`, would hold assertion bundles shared by **three or more**
specs. It does not exist yet, deliberately: today only two specs share the rejection bundle
(`errorContainer` visible + URL unchanged + message text) — `login.spec.ts` and
`checkout-validation.spec.ts` — and extracting a helper used twice is abstraction ahead of need.

**When a third spec needs that bundle, create `src/validation/` and move it there.** It is the
layer's first and most obvious occupant.

**5. No text assertions — one exception.** Error copy only. Verified: a locked-out account and
a wrong password produce byte-identical DOM, so the message is the only discriminator. Assert
structurally first (banner visible, inputs carry `.error`, URL unchanged), then the copy. Never
extend this to non-error content.

**6. Pin identifiers and rules, never content.** Pin `data-test` slugs and business rules
(`TAX_RATE`). Never pin names, prices or confirmation copy — a reprice is not a defect, and
pinned copy is pinned to one locale. Derive the expectation from the app and assert the
relationship: the cart must show what the catalogue showed. Assert content is _present_
(`not.toBeEmpty()`), not what it says. Dynamic data comes from `generateCustomer()`.

**7. Credentials come from the environment.** `USERS` is built from `src/config/env.ts`
(`SAUCEDEMO_USER`, `SAUCEDEMO_LOCKED_OUT_USER`, `SAUCEDEMO_PROBLEM_USER`, `SAUCEDEMO_ERROR_USER`,
`SAUCEDEMO_PASSWORD`). Use `||`, not `??` — an
unset CI secret arrives as an empty string. Committed defaults are the credentials SauceDemo
prints on its own login page.

**8. No hard waits, no magic numbers.** `waitForTimeout()` is an ESLint error — wait on a real
signal. Timeouts come from `src/config/timeouts.ts`. Rely on auto-retrying `expect`; never
hand-roll a retry loop. Never `evaluate(el => el.click())` — it bypasses actionability checks.

**9. `test.step()` where it earns its place.** Business functions carry one each, so specs never
wrap a single call in another step. In a spec, group a _block_ of assertions, or name a phase of
a long journey; a step may return a value. Never wrap one-line tests or individual assertions.

**10. Parameterise instead of duplicating.** Scenarios differing only by data are one `for…of`
over a typed case table. Each row should be a distinct equivalence partition, not another
variant of the same one. Happy-path and error specs live in separate files.

**11. Comments are a last resort.** No inline comments, no multi-line JSDoc. One line is allowed
only where the code cannot reveal a runtime trap — an element that is absent rather than empty,
a slug that breaks CSS parsing. Never restate the signature. Config files carry none, with one
exception: the `catch` in `env.ts` holds `// No .env file.` because ESLint's `no-empty` rejects a
bare block, and a missing `.env` is the expected case, not an error. Rationale belongs here or in
`README.md`.

**12. Known defects are pinned, not skipped.** A test for a bug the app has today asserts the
_correct_ behaviour and opens with `test.fail(true, 'Known bug: …')`, the reason naming the
defect. It passes by failing and turns the build red the day the bug is fixed — the signal to
delete the marker, not the test. Where one defect breaks several checks, use `expect.soft` so the
report shows all of them, then finish with one hard `expect`. When the defect is an uncaught
script error, register `page.on('pageerror')` before the action and assert the collected list is
empty. `test.skip` is never the answer: a skipped test cannot report the fix.

## Code style

Strict TypeScript (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`), `import type`
for type-only imports, Prettier owns formatting. Node 24.21.0 and TypeScript 6.0.3 are pinned —
do not bump casually.

## Where things live

| Path                      | Holds                                                         |
| ------------------------- | ------------------------------------------------------------- |
| `src/poms/`               | Page objects, locators only. `_base/BasePage.ts` = header     |
| `src/business-functions/` | `auth.ts`, `shopping.ts`                                      |
| `src/fixtures/shop.ts`    | Builds every POM, injects them as `shop`                      |
| `src/test-data/`          | Users, product slugs, error copy, customer generator          |
| `src/tests/`              | Specs                                                         |
| `src/config/`             | Values that parameterise the suite: `env.ts`, `timeouts.ts`   |
| `src/utils/`              | Behaviour only. A file with no functions does not belong here |

## Scope decisions

| Decision                                                 | Why                                                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Text assertions allowed for error copy only              | DOM is identical across failure modes; the copy is the only discriminator                    |
| Known defects pinned with `test.fail`, never `test.skip` | A skipped test is silent forever; an unexpected pass is a red build the day the bug is fixed |
| No tag taxonomy (`@p1`, `@smoke`, …)                     | 17 tests in one suite; selection machinery costs more than it saves                          |
| No unit-test runner                                      | Out of scope — the brief asks for an end-to-end framework                                    |
| Single environment, no locale machinery                  | One locale, one environment                                                                  |
| One `CheckoutPage` across three URLs                     | One funnel, no recurring widgets worth a component object                                    |
| One CI workflow, no sharding                             | Demonstrates the capability at this size                                                     |
| Timeouts in `config/`, not `utils/`                      | `utils/` holds behaviour; runner constants are configuration                                 |
