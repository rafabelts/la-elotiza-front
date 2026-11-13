# Session entry and POS navigation — feature report

## 1. Feature summary

Roadmap milestone 1 implements provisional staff sign-in by four-digit PIN, sign-out, role-aware POS navigation, and server-side access checks for protected routes. The `Equipo` destination is shown only to an encargado and denies direct cajero access. `Tomar orden`, `Órdenes`, `Corte`, and `Equipo` contain clearly labeled placeholders for later milestones; no sale, order, cash-close, or team-administration behavior was added.

## 2. Branch and scope

- **Active branch:** `feat/session-entry`, verified before edits and after validation.
- **Base:** Clean, committed `feat/design-system` (`09d6e15`), because this prerequisite is not yet in locally available `main` (`e62ef2b`). The new branch was created before implementation.
- **Working tree:** Uncommitted feature files listed below. No commit, push, Pull Request, merge, or deployment was performed.
- **Acceptance basis:** [Roadmap milestone 1](../ROADMAP.md) and requirements 27–29, interpreted with the [POS prototype](../prototipo/prototipo-elotiza.dc.html) and [design system](../design-system.md).

## 3. Files created or modified

| File | Change | Purpose |
| --- | --- | --- |
| `src/features/session/types.ts` | Created | Typed staff, role, session, input, and result contracts. |
| `src/features/session/validation.ts` | Created | Four-digit input and team-role rules. |
| `src/features/session/mock-service.ts` | Created | Server-only, fictional development staff verification. |
| `src/features/session/session-store.ts` | Created | Opaque, expiring in-memory mock sessions. |
| `src/features/session/service.ts` | Created | Replaceable session service boundary and cookie operations. |
| `src/features/session/actions.ts` | Created | Server sign-in and sign-out actions with typed errors. |
| `src/features/session/use-session-mutations.ts` | Created | TanStack Query sign-in/out mutations and navigation. |
| `src/features/session/components/login-screen.tsx` | Created | Staff selection, PIN input/keypad, validation feedback, and empty/pending states. |
| `src/app/iniciar-sesion/page.tsx` | Created | Public, server-rendered staff list and signed-in redirect. |
| `src/app/iniciar-sesion/loading.tsx` | Created | Accessible route loading status. |
| `src/app/iniciar-sesion/error.tsx` | Created | Accessible load-failure message and retry. |
| `src/app/(pos)/layout.tsx` | Created | Server session guard and shared shell. |
| `src/app/(pos)/equipo/layout.tsx` | Created | Direct-route encargado guard. |
| `src/app/(pos)/page.tsx` | Created | Protected sale entry placeholder, moved from root page. |
| `src/app/(pos)/ordenes/page.tsx` | Created | Protected orders placeholder. |
| `src/app/(pos)/corte/page.tsx` | Created | Protected cash-close placeholder. |
| `src/app/(pos)/equipo/page.tsx` | Created | Protected team placeholder. |
| `src/app/page.tsx` | Deleted | Superseded by the route-group home page at the same `/` URL. |
| `src/components/app-shell.tsx` | Modified | Responsive header, active navigation, role-based link display, session name, and sign-out. |
| `src/app/globals.css` | Modified | PIN keypad interaction styles. |
| `vitest.config.mts` | Modified | Test-only alias for Next's `server-only` marker. |
| `src/test/server-only.ts` | Created | Reviewer-owned empty test marker; production server boundary remains intact. |
| `src/app/page.test.tsx` | Modified | Existing placeholder test updated for the moved route. |
| `src/app/route-guards.test.tsx` | Created | Anonymous, role, sign-in, loading, and error-boundary tests. |
| `src/components/app-shell.test.tsx` | Created | Navigation, skip link, sign-out, and failure tests. |
| `src/features/session/validation.test.ts` | Created | PIN and role unit tests. |
| `src/features/session/actions.test.ts` | Created | Sign-in/out action and failure tests. |
| `src/features/session/mock-service.test.ts` | Created | Staff-list safety, credential verification, and production-disable tests. |
| `src/features/session/session-store.test.ts` | Created | Token uniqueness, revocation, and expiry tests. |
| `src/features/session/components/login-screen.test.tsx` | Created | Selection, keypad/keyboard, error, and pending-state tests. |
| `docs/session-contract.md` | Created | Provisional contract, demo setup, boundaries, and security limitations. |
| `docs/reports/session-entry-and-pos-navigation.md` | Created | This feature report. |

## 4. Architectural decisions

The session feature is isolated under `src/features/session/`. `StaffChoice` exposes only ID and display name to the login UI; `SessionView` exposes ID, name, and role after verification. PINs stay in a `server-only` development mock and are never serialized into page props. A `SessionService` interface keeps credential verification replaceable without claiming any real backend API contract.

The public login page fetches staff choices on the server. Sign-in/out use Next server actions and TanStack Query mutations for asynchronous state and navigation. An opaque random token is stored in an `HttpOnly`, `SameSite=Lax` cookie; its eight-hour record lives in server memory. The POS layout checks a session, and the team layout checks the encargado role on direct requests. Hiding a link is only a visual behavior; the role check is a separate server guard.

Route-group pages preserve the public URLs while keeping the shell and session gate in one layout. The login and route pages stay Server Components; interactive login and shell controls are Client Components. The feature reuses design-system buttons, fields, cards, badges, tokens, and focus styling. The `server-only` Vitest alias points to a test stub solely so unit tests can import the mock; Next's production server boundary is unchanged. See [session contract](../session-contract.md).

