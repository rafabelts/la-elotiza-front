
# La Elotiza — Frontend Development

## 1. Project Overview

La Elotiza is a frontend application built with Next.js,
React, and TypeScript.

The project follows a multi-agent development workflow
focused on maintainability, accessibility, reliability,
and automated quality assurance.

Follow the product requirements, specifications,
and prototypes available in `docs/`.

Treat `docs/prototipo/` as the visual reference
when that directory exists.

Do not invent features or product requirements.

The main Codex agent acts as the development orchestrator,
coordinating specialized agents and ensuring that their
work is properly integrated and validated.

## 2. Technology Stack

Core Technologies:
- Framework: Next.js (App Router)
- Language: TypeScript (strict mode)
- UI Library: React
- Styling: Tailwind CSS
- Server State: TanStack Query
- Data Validation: Zod, when appropriate
- API Integration: REST APIs
- Package Manager: npm

Testing & Quality:
- Linting: ESLint
- Type Checking: TypeScript
- Unit Testing: Vitest
- Component Testing: React Testing Library
- Integration Testing: Vitest with appropriate mocks
- E2E Testing: Playwright, when appropriate
- Git Hooks: Husky
- Continuous Integration: GitHub Actions

Use stable, mutually compatible package versions.

Do not introduce alternative frameworks or libraries
without a concrete justification and authorization.

Testing infrastructure may be configured incrementally,
but required quality checks must not be silently skipped.

## 3. Next.js Conventions

- Use the App Router.
- Prefer Server Components by default.
- Use Client Components when interactivity, hooks,
  or browser APIs are required.
- Keep secrets and sensitive operations server-side.
- Use server-side data fetching when appropriate.
- Use TanStack Query for interactive client-side
  server state, caching, queries, and mutations.
- Avoid unnecessary client-side request waterfalls.
- Follow Next.js caching and revalidation conventions.
- Use built-in routing and navigation.
- Use Next.js Image and Font optimization where useful.
- Avoid unnecessary dependencies between server
  and client components.

## 4. Frontend Architecture

The `api_integrator` owns technical architecture.

Prefer feature-based organization when appropriate.

Suggested structure:

    src/
      app/           Routes, layouts, pages and providers
      components/    Shared presentational components
      features/      Feature-specific modules
      hooks/         Shared React hooks
      lib/           Utilities and API infrastructure
      types/         Shared domain types

Architecture principles:

- Separate presentation from business logic.
- Separate API transport from application components.
- Use strongly typed domain models and interfaces.
- Avoid unnecessary global state.
- Prefer reusable, maintainable components.
- Keep features reasonably independent.
- Avoid circular dependencies.
- Respect existing conventions and public contracts.
- Do not create abstractions without a demonstrated need.

Do not create folders or layers until they are needed.

## 5. Design & Accessibility

The `designer` owns visual implementation and accessible
UI behavior.

- Follow the approved prototypes and design specifications.
- Follow WCAG 2.2 Level AA guidelines.
- Prefer semantic HTML and native interactive elements.
- Support keyboard navigation and visible focus indicators.
- Ensure adequate color contrast.
- Provide accessible labels and feedback.
- Support responsive layouts across device sizes.
- Respect reduced-motion preferences.
- Support zoom, text resizing, and responsive reflow.
- Provide loading, empty, success, and error UI states.
- Avoid unnecessary animations and visual complexity.

Build components with predictable, testable interactions.

Do not claim full WCAG compliance without sufficient
automated and manual validation.

## 6. API Integration

Backend APIs may be unavailable during development.

The `api_integrator` must:

- Define typed domain interfaces and service contracts.
- Implement replaceable mock services when needed.
- Keep mock and real services interchangeable.
- Avoid coupling UI components to mock implementations.
- Document provisional contracts and assumptions.
- Never invent actual backend endpoints.
- Separate data access from presentation.
- Validate external data when appropriate.
- Handle network failures and asynchronous errors.
- Prevent accidental exposure of credentials.
- Use TanStack Query when appropriate for client-side
  server state and caching.
- Follow documented API contracts once available.

Never present provisional interfaces as confirmed
backend specifications.

## 7. Code Quality

All agents must follow these conventions:

