# Editable draft order — feature report

## Feature and branch

Roadmap milestone 3 adds an editable draft on `Tomar orden`. Staff can add configured products, enter a customer name, edit options, notes, and quantities, remove lines, see the running total, and discard the draft to start over. The work is on `feat/editable-draft-order`, branched from the completed local catalog milestone branch. The working tree is uncommitted; no push, Pull Request, merge, or deployment was made.

## Files created or modified

| File | Purpose |
| --- | --- |
| `src/features/order/types.ts` | Typed draft, line, input, and summary contracts. |
| `src/features/order/rules.ts` | Pure line mutations, configuration validation, price totals, and readiness rule. |
| `src/features/order/use-draft-order.ts` | Page-local draft state and mutation error handling. |
| `src/features/order/components/order-panel.tsx` | Customer field, line actions, totals, feedback, and reset control. |
| `src/features/catalog/components/catalog-screen.tsx` | Connects catalog configuration to the draft and supports line editing. |
| `src/features/catalog/components/product-configurator-dialog.tsx` | Displays draft mutation errors while preserving the editor. |
| `src/app/globals.css` | Responsive order panel, line controls, and mobile draft link styling. |
| `docs/draft-order-contract.md` | Provisional contract, lifecycle, and catalog-change behavior. |
| `src/features/order/rules.test.ts` | Domain and pricing tests. |
| `src/features/order/components/order-panel.test.tsx` | Readiness and stale-catalog regression coverage. |
| `src/app/page.test.tsx` | Updated catalog behavior and configured-product-to-draft interaction tests. |

## Architecture, services, and behavior

The catalog remains the replaceable asynchronous mock service from milestone 2; this milestone adds no REST endpoint or order persistence. `useDraftOrder(catalog)` keeps the draft in sale-page React memory. Navigation away or reload discards it; the explicit reset control discards it immediately. Each add creates a distinct line ID, and editing keeps that ID. Selections, notes, quantity, and a product snapshot stay with each line. Price rules use integer MXN cents and reject invalid quantities or configurations. A refreshed catalog that removes, invalidates, or reprices a line preserves its displayed draft total, shows an error, and blocks readiness until the line is edited or removed.

The order panel provides an empty state, customer-name error, line-specific edit/remove/quantity controls, live total, and a mobile link to the panel. The badge and readiness sentence were removed after visual review. Product lines use inset cards with separate configuration details, a note callout, and grouped controls. On desktop, the panel height follows the viewport to reach the requested lower alignment; on smaller screens it retains a capped responsive height below the catalog. Its added-products region alone scrolls, keeping the customer field and total visible. Editing a line no longer shows a redundant success notice. Add, remove, reset, and error feedback remain. `canConfirm` requires at least one line, a nonblank trimmed customer name, and no catalog discrepancy. The visible **Confirmar orden** action remains disabled with an explanation: kitchen confirmation and comanda creation are milestone 4 and are not represented as working here.

## Automated tests and validation

The reviewer added unit coverage for line math, duplicate products with distinct identities, editing, removal, quantity boundaries, invalid configuration, and catalog changes. Component and page integration coverage exercises add, edit, note retention, quantity, remove, reset, customer feedback, total changes, and readiness. A component regression test covers the redesigned line card's configuration, note, price, total, and actions. Existing tests for the former single prepared-configuration preview were updated to assert the draft flow.

The orchestrator ran `npm run check` after QA, which executed all four required local gates:

| Command | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test:ci` | PASS — 16 files, 68 tests |
| `npm run build` | PASS — Next.js production build |

`git diff --check` was clean. The configured Husky pre-commit hook runs lint and typecheck; pre-push runs `npm run check`. Their commands passed locally, but the hooks themselves were not triggered because no commit or push was made. GitHub Actions results were not observed.

## Accessibility, responsive behavior, and QA

Controls have distinct line-specific accessible names and 44 px quantity targets. The customer field has inline feedback; totals use a polite live output; errors are announced; the panel stacks below the catalog on small screens and has a jump link. Existing focus and reduced-motion rules remain in use. Code and component tests covered these behaviors, but real-browser viewport, zoom, keyboard journey, and assistive-technology checks remain unverified. Playwright is not configured.

Independent reviewer verdict: **PASS WITH WARNINGS**. QA initially reproduced one P2 defect: a draft blocked by a catalog change could incorrectly say that the customer name was missing. The designer corrected it and the reviewer revalidated the regression test. A later visual review removed the badge and readiness sentence entirely; tests were updated to assert their absence. No confirmed blocking finding remains.

## Acceptance and readiness

| Milestone 3 criterion | Status |
| --- | --- |
| Add, edit, remove, and quantity changes update totals | Met; automated tests pass. |
| Draft lines retain configuration and notes | Met; automated tests pass. |
| No-product or blank-name drafts cannot pass the confirmation gate | Met in the `canConfirm` rule; the actual confirmation action is reserved for milestone 4. |
| Review and correct a draft without losing line details | Met for page-local editing; reload/navigation discards the draft by documented policy. |

The branch is ready for manual review and an authorized commit. A Pull Request and remote CI remain pending user authorization. Production order submission, shared persistence, and final catalog/price contracts remain future integration work.
