# La Elotiza POS — development roadmap

Status: planning document, 13 November 2026. This roadmap sequences the existing requirements; it does not approve new product behavior or define backend endpoints.

## Sources and current state

- [Functional requirements](requirements.md): 38 numbered requirements. Requirement numbers below refer to this file.
- [Design system](design-system.md): records the prototype's visual patterns and explicitly labels several tokens and responsive breakpoints as proposals.
- [Interactive prototype](prototipo/prototipo-elotiza.dc.html): visual and interaction reference. Its menu, users, PINs, dates, sales, and integration toasts are demonstration data or behavior, not production contracts.
- `src/app/page.tsx` currently renders a setup placeholder. The App Router shell, Figtree, design tokens, TanStack Query provider, lint, type check, tests, build, Husky, and CI foundation already exist. No POS workflow or backend integration exists yet.

## Requirements inventory

| Area | Documented pages and flow | Requirements | Shared UI |
| --- | --- | --- | --- |
| Session and team | PIN login; select a person, enter four digits, sign out. `Equipo` lets an encargado add and remove people; a cajero cannot administer the team. | 27–29 | App header/navigation, person selector, PIN keypad, role selector, team list and form, field feedback |
| Sale entry | `Tomar orden`; choose category and product, configure available size/options, quantity and note, enter customer name, edit or remove lines, see updated total. | 1–9, 30–31 | Category filters, product cards, configurator dialog, option chips, quantity control, order panel, money display |
| Kitchen confirmation | Confirm an eligible order, generate a comanda with a unique order identifier, show it in orders in preparation; reconfirm edits to a confirmed order. | 10–11, 32, 35 | Comanda preview, order status, order card, confirmation feedback |
| Payment and cancellation | Show total; take cash or transfer; calculate cash change; create a unique transfer concept and allow WhatsApp sending; record sale amount/method/time, close and lock the order, generate and print a ticket; cancel before payment and exclude cancellation from sales. | 12–20, 33–34 | Payment, cancellation and ticket dialogs, payment selector, printable receipt |
| Preparation | `Órdenes`; mark products prepared and orders delivered. Prototype also shows filters and progress. | 36 | Order cards, item controls, progress and status labels, empty state |
| Cash closing | `Corte`; store shift sales, show total and payment subtotals, include opening cash fund in expected cash, record counted cash, calculate variance, show summary and print close on shift close. | 21–26, 37–38 | Metric cards, transfer table, cash count panel, printable close |

The prototype also shows `En preparación`, `Entregadas`, `Canceladas`, and `Todas` filters; a print-comanda action; a cash-drawer indicator/action; and order-delivery restrictions. These are observed prototype behaviors, not separate numbered requirements. Preserve the reference where feasible, but settle operational or hardware implications before treating them as acceptance criteria.

## Architecture and sequencing

Use feature-local, typed contracts for staff/session, catalog/options, order/line/comanda, payment/receipt, preparation, and shift/close as each feature is introduced. Keep pricing, option validation, order transitions, change, and reconciliation as pure rules outside UI components. UI receives typed data and callbacks, never imports mock fixtures. Implement replaceable asynchronous mock services for backend-dependent work; TanStack Query owns interactive persisted server state and invalidation. Keep draft editing local until it needs persistence. No REST paths are specified; real adapters and external-data validation wait for confirmed backend contracts. A browser-only mock can demonstrate a workflow but cannot provide secure PIN authorization, shared registers, or durable business records.

The dependency path is **session shell → catalog → draft sale → confirmation/comanda → cash payment → transfer payment → preparation/delivery → cash close**. Team administration depends on the session/role contract and can be developed after the core sale path. Each milestone below can be reviewed independently. Milestones 1–3 give useful demo workflows; a completed cash sale first becomes possible at milestone 5. Mock operation remains explicitly provisional until production services and device integrations exist.

### Common delivery gate for every implementation milestone

