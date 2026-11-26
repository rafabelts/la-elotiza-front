# Catalog and product configuration

## Feature summary and acceptance

Roadmap milestone 2 is implemented on `feat/catalog-configuration`, based on the existing session-entry branch. Staff can filter the prototype-derived menu by category, open a product configurator, choose available sizes, flavors, toppings, extras, quantity, and a special instruction, then prepare a valid configuration for review. This milestone does not add a draft order or checkout; those belong to later milestones.

| Acceptance criterion | Status | Evidence |
| --- | --- | --- |
| Categories filter correctly | Met | Category buttons filter product cards; component test covers Esquites and Bebidas. |
| Required, conditional, and cardinality rules are enforced | Met | Pure validation checks missing, duplicate, unavailable, single-choice, and exact-count selections. Configurator disables acceptance until valid. Tests cover conditional Tostitos availability and two distinct Supremo choices. |
| Configured price responds to size, priced options, and quantity | Met | Integer-cent pricing rules update the visible total. Unit and component tests cover size, extras, included and additional toppings, quantity, and boundaries. |
| Invalid configuration cannot be accepted | Met | The preparation button uses validation state and the acceptance callback checks validity again. |
| Catalog source can be replaced without presentation changes | Met | `CatalogReadService` is an asynchronous read contract consumed through TanStack Query; components receive typed catalog data. |
| Last-known menu remains available after a catalog read failure | Met | A successful read saves a versioned browser snapshot. A later failed read uses a validated snapshot, shows its timestamp and an outdated-price warning, and offers a retry. Without a valid snapshot, the error state remains. |

## Architecture, components, and data

- `src/features/catalog/types.ts` defines the provisional typed category, product, option-group, option, and selection contracts.
- `src/features/catalog/rules.ts` contains pure option availability, configuration validation, and price calculations. Prices are represented as integer MXN cents.
- `src/features/catalog/service.ts` defines a replaceable asynchronous catalog read service. `src/features/catalog/mock-service.ts` provides 18 prototype-derived product examples in four categories. No REST endpoint was invented or called.
- `src/features/catalog/use-catalog.ts` reads the service through TanStack Query. The page handles loading, error, and retry; the catalog handles empty states.
- `src/features/catalog/cache.ts` validates and stores the last successfully loaded menu in browser `localStorage`. The query uses it only when a catalog read fails. Invalid or unavailable storage does not block a fresh read.
- `src/features/catalog/components/catalog-screen.tsx` implements filters, product cards, and prepared-configuration feedback. `product-configurator-dialog.tsx` implements option groups, conditional disabled choices, validation messages, quantity, note, and live price. `src/app/(pos)/page.tsx` connects the query to the screen; `src/app/globals.css` adds catalog-specific responsive styling.
- `docs/catalog-contract.md` documents provisional contracts and backend decisions. The menu, availability, and prices are demonstration data and require confirmation before production use.

## Tests and validation

The reviewer replaced the stale placeholder test in `src/app/page.test.tsx` with catalog component and service-to-UI tests, and added `src/features/catalog/rules.test.ts` for required and conditional options, distinct multi-select choices, pricing, and quantity boundaries. Tests cover loading, empty, error, and retry states; persistence across a remount; failed-read fallback; recovery on retry; and rejection of malformed or invalid snapshots.

| Command | Result |
| --- | --- |
| `npm run lint` | Passed; zero warnings. |
| `npm run typecheck` | Passed. |
| `npm run test:ci` | Passed; 14 files, 61 tests. |
| `npm run build` | Passed. |
| `npm run check` | Passed all four required checks in sequence. |

The local checks satisfy the configured Husky pre-commit and pre-push scripts. No commit or push was made, so the hooks did not execute as Git hooks and GitHub Actions has not run remotely.

## Accessibility, responsive behavior, and QA

Native buttons expose selected and disabled states; option groups use fieldsets and legends, warnings are associated with groups, quantity has labeled controls, and the shared dialog manages modal focus and focus return. The layout uses a wrapping category row, a fluid card grid, wrapping options and actions, a constrained dialog, and reduced-motion styling. Automated component tests exercise accessible roles and selected/disabled states.

The independent reviewer reported **PASS WITH WARNINGS** and no confirmed P0–P3 defect. The saved-menu banner uses a status region, identifies the device copy, shows its last-update time, warns that prices may be outdated, and offers retry. Browser visual inspection at narrow, medium, and desktop widths, zoom/reflow, and manual keyboard testing remain unverified: the browser access host could not open the local development server. The responsive CSS is implemented but has not received visual confirmation. Playwright is not configured, so no E2E test ran.

## Remaining dependencies and integration readiness

The catalog API will supply products and prices when the backend is connected; the mock is demonstration data, not a live or shared menu. The API response shape, refresh policy, authentication, and cache scope by location or tenant remain integration decisions. A previously loaded menu can be browsed from this device after a catalog request fails, but the cache does not load the app shell without network access, save orders, queue submissions, or confirm cached prices for a sale. This feature is ready for manual review and a local commit on `feat/catalog-configuration` after the remaining visual checks. A pull request and integration into `main` still require user authorization, an authorized push, passing remote CI, and the project's branch protection and merge approvals.

The worktree also contained an edit to `docs/reports/session-entry-and-pos-navigation.md` before this milestone began; it was preserved and is not part of this feature.
