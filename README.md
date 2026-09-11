# SauceDemo E2E Test Suite

Risk-based end-to-end tests for [saucedemo.com](https://www.saucedemo.com), in Playwright and
TypeScript. The goal was not to test everything — it was to pick the tests that catch a costly
bug, and structure them so the suite survives contact with a changing app.

## Quickstart

```bash
nvm use && npm install    # Node 24.21.0; postinstall fetches the matching Chromium
npm test                  # the whole suite
```

No hidden third step — `postinstall` handles the browser, so a fresh clone runs.

```bash
npm run report             # HTML report from the last run
npm run test:all-browsers  # installs Firefox + WebKit, runs all three
npm run lint:fix
npm test -- --headed       # flags pass straight through; no alias scripts
```

## What is tested, and why

Eleven scenarios, 17 test cases after parameterisation, chosen by risk × business impact.
Thirteen assert behaviour; four pin known defects as expected failures.

| Scenario                                                                                 | Why it earns its place                                           |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Login → cart → checkout → order confirmed                                                | The revenue path. If it breaks, nothing else matters             |
| Cart matches the catalogue product and price                                             | Catches "wrong item / wrong price", which a click-through misses |
| Order totals are arithmetically correct                                                  | Real money logic — the highest-value assertion here              |
| Login rejected: locked out, unknown user, wrong password, empty username, empty password | Five distinct partitions, one row each                           |
| Checkout rejects each blank field                                                        | Validation is a distinct failure mode from auth                  |
| Cart badge lifecycle: absent → 1 → absent                                                | The badge is conditionally rendered, not zeroed                  |
| Dismissing a login error clears the failure state                                        | The error state must not survive into the next attempt           |
| An empty cart cannot proceed to checkout                                                 | Missing guard on the revenue path; goes red the day it is fixed  |
| `error_user`: Finish confirms the order                                                  | Finish throws an uncaught error; captured via `pageerror`        |
| `error_user`: Remove empties the cart                                                    | Remove throws an uncaught error; the item stays                  |
| `problem_user`: checkout form keeps what was typed                                       | Last Name overwrites First Name                                  |

## Architecture

```
POMs                 locators only
  ↓                  (src/poms/)
Business functions   interactions — "what a user does", never assert
  ↓                  (src/business-functions/)
Specs                orchestration + every assertion
                     (src/tests/)
```

These map onto the ISTQB generic test automation architecture (gTAA): POMs and business
functions are the adaptation layer, `test-data/` the definition layer, fixtures and config the
execution layer. 

## Known defects, pinned as expected failures

The shop lets an **empty cart proceed to checkout** — clicking Checkout goes straight to the
customer form, and navigating to `/checkout-step-two.html` renders an order totalling `$0.00`.
Together with the three `error_user` / `problem_user` defects above, this is pinned by a test
marked `test.fail()`: it passes today by failing, and flips to an _unexpected pass_ — a red
build — the day the bug is fixed. The reason string on each carries the defect description.