The `api_integrator` owns domain rules, contracts, services, hooks, and data errors; the `designer` owns UI, responsive layout, and accessible interactions. They agree on component contracts and nonoverlapping files before parallel work. The `reviewer` independently adds behavior-focused tests, runs relevant checks, reports severity and a QA verdict, then revalidates fixes. The orchestrator integrates work and records limitations. Every milestone handles relevant loading, empty, success, and error states; keyboard and visible-focus behavior; zoom/reflow and narrow, medium, and desktop layouts; and reduced motion. Required local gate: `npm run lint`, `npm run typecheck`, `npm run test:ci`, and `npm run build` (or `npm run check`, which runs all four). Run browser/E2E checks for the critical cross-screen journeys once Playwright is configured. No milestone is done with a confirmed blocking issue or a failed required check. Do not commit, push, merge, or deploy without user authorization.

## Milestones

### 1. Session entry and POS navigation

- **Objective and usable increment:** Staff can use a provisional PIN login and navigate the POS shell, with `Equipo` hidden and access denied for cajeros.
- **Functional scope:** Select person, enter exactly four PIN digits, receive incorrect-PIN feedback, sign out, and apply role checks to protected actions/routes (27, 29). Implement the header/navigation visible in the prototype.
- **Pages/components:** Login, global shell, header, navigation, session indicator, PIN keypad and feedback.
- **Data/API:** Provisional `StaffMember`, `Role`, and `Session` contracts; replaceable staff/session service and mock identities. Do not expose prototype PIN hints or describe client-only checks as production security. Actual credential storage and session verification require a backend decision.
- **Agents/dependency:** `api_integrator` defines auth/permission contract and mock; `designer` builds shell/login; `reviewer` tests both roles and denied access. Depends on existing setup only.
- **Acceptance:** Correct four-digit entry opens the authorized shell; wrong entry shows a field-related error; sign-out returns to login; cajero cannot reach team administration by direct navigation.
- **Automated tests:** Unit PIN format/permission rules; component selection, keypad, correction and errors; integration session success/failure and denied access; E2E login for each role when available.
- **Accessibility/responsive:** Label person/PIN controls; support keyboard digits, deletion and focus order; announce errors; keep navigation usable without horizontal clipping at narrow widths.
- **Done when:** Common gate passes, role checks are independently validated, and mock-only security limitation is documented.

### 2. Catalog and product configuration

- **Objective and usable increment:** Staff can browse the prototype-aligned menu and prepare valid product configurations before adding them to an order.
- **Functional scope:** Category browsing; product details and available size, flavor, included/paid toppings, extras, quantity and special instruction controls; block selection when required options are missing (3–6, 30). Product-specific options come from catalog data, including prototype cases with conditional options and required distinct choices.
- **Pages/components:** `Tomar orden` catalog, category filters, product cards, configurator dialog, option chips and quantity control.
- **Data/API:** Typed catalog/product/option-group contract; replaceable catalog read service and mock catalog based on prototype examples, with menu and prices marked provisional. Pure option validation and unit-price calculations.
- **Agents/dependency:** `api_integrator` owns catalog and rules; `designer` owns catalog/configurator; `reviewer` tests options and pricing. Depends on milestone 1.
- **Acceptance:** Categories filter correctly; selections obey required and cardinality rules; displayed configured price responds to size, priced options and quantity; invalid configuration cannot be accepted.
- **Automated tests:** Unit required, conditional and multi-select rules, price boundaries; component filters and configurator interaction; integration catalog loading/empty/error and service-to-UI mapping.
- **Accessibility/responsive:** Expose selected/disabled option states and associated warnings; contain and restore dialog focus; keep card grid and option controls usable at narrow widths and zoom.
- **Done when:** Common gate passes and catalog data can be replaced without changing presentational components.

### 3. Editable draft order