- Use TypeScript strict mode.
- Avoid `any` and unsafe type assertions.
- Prefer clear and consistent naming.
- Keep components and functions focused.
- Avoid unnecessary complexity.
- Avoid duplicated logic.
- Handle errors explicitly.
- Preserve existing functionality.
- Reuse installed dependencies when possible.
- Avoid introducing libraries without justification.
- Keep changes limited to the assigned scope.

Code must be maintainable, testable, and understandable.

Do not sacrifice correctness for short-term convenience.

## 8. Multi-Agent Responsibilities

### api_integrator — Architecture & API Integration

Owns:
- Technical frontend architecture.
- Folder and module boundaries.
- Domain interfaces and service contracts.
- API clients and data access layers.
- Mock services.
- TanStack Query integration.
- Application state architecture.
- Data transformations.
- API error handling and integration security.

Responsibilities:
- Deliver type-safe, testable implementations.
- Validate affected code before QA handoff.
- Execute relevant existing tests.
- Fix architecture and integration defects.
- Communicate important edge cases to the reviewer.
- Coordinate component contracts with the designer.

Must not modify reviewer-owned tests without authorization.

### designer — UI/UX & Accessibility

Owns:
- Presentational UI components.
- Responsive layouts.
- Visual consistency.
- Accessible interactions.
- Form presentation.
- UI feedback and interaction states.
- Visual fidelity to approved prototypes.

Responsibilities:
- Implement predictable, testable components.
- Follow established architectural contracts.
- Validate responsive and accessible behavior.
- Execute relevant existing component tests.
- Fix visual, interaction, and accessibility defects.
- Coordinate data interface changes with api_integrator.

Must not independently redesign data access architecture.

Must not modify reviewer-owned tests without authorization.

### reviewer — QA & Test Engineering

Owns:
- Independent code review.
- Unit test creation and maintenance.
- Component test creation and maintenance.
- Integration and regression tests.
- Functional correctness validation.
- Accessibility review.
- Responsive behavior verification.
- TypeScript and code quality review.
- CI quality gate assessment.
- Regression prevention.

The reviewer may create and modify:
- Test files.
- Test fixtures.
- Test-specific utilities.

The reviewer must not modify:
- Production implementation files.
- Business logic or API services.
- Production application configuration.
- CI configuration or package dependencies
  without explicit authorization.

The reviewer must:
- Write meaningful, behavior-focused tests.
- Execute relevant validation commands.
- Report reproducible defects with evidence.
- Provide actionable findings with file references.
- Independently validate corrections.
- Never weaken tests merely to obtain passing results.

Production fixes belong to implementation agents.

## 9. Testing Strategy

Testing is an integral part of development.

### Unit Tests

Use Vitest to validate:
- Utility functions.
- Business rules.
- Data transformations.
- Validation logic.
- Boundary conditions.
- Error handling.

### Component Tests

Use React Testing Library to validate:
- Observable user interactions.
- Rendering behavior.
- Forms and validation feedback.
- Loading, empty, success, and error states.
- Accessible roles and labels.
- Keyboard interactions.

Prefer behavior-based assertions over
implementation-dependent tests.

### Integration Tests

Validate:
- Interactions between hooks and services.
- Data transformations.
- Query and mutation behavior.
- API error handling.
- Cache invalidation.
- Mock service compatibility.

Prefer mocked HTTP responses rather than live APIs.

### End-to-End Tests

Use Playwright when appropriate to validate:
- Critical user journeys.
- Navigation and multi-step interactions.
- Browser-level functionality.
- Important responsive behaviors.

E2E tests should complement, not replace,
unit and component tests.

### Testing Ownership

The reviewer is the primary owner of automated tests.

Implementation agents must make their code testable
and execute relevant existing tests.

The reviewer writes new tests, maintains existing tests,
and independently validates implementation behavior.

Do not create meaningless placeholder tests
to satisfy CI requirements.

## 10. Local Quality Gates

The project uses Husky to enforce local Git checks.

### Pre-Commit

Before creating a commit, run:

    npm run lint
    npm run typecheck

A failing check must block the commit.

### Pre-Push

Before pushing changes, run:

    npm run check

The `check` script must execute:

    npm run lint
    npm run typecheck
    npm run test:ci
    npm run build