## 5. Components and services implemented

- **Login screen:** Native radio staff selector, labeled password PIN field, 72 px numeric keypad, Backspace/delete, four-digit submit gate, inline announced errors, empty staff state, and disabled controls during sign-in.
- **POS shell:** Skip link, branded header, route links with `aria-current`, wrapped narrow-screen navigation, current staff name, manager-only `Equipo` link, sign-out pending/error feedback.
- **Route states:** Login loading and error/retry views; clearly marked placeholder destinations for future workflows.
- **Session service:** Provisional staff list and credential check, typed server actions, expiring/revocable mock sessions, and protected route layouts.

## 6. API endpoints and mock services

No real REST endpoint was integrated or invented. Next server actions call a **server-only development mock** with two fictional staff identities. Their local demo credentials are documented in [session-contract.md](../session-contract.md) and are not displayed in the UI. The mock is disabled in `NODE_ENV=production`; a real server-side identity provider and durable session mechanism are required before production use.

## 7. Automated tests

The reviewer updated one existing test and added seven test files. Tests cover PIN format and action input, role rules, correct/incorrect credentials, service failures, session creation/revocation/expiry, staff selection, keypad and physical keyboard entry, correction, inline errors, pending state, sign-out, navigation visibility, direct-route guards, and login loading/error recovery. Existing design-foundation and provider tests also ran.

**Result:** 12 test files passed, **42/42 tests passed**. No live backend is used.

## 8. Validation and manual checks

The orchestrator ran `npm run check` after independent QA; it executes all four required commands in sequence. The reviewer also ran the complete gate.

| Command | Status | Actual result |
| --- | --- | --- |
| `npm run lint` | **PASS** | ESLint completed with zero warnings/errors. |
| `npm run typecheck` | **PASS** | Next route types generated; TypeScript completed. |
| `npm run test:ci` | **PASS** | Vitest: 12 files, 42 tests passed. |
| `npm run build` | **PASS** | Next.js 16.4.6 Webpack compiled and generated `/`, `/ordenes`, `/corte`, `/equipo`, and `/iniciar-sesion` as dynamic routes. |

**HTTP smoke checks:** Local development `/iniciar-sesion` returned HTTP 200 with the two demo staff names and no PIN in rendered HTML. Anonymous direct `/equipo` returned HTTP 307 to `/iniciar-sesion`. The API integrator also searched `.next/static` for demo PIN values and found none. These checks supplement the automated role tests; they do not prove a complete browser login journey.

**Browser/manual accessibility:** Browser inventory was unavailable and native Chrome inspection timed out. Mobile/desktop viewport rendering, 200% zoom, a complete real-browser keyboard journey, and assistive-technology announcements remain unverified. Code and component tests cover semantic labels, visible focus hooks, native controls, errors, and responsive wrapping. Full WCAG 2.2 AA compliance is not claimed.

## 9. Independent QA findings and verdict

**Verdict: PASS WITH WARNINGS.** The reviewer reported no remaining confirmed P0, P1, P2, or P3 defects. A proposed staff-list outage finding was withdrawn after verifying that Next's existing `error.tsx` catches rejected page renders and offers an announced error and retry. The reviewer retained outage/recovery coverage and added loading-state coverage. A real mock-service test initially could not resolve `server-only` in Vitest; a scoped test-only alias resolved that tooling issue without changing production behavior. The final gate was rerun and passed.

## 10. Remaining issues and unverified scenarios

- The development mock is intentionally unavailable in a production build. Production sign-in requires a confirmed identity source, secure credential verification, durable sessions, rate limiting/lockout, audit, and cross-server revocation.
- The in-memory mock session store is single-process and clears on restart. It is not a durable or multi-register staff session system.
- Real-browser mobile/desktop, zoom, keyboard, and assistive-technology checks remain outstanding because browser inspection was unavailable.
- Team management, catalog, orders, and cash close remain future milestones. Their current routes are navigation placeholders.
- GitHub Actions has not run on this unpushed branch; no remote CI success is claimed.

## 11. Acceptance criteria status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Correct four-digit demo PIN opens the authorized shell. | **PASS** | Mock credential/action/login tests and success mutation navigation; real-browser end-to-end flow unverified. |
| Incorrect PIN shows a field-related error and allows correction. | **PASS** | Login component tests; `Field` associates and announces the error. |
| Sign-out returns to login and revokes the session. | **PASS** | Action/store and shell tests; token deletion and navigation. |
| Cajero cannot access team administration by direct navigation. | **PASS** | Server role layout and direct-guard tests; anonymous HTTP redirect also verified. |
| Navigation reflects active route and role. | **PASS** | Shell tests for `aria-current` and role-specific links. |
| Loading, empty, and error states are handled. | **PASS** | Login screen and Next loading/error boundaries, with reviewer tests. |
| Relevant automated tests and local quality gates pass. | **PASS** | 42/42 tests and all four scripts passed. |
| Mobile/desktop and assistive-technology manual behavior verified. | **NOT VERIFIED** | Browser inspection unavailable; manual follow-up required. |

## 12. Readiness for commit and Pull Request

**READY WITH WARNINGS** for manual review and a later authorized commit/Pull Request. The feature satisfies the local milestone gate and independent QA found no confirmed defect. Manual browser/accessibility verification remains necessary for a complete responsive claim. The implementation remains a **development-only authentication demonstration**; it must not be treated as production-ready staff security. GitHub Actions can be assessed only after an authorized push. The branch is uncommitted and unpushed.