- **Objective and usable increment:** Staff can assemble and revise an accurate draft sale with a customer name and running total.
- **Functional scope:** Start order; add configured lines; edit options, notes and quantities; remove lines; update total after every mutation; require both a name and at least one product before confirmation (1–2, 7–9, 31).
- **Pages/components:** `Tomar orden` order panel, customer field, line rows and controls, empty state, total and confirmation gate.
- **Data/API:** Typed draft/line model; pure line and order total rules using catalog prices. Draft state may remain local; define how it is discarded or restored before implementation rather than assuming persistence.
- **Agents/dependency:** `api_integrator` owns draft rules/state; `designer` owns order panel; `reviewer` tests edits and gating. Depends on milestone 2.
- **Acceptance:** Every add/edit/remove/quantity change updates totals; draft lines retain their configuration and notes; confirmation is unavailable with no product or blank customer name.
- **Automated tests:** Unit line math and boundary quantities; component edit/remove/name feedback and total; integration configured product to draft line; E2E catalog-to-draft flow when available.
- **Accessibility/responsive:** Label line-specific actions, announce validation and total changes without excessive announcements, provide touch-friendly quantity controls, and keep the order panel reachable on small screens.
- **Done when:** Common gate passes and a draft can be reviewed and corrected without losing line details.

### 4. Confirmation, comanda and cancellation

- **Objective and usable increment:** A valid draft becomes a uniquely identified kitchen order that can be reviewed, reconfirmed after edits, or cancelled before payment.
- **Functional scope:** Confirm eligible order; generate comanda containing quantities, customizations and notes; list it in preparation; require reconfirmation after modifying a confirmed order; cancel an unconfirmed or confirmed unpaid order with explicit confirmation (10–11, 19, 32, 35). Preserve one order identity across revisions. Resolve when a draft receives its folio so draft cancellation can be recorded as cancelled, as requirement 19 states.
- **Pages/components:** Order confirmation state, comanda preview, cancellation dialog, initial `Órdenes` list/card and status feedback.
- **Data/API:** Provisional order/comanda/status service and replaceable mock storage; collision-safe mock folios and idempotent update contract. Cancellation state must be available to later sales reports. Printing a comanda appears in the prototype but needs a printer decision.
- **Agents/dependency:** `api_integrator` owns lifecycle and service; `designer` owns preview/list/dialog; `reviewer` tests transitions and duplicates. Depends on milestone 3.
- **Acceptance:** Confirmed order has a unique identifier and appears once in preparation; edits mark it pending reconfirmation and update that same comanda only after reconfirmation; cancellation before payment, including an unconfirmed draft, records cancelled status and cannot proceed to payment.
- **Automated tests:** Unit transition guards; component confirm/reconfirm/cancel dialogs; integration create/update/cancel for both draft and confirmed unpaid orders, unique identity and failure recovery; E2E draft→comanda→edit→reconfirm.
- **Accessibility/responsive:** Dialog focus management and clear cancellation consequences; text labels accompany status colors; comanda remains legible at narrow widths and in print preview.
- **Done when:** Common gate passes, duplicate confirmation is prevented, and cancellation state is available to downstream accounting.

### 5. Cash payment and sale ticket

- **Objective and usable increment:** Staff can complete a cash sale and issue a printable ticket; the order becomes closed and immutable.
- **Functional scope:** Show total, collect cash received, calculate change, record sale amount/method/current date-time, close order, display and print ticket (12–18, 21, 33). Validate the received amount under an agreed underpayment policy, prevent duplicate confirmation, and define recovery for print failure without charging twice.
- **Pages/components:** Cash branch of payment dialog, change display, ticket preview and print view/action.
- **Data/API:** Payment/receipt service and mock shift sales store; currency calculations avoid floating-point drift; timestamp comes from a clock boundary rather than prototype literals. Real payment persistence and printer capability remain integration dependencies.
- **Agents/dependency:** `api_integrator` owns payment state/recording and calculations; `designer` owns payment/ticket/print presentation; `reviewer` tests locking and failure cases. Depends on milestone 4.
- **Acceptance:** Valid cash payment records exactly one sale with total, method and time; change is correct; the closed order rejects all line edits; ticket contains customer, products, total and method and invokes an actual browser print flow or confirmed printer adapter, with failures surfaced accurately.
- **Automated tests:** Unit change and monetary boundaries; component cash input/change/ticket; integration payment idempotency, record failure and immutability; E2E cash sale and ticket print invocation where browser tooling permits.
- **Accessibility/responsive:** Numeric input has clear errors; change updates are announced; ticket content reflows on screen and remains readable in print.
- **Done when:** Common gate passes; a full cash sale works with the provisional store; printing behavior and any hardware dependency are documented and verified at the supported level.