A failing check must block the local push.

### Quality Gate Rules

- Never bypass Git hooks to submit failing changes.
- Never disable validation rules to hide defects.
- Never remove legitimate failing tests without justification.
- Do not fabricate passing results.
- Report validation failures clearly.
- Fix issues within the responsible agent's scope.

The orchestrator must ensure that all required
scripts and dependencies are properly configured.

Local hooks are a convenience and safety mechanism,
not a substitute for remote CI enforcement.

## 11. Git & Branching Strategy

The project follows a feature branch workflow.

The `main` branch represents stable, integrated code.

Do not develop new features directly on main.

### Branch Naming

Use descriptive branch names:

- feat/<feature-name>
- fix/<issue-name>
- chore/<task-name>
- refactor/<scope>
- test/<scope>

Examples:

    feat/homepage
    feat/product-catalog
    fix/cart-validation
    chore/setup-ci
    test/order-components

### Development Rules

- Create feature branches from the latest main.
- Keep each branch focused on one logical change.
- Avoid unrelated modifications.
- Use clear, descriptive commit messages.
- Prefer Conventional Commits when appropriate.
- Do not mix unrelated features in the same branch.
- Keep branches synchronized with main when necessary.

### Commit Conventions

Examples:

    feat: implement product catalog
    fix: correct cart quantity validation
    test: add catalog component tests
    refactor: simplify product service
    chore: configure GitHub Actions

Do not commit, push, merge, or deploy
without explicit user authorization.

## 12. GitHub Actions & Continuous Integration

GitHub Actions provides independent remote validation.

Required CI checks:

- ESLint.
- TypeScript type checking.
- Vitest automated tests.
- Next.js production build.

Configure CI to run on:

- Pushes to main.
- Pushes to feature and maintenance branches.
- Pull requests targeting main.
- Manual workflow dispatch when useful.

CI requirements:

- Use reproducible dependency installation.
- Keep CI commands consistent with package.json.
- Fail when required checks fail.
- Do not silently skip required validation.
- Use minimal GitHub Actions permissions.
- Avoid exposing secrets to untrusted workflows.
- Report configuration and environment failures.
- Use test and build commands suitable for CI.

The reviewer validates CI effectiveness.

The orchestrator or responsible implementation agent
owns CI configuration changes.

GitHub Actions runs after receiving commits.
Local Husky hooks prevent ordinary local pushes
when validation fails.

Protect main using GitHub branch rules or rulesets
requiring successful CI checks before merging.

## 13. Pull Request Workflow

Every completed feature should be integrated
through a Pull Request targeting main.

Before requesting a merge:

1. Complete the assigned functionality.
2. Validate the implementation locally.
3. Execute relevant automated tests.
4. Complete independent reviewer validation.
5. Resolve blocking findings.
6. Ensure local quality gates pass.
7. Push the feature branch after authorization.
8. Verify required GitHub Actions checks pass.
9. Obtain user approval before merging.

Do not merge automatically.

A Pull Request must not be considered ready when
required checks fail or confirmed blocking issues remain.

The reviewer provides a QA verdict, but does not
replace GitHub's required status checks or user approval.

## 14. Multi-Agent Development Workflow

The main Codex agent acts as orchestrator.

### Phase 1 — Requirements

1. Analyze the assigned feature.
2. Read relevant documentation and prototypes.
3. Identify functional and non-functional requirements.
4. Establish acceptance criteria.
5. Identify affected modules and dependencies.
6. Determine which specialized agents are needed.

Do not invent undocumented functionality.

### Phase 2 — Architecture

Delegate architectural decisions to `api_integrator`.

Define:
- Data requirements.
- Domain contracts.
- Component interfaces.
- State management needs.
- Service boundaries.
- Mock requirements.
- Agent file ownership.

Communicate agreed contracts to `designer`.

### Phase 3 — Implementation

Delegate implementation based on responsibilities.

api_integrator:
- Architecture, services, hooks, state, mocks, and APIs.

designer:
- Visual components, layouts, interactions, and accessibility.

Run agents in parallel only when interfaces are agreed
and file ownership does not overlap.

Do not allow agents to overwrite each other's work.

### Phase 4 — Preliminary Validation

Before QA handoff, implementation agents must:

