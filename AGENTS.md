# AGENTS
## Purpose
This guide tells coding agents how to work safely and consistently in this repository.
Default to small, behavior-preserving changes and validate frequently.

## Monorepo Snapshot
- Package manager: `npm` workspaces with `turbo`
- Apps: `apps/web` (React + Vite), `apps/mobile` (Expo)
- Packages: `packages/core`, `packages/ui`
- Primary tested surface: `apps/web`

## Build/Lint/Test Commands
Run from repo root unless noted.
```bash
npm install
npm run dev
npm run dev:web
npm run dev:mobile
npm run lint
npm run test
npm run test:run
npm run test:coverage
npm run build
npm run preview
npm run verify
```

Web workspace equivalents:
`npm run -w @easy-ledger/web lint`, `npm run -w @easy-ledger/web test:run`, `npm run -w @easy-ledger/web build`

## Single Test Commands (important)
Vitest config lives in `apps/web/vite.config.js` (JSDOM + setup file).
Run one test file:
```bash
npx vitest apps/web/src/hooks/useSync.test.js
```
Run tests matching a name:
```bash
npx vitest -t "syncs queued changes"
```
Run one file and one named test:
```bash
npx vitest apps/web/src/hooks/useSync.test.js -t "handles conflict"
```
Alternative via workspace script:
```bash
npm run -w @easy-ledger/web test:run -- src/hooks/useSync.test.js
```

## Validation Policy
- Run `npm run lint` after meaningful edits.
- Run `npm run build` before handoff for structural or dependency changes.
- If running both, run lint first, then build.
- For risky storage/sync/import/currency edits, run `npm run test:coverage`.
- For substantial work, prefer `npm run verify` before handoff.

## Agent Workflow Rules
- Keep behavior unchanged unless explicitly requested.
- Prefer incremental patches over broad rewrites.
- Never remove or revert unrelated user changes.
- Validate risky paths early (storage, sync, conversion, import/export).
- Preserve accessibility and desktop/mobile parity.

## Import Conventions
Use this import order:
1. React imports
2. Third-party packages
3. Components/views
4. Context providers/hooks
5. Domain hooks
6. Lib/utils/config
7. Styles/assets
Also:
- Remove unused imports immediately.
- Prefer named exports/imports for shared hooks and utilities.
- Keep path style consistent with nearby code.

## File Naming and Module Shape
- `.jsx` for JSX-rendering files
- `.js` for non-JSX modules
- Components/views: PascalCase (`DesktopDashboardView.jsx`)
- Hooks: `useX` (`useTransactionActions.js`)
- Utilities: camelCase (`appUtils.js`)
- Keep one primary responsibility per module

## Formatting Conventions
- 2-space indentation
- Single quotes
- No semicolons
- Trailing commas in multiline arrays/objects/args
- ~100 char soft line-length target
- Keep multiline JSX and objects vertically readable

## Types and Data Validation
- JavaScript-first codebase (no TypeScript project config).
- Enforce contracts with runtime guards/sanitizers.
- Reuse sanitizers from `apps/web/src/hooks/useStorageState.js`:
  - `sanitizeTransactions`
  - `sanitizeAccounts`
  - `sanitizeSettings`
- Use `Number.isFinite` for numeric safety.
- Check null/undefined and object shape before state mutations.
- JSDoc is encouraged when utility contracts are non-obvious.

## React and State Patterns
- Function components only.
- Keep render logic pure; use `useEffect` for side effects.
- Use `useMemo` for expensive derived data.
- Use `useCallback` for stable handlers/dependency safety.
- Prefer domain hooks for transitions (`useXActions`, `useXState`).
- Use early returns for invalid/no-op paths.

## Naming Conventions
- Handlers: `handleX`
- Booleans: `isX`, `hasX`, `showX`
- Setters: `setX`
- Utility functions: `getX`, `formatX`, `normalizeX`, `isX`
- Constants: `UPPER_SNAKE_CASE`

## Core Data Contracts
Transaction:
- `{ id, name, amount, category, date, type, currency, accountId, createdAt, updatedAt, isDeleted, deletedAt }`
Account:
- `{ id, name, createdAt }`
Settings:
- `{ baseCurrency, currencies, rates, ratesAsOf, syncedAt, ratesStale, privacy, customCategories, syncMeta }`

## Storage, Sync, and Currency Rules
- Use profile-scoped storage keys.
- Keep ordering deterministic via `createdAt`/`updatedAt`.
- Treat sync failures as recoverable UI state (never hard crash).
- Default base currency is `NGN`.
- Rate model: `1 baseCurrency = target rate`; base currency rate must be `1`.
- Surface missing rates in UI; do not silently skip conversion gaps.

## Date and Range Rules
- Persist transaction dates as `YYYY-MM-DD`.
- Keep range modes consistent: `this_month`, `last_month`, `custom`, `all_time`.

## Error Handling
- Prefer early returns for invalid input.
- Wrap expected async failure points in `try/catch`.
- Normalize errors via `apps/web/src/lib/errorHandling.js`.
- Return actionable user-facing messages and surface through toast context.

## UI, A11y, and Environment
- Prefer Tailwind utilities over adding new CSS files.
- Keep semantic HTML, explicit labels, and visible focus styles.
- Preserve keyboard interactions and responsive behavior.
- Use `import.meta.env`; only `VITE_*` values are client-exposed.
- Never hardcode secrets or tokens.

## Cursor/Copilot Rule Files
Checked in this repository:
- `.cursor/rules/`: not found
- `.cursorrules`: not found
- `.github/copilot-instructions.md`: not found
If these files are added later, merge their guidance into this document.