### 6. Transfer payment and customer concept

- **Objective and usable increment:** A confirmed order can also close by transfer with a unique concept that the cashier can send to the customer.
- **Functional scope:** Select transfer, show unique concept, offer WhatsApp sending, record transfer sale, close and ticket the order (13–18, 21, 34). Reuse receipt behavior from milestone 5.
- **Pages/components:** Transfer branch of payment dialog, concept/copy/send controls, ticket payment detail.
- **Data/API:** Transfer-reference policy and payment service extension; mock send state only for development. Choose supported WhatsApp handoff or integration and define whether user action or provider acknowledgment counts as sent; never report a simulated send as successful delivery.
- **Agents/dependency:** `api_integrator` owns reference uniqueness/payment and send contract; `designer` owns transfer controls and feedback; `reviewer` tests collisions and failures. Depends on milestone 5.
- **Acceptance:** Concept is unique within the defined scope; successful transfer creates one sale and locks the order; send action performs the confirmed handoff and reports failure honestly; ticket states transfer method.
- **Automated tests:** Unit concept uniqueness/format boundary; component method switch, copy/send states; integration transfer record and send success/failure; E2E transfer sale when available.
- **Accessibility/responsive:** Long concepts wrap and can be copied with keyboard; send feedback is announced; payment controls stay operable on small screens.
- **Done when:** Common gate passes and the supported WhatsApp behavior is verified; otherwise production readiness remains blocked on that integration decision.

### 7. Preparation board and delivery

- **Objective and usable increment:** Staff can track kitchen work and mark products prepared and orders delivered.
- **Functional scope:** Show preparation, delivered, cancelled and all lists as in prototype; mark individual products prepared, show progress, mark an order delivered (36). Define whether payment or full preparation gates delivery before coding that policy; the prototype currently applies such restrictions.
- **Pages/components:** Full `Órdenes` screen, filters, order cards, item controls, progress, empty states and status labels.
- **Data/API:** Preparation/fulfillment mutations on the order service, with query invalidation across order, sale and board views; mock service handles conflict/failure states.
- **Agents/dependency:** `api_integrator` owns status transitions and service; `designer` owns board interactions; `reviewer` tests status and filter behavior. Depends on milestones 4–6 for complete order/payment states.
- **Acceptance:** Marking a product updates progress and persists in the chosen mock scope; delivery updates the order list/status; cancelled orders cannot be mistaken for active or delivered orders.
- **Automated tests:** Unit preparation progress/transition rules; component filtering, item controls and empty state; integration cross-view updates and failures; E2E confirm→prepare→deliver.
- **Accessibility/responsive:** Each item control has a distinct accessible name and state; progress is expressed in text; cards and actions reflow without horizontal overflow.
- **Done when:** Common gate passes and the chosen delivery policy is recorded and validated.

### 8. Shift sales and cash close

