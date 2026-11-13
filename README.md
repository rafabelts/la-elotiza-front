# La Elotiza frontend

Initial application foundation based on `docs/requirements.md`, `docs/design-system.md`, and `docs/prototipo/`.

## Run locally

Use the latest Node.js 24 LTS (`nvm install` then `nvm use`) and npm. The test environment requires Node 22.22.2+, 24.15.0+, or 26+ in the corresponding supported major lines; see `engines.node` in `package.json`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build` followed by `npm start`.

## Validation

```sh
npm run lint
npm run typecheck
npm run test:ci
npm run build
# Run the same complete sequence used by pre-push and CI:
npm run check
```

Type checking generates Next.js route types first, so it works on a clean checkout. ESLint excludes the preserved prototype and agent reference directories. `npm test` runs Vitest in watch mode; `npm run test:ci` runs once and fails when no tests are found. Vitest discovers `src/**/*.test.{ts,tsx}` with jsdom, React Testing Library, jest-dom assertions, and explicit test cleanup in `src/test/setup.ts`. Tests needing server behavior select the Node environment per file. The Vite transformer honors the existing automatic JSX setting and the test config mirrors the `@/` source alias, without adding extra transform plugins.

Tests cover the synchronous home shell's semantic structure and keyboard skip link, plus Query cache isolation, reuse, retries, and provider remount behavior. These are behavioral checks, not a coverage percentage or browser-level accessibility certification. Async Server Components and browser layout should be tested with appropriate E2E tooling when introduced.

ESLint 9 is retained for compatibility with the React, import, and JSX accessibility plugins bundled by Next.js; those plugins do not yet declare ESLint 10 support. npm marks ESLint 9 deprecated. TypeScript 5.9 is within the installed TypeScript ESLint parser's supported range. Upgrade these together when their peer ranges align.

The initial dependency audit reports seven moderate development-only findings stemming from `minimatch` in TypeScript ESLint. `npm audit fix` did not resolve them; no forced major-version overrides are applied. Recheck upstream tooling updates before expanding CI to process untrusted sources.

## Git workflow and quality gates

Use branches from the latest `main`, named `feat/<name>`, `fix/<name>`, `chore/<name>`, `refactor/<scope>`, or `test/<scope>`. Keep work focused and open a pull request targeting `main`; follow `AGENTS.md` for approval requirements. Do not bypass hooks to submit failing changes.

This workspace currently has no `.git` directory. Git initialization and remote setup are manual prerequisites; there is no current branch or tracked-file inventory, and hooks cannot be installed here yet. After initializing Git or using a real clone, run `npm ci` (or `npm run prepare` if dependencies are already installed), then verify `git config --get core.hooksPath` prints `.husky/_` and the generated `.husky/_/pre-commit` and `.husky/_/pre-push` files exist. Husky's generated runner is ignored; the two hook source files must be committed with the project. If npm reports `.git can't be found`, installation has not activated the hooks.

- Pre-commit runs lint followed by type checking, stopping on failure.
- Pre-push runs `npm run check`: lint, type checking, tests, then production build. A failure stops the sequence and rejects the push.
- GitHub Actions uses `npm ci`, Node from `.nvmrc`, and those same four commands on pushes to `main` and all supported branch prefixes, pull requests targeting `main`, and manual dispatch. The workflow has read-only repository permissions, pinned action commits, no persisted checkout credentials, and no secret-dependent steps.

The CI definition can be reviewed locally, but an actual GitHub run is still required to verify hosted execution. Once the repository is published with authorization, enable a ruleset protecting `main`: require pull requests and the `Frontend Quality Gate` status check, require approval before merging, block force pushes and branch deletion, and restrict bypass permissions. Select the actual check after its first successful run. Branch protection is a GitHub repository setting; this checkout does not apply or verify it.

Before the first commit, inspect `git status` and tracked files for secrets and generated output. `.gitignore` excludes environment files (except a non-secret `.env.example`), dependencies, build output, caches, coverage, browser test artifacts, and generated Husky runners. Ignoring a path does not remove any file already tracked in an existing repository.

## Architecture and scope

- `src/app`: App Router routes, server layout, global design tokens, and the client Query provider.
- `src/components`: shared presentation, initially the branded application shell.
- `src/lib/query-client.ts`: TanStack Query client construction and lifecycle.
- `public`: application assets copied from the prototype.

The page and layout remain Server Components. The provider is the only client boundary needed for the initial setup. It accepts server-rendered children without making them Client Components. Query clients are isolated on the server and reused in the browser, with a 60-second stale time, one query retry, and no automatic mutation retries. No persistence or additional global state is introduced.

There are no product workflows, authentication, backend endpoints, or data requests in this foundation. Consequently, it does not add unused mock entities or fake API responses. When the first feature is added, define its provisional typed service interface inside `src/features/<feature>/`, implement an asynchronous mock behind that interface, and inject the service into query options/hooks. Keep fixtures and transport separate from presentation. A real implementation must satisfy the same interface once the backend contract is available; never silently fall back from failed real requests to mocks. Validate external responses at that boundary when introduced. Keep credentials server-side.

Add accessible loading, empty, and error states alongside the first asynchronous feature, including failure and cancellation coverage. This static foundation does not simulate a connected register, session, or sale.

## Assets

The existing `docs/` and `.codex/` directories are preserved. Figtree is bundled locally through `next/font/local`, avoiding network requests during builds and page loads. Its source is the Google Fonts repository (`ofl/figtree`), with its SIL Open Font License beside the font in `src/app/fonts/`.

Framework setup references: [Next.js ESLint](https://nextjs.org/docs/app/api-reference/config/eslint), [TanStack Query App Router integration](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).