- Run relevant lint and type checks.
- Execute relevant existing tests.
- Verify component and service interfaces.
- Identify unresolved implementation errors.
- Report validation results and blockers.

Do not claim tests passed unless executed.

### Phase 5 — Independent QA

Delegate the integrated feature to `reviewer`.

The reviewer must:

1. Inspect the implementation and requirements.
2. Identify relevant test scenarios.
3. Create or update automated tests.
4. Execute relevant validation commands.
5. Evaluate functional correctness.
6. Review accessibility and responsive behavior.
7. Identify regressions and architectural problems.
8. Provide actionable findings.
9. Return an independent QA verdict.

### Phase 6 — Corrections

When defects are reported:

- Assign API and architecture defects to api_integrator.
- Assign UI and accessibility defects to designer.
- Coordinate fixes involving both agents.
- Preserve reviewer-owned tests.
- Re-run relevant checks after fixes.
- Request independent reviewer revalidation.

Do not silently ignore blocking findings.

Avoid endless correction cycles.
Report unresolved blockers when necessary.

### Phase 7 — Delivery

The orchestrator must:

1. Consolidate implementation results.
2. Confirm acceptance criteria.
3. Verify required checks.
4. Summarize reviewer findings.
5. Identify remaining limitations.
6. Report feature readiness.

Do not automatically commit, push, or merge.

## 15. QA Severity & Acceptance Policy

The reviewer classifies findings as:

P0 — Critical:
- Severe security vulnerabilities.
- Critical system failures.
- Core functionality unusable.

P1 — High:
- Broken features.
- Major accessibility barriers.
- Important regressions.
- Significant failures in critical flows.

P2 — Medium:
- Important edge cases.
- Usability issues.
- Non-critical accessibility problems.
- Maintainability issues with practical impact.

P3 — Low:
- Minor inconsistencies.
- Non-blocking improvements.

### QA Verdicts

PASS:
- Required checks completed successfully.
- No actionable defects remain.
- Acceptance criteria are satisfied.

PASS WITH WARNINGS:
- No confirmed P0 or P1 issues.
- Only non-blocking findings remain.
- Any unverified checks are clearly disclosed.

FAIL:
- P0 or P1 defects remain.
- Required validation checks fail.
- Acceptance criteria are not satisfied.

An unresolved P2 or P3 finding is also blocking
when it violates explicit acceptance criteria.

A PASS WITH WARNINGS is not automatic authorization
to merge.

The user makes the final integration decision.

## 16. Definition of Done

A feature is considered complete only when:

- Required functionality is implemented.
- Approved designs are respected.
- Relevant accessibility requirements are addressed.
- Responsive behavior has been verified.
- Loading, empty, success, and error states are handled.
- Relevant automated tests are implemented.
- Required local validation checks pass.
- The reviewer has completed independent QA.
- No confirmed blocking findings remain.
- Remaining limitations are documented.

For integration into main:

- The Pull Request must be ready.
- Required GitHub Actions checks must pass.
- Branch protection requirements must be satisfied.
- The user must authorize the merge.

Do not mark a feature as fully integrated
before its required merge conditions are satisfied.

## 17. Reporting Requirements

After completing a feature, the orchestrator reports:

1. Feature summary.
2. Files created or modified.
3. Architectural decisions.
4. Components and services implemented.
5. API endpoints or mocks used.
6. Automated tests added or updated.
7. Commands executed and validation results.
8. Accessibility and responsive considerations.
9. QA findings and final verdict.
10. Remaining risks, limitations, or dependencies.
11. Git branch and integration readiness.

Clearly distinguish completed work from pending work.

## 18. Project Constraints

- Do not invent requirements.
- Do not invent backend endpoints.
- Do not introduce new frameworks without approval.
- Do not modify unrelated code.
- Do not bypass Git hooks.
- Do not weaken tests to hide failures.
- Do not silently skip required validation.
- Do not expose credentials or sensitive information.
- Do not modify another agent's owned files unnecessarily.
- Do not claim validation succeeded unless executed.
- Do not claim GitHub CI passed without observing its results.
- Do not commit, push, merge, or deploy without authorization.
- Preserve the intended product behavior and visual design.
- Prioritize correctness, accessibility, and maintainability.
"""