- **Objective and usable increment:** A cashier can reconcile a shift, see payment subtotals and variance, and print the cash close, as requirements 22 and 38 state; resolve the prototype's conflicting encargado copy before setting final permissions.
- **Functional scope:** Store completed sales during the shift; exclude cancelled orders; calculate total, cash and transfer sales; include opening fund in expected cash; enter counted cash; show expected, counted and difference; close shift and print the close (20–26, 37–38).
- **Pages/components:** `Corte` dashboard, metric cards, transfer detail table, cash count form, summary and print view.
- **Data/API:** Provisional `Shift`, sale ledger and closing service; pure reconciliation rules. Define shift boundary, opening-fund source, record durability and close/print failure handling. Prototype's $500 fund and seeded sales are examples only.
- **Agents/dependency:** `api_integrator` owns aggregation/closing contract; `designer` owns dashboard/print UI; `reviewer` tests reconciliation. Depends on milestones 5–6 and cancellation from milestone 4.
- **Acceptance:** A cashier can request and print the close under the documented requirement until a different role policy is approved; totals reflect only completed sales for the selected shift; cash and transfer subtotals reconcile to total; expected cash includes fund exactly once; variance is counted minus expected; empty shift and invalid counted amount are handled; close produces a printable record without silently losing data.
- **Automated tests:** Unit zero/positive/negative variance, exclusions and fund inclusion; component count entry, summary and errors; integration mixed payment ledger, close/retry and failures; E2E cash+transfer+cancel→close and print invocation.
- **Accessibility/responsive:** Tables retain header associations and usable overflow/reflow; amounts have text labels, tabular numerals and clear error messages; print layout remains legible.
- **Done when:** Common gate passes and shift-close permissions, durability and printer behavior are recorded and verified at the supported level.

### 9. Manager team administration

- **Objective and usable increment:** An encargado can manage who can sign in without granting that control to a cajero.
- **Functional scope:** Add a person with name, four-digit PIN and role; remove access (28–29). Prototype adds duplicate-name validation and prevents removing the current/last encargado; confirm those policies before enforcing them as product rules.
- **Pages/components:** `Equipo` list, add-person form, role selector and removal action/feedback.
- **Data/API:** Extend staff/session service with create/revoke operations and permission enforcement. PIN handling and session revocation require secure server-side implementation for production; mock records are only for development.
- **Agents/dependency:** `api_integrator` owns authorization and staff mutations; `designer` owns form/list feedback; `reviewer` tests permissions and revocation. Depends on milestone 1; may run after core sale features without changing their contracts.
- **Acceptance:** Encargado can create an eligible person and remove access; removed person cannot sign in; cajero cannot invoke team mutations even through direct access; inputs receive clear validation.
- **Automated tests:** Unit name/PIN/role validation; component form, errors and removal; integration authorized/denied create/revoke and subsequent login; E2E both-role access.
- **Accessibility/responsive:** Label every form control and role state, associate errors, provide keyboard-operable removal confirmation if needed, and keep the list/form usable on narrow screens.
- **Done when:** Common gate passes and production authorization requirements are explicitly separated from mock demonstration behavior.

## Decisions to resolve before dependent implementation or production release

1. **Backend and durability:** No API endpoints, persistence, multi-register synchronization or offline behavior are specified. Confirm data ownership and failure/retry semantics before a real adapter. Do not treat an in-memory/browser mock as a durable sales ledger.
2. **Session security:** Confirm the identity source, PIN storage/verification, session lifetime and revocation. Prototype PINs must never appear in production UI or bundled fixtures.
3. **Menu authority:** Confirm current products, prices and option rules. Prototype menu and uploaded physical-menu images are references, not an approved live catalog.
4. **Identifiers and shifts:** Confirm order-folio and transfer-concept uniqueness scope, shift/day boundary, timezone, opening fund source and close/reopen policy. Prototype dates, times, folios and fund values are fixed examples.
5. **External actions:** Confirm printer/cash-drawer capabilities and WhatsApp handoff/transport. The prototype currently shows success toasts without performing those actions; ticket and close printing and WhatsApp sending are explicit requirements and cannot be marked done by a toast alone.
6. **Operational policy:** Clarify who may perform cash closing (requirements describe a cashier; prototype team copy says encargado), whether delivery requires payment/all products prepared, how underpayment is handled, and whether the prototype's last-encargado protection is required.
7. **Responsive layout:** The design system proposes breakpoints, but the prototype does not define responsive rules for the header, two-column sale layout or cash close. Validate the implementation at actual viewport sizes and zoom before fixing breakpoints.

## Integration readiness

A milestone QA verdict and passing local checks establish local readiness only. GitHub Actions must run on an authorized pushed branch; a pull request to `main`, passing required checks, branch protection and user approval are required before integration. This planning phase creates no implementation, tests, commit, push or merge.
