# AGENTS

## Purpose
This guide tells coding agents how to work safely and consistently in this repository.
Prefer small, behavior-preserving changes and validate frequently.

## Stack Snapshot
- React 19 + Vite 7
- JavaScript + JSX (ES modules, `"type": "module"`)
- Tailwind CSS + PostCSS
- Firebase (Auth + Firestore sync flows)
- Recharts + react-window (charts and list performance)
- localStorage persistence with profile-scoped keys

## Repository Commands
Use these scripts from `package.json`:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:run
npm run test:coverage
npm run verify
```

## Build/Lint/Test Command Policy
- Run `npm run lint` after meaningful edits.
- Run `npm run build` for structural changes, dependency/wiring changes, or before handoff.
- If both run, execute lint first, then build.
- For risky state/sync/storage/import changes, run `npm run test:coverage`.
- Before handoff on significant work, prefer `npm run verify`.

### Lint (full and targeted)
```bash
npm run lint
npx eslint src/path/to/file.js
npx eslint src/path/to/file.jsx
```

### Test Status (current repo)
- `test` and `test:run` scripts exist in `package.json`.
- `test:coverage` and `verify` scripts exist in `package.json`.
- Vitest + React Testing Library are configured with JSDOM.
- Tests are present under `src/`.

### Single-Test Guidance
Use Vitest + React Testing Library.

Run a single test file or test name:

```bash
npx vitest src/path/file.test.jsx
npx vitest -t "test name"
npx vitest src/path/file.test.jsx -t "test name"
```

## Workflow Rules for Agents
- Keep behavior unchanged unless explicitly asked to change behavior.
- Favor incremental patches over broad rewrites.
- Do not remove unrelated user changes.
- Validate early when touching risky flows (storage, sync, currency conversion).
- Preserve accessibility and mobile/desktop parity.

## Import Conventions
Use stable import order:
1. React imports
2. External packages
3. Components/views
4. Context hooks/providers
5. App/domain hooks
6. Utility/lib/config imports
7. Styles/assets

Also:
- Remove unused imports immediately.
- Prefer named exports/imports for shared utilities and hooks.

## File Naming and Module Shape
- `.jsx` for files that render JSX.
- `.js` for non-JSX modules.
- Components/views: PascalCase (`DesktopDashboardView.jsx`).
- Hooks: `useX` naming (`useTransactionActions.js`).
- Utility modules: camelCase (`appUtils.js`, `ledgerMath.js`).
- Keep one primary responsibility per module.

## Formatting Conventions
- 2-space indentation
- Single quotes
- No semicolons
- Trailing commas in multiline objects/arrays/args
- Readable line length (~100 char soft target)
- Keep JSX props and object literals vertically aligned when multiline

## Types and Data Validation (JS project)
- This is JavaScript-first (no TypeScript config present).
- Enforce data contracts with runtime guards and sanitizers.
- Sanitize loaded/imported state with:
  - `sanitizeTransactions`
  - `sanitizeAccounts`
  - `sanitizeSettings`
- Use `Number.isFinite`, null checks, and shape checks before mutating state.
- Optional JSDoc is fine for non-obvious utility contracts.

## React/State Patterns
- Function components only.
- Keep render paths pure; move side effects to `useEffect`.
- Use `useMemo` for expensive derived values/selectors.
- Use `useCallback` for handlers passed deeply or used in deps.
- Prefer domain hooks for state transitions (`useXActions`, `useXState`).
- Use early returns for invalid input and no-op paths.

## Naming Conventions
- Handlers: `handleX` (`handleSubmit`, `handleDelete`)
- Booleans: `isX`, `hasX`, `showX`
- Setters: `setX`
- Utility functions: `getX`, `formatX`, `normalizeX`, `isX`
- Constants: `UPPER_SNAKE_CASE`

## Data Contracts
Transaction:
- `{ id, name, amount, category, date, type, currency, accountId, createdAt, updatedAt, isDeleted, deletedAt }`

Account:
- `{ id, name, createdAt }`

Settings:
- `{ baseCurrency, currencies, rates, ratesAsOf, syncedAt, ratesStale, privacy, customCategories }`

## Storage, Sync, and Currency Rules
- Use profile-scoped keys (`STORAGE_KEY` + profile suffix when applicable).
- Keep ordering deterministic with `createdAt`/`updatedAt`.
- Treat sync failures as recoverable UI states; never hard-crash.
- Default base currency is `NGN`.
- Rate model is `1 baseCurrency = target rate`; base currency rate must be `1`.
- Surface missing rates in UI; do not silently ignore conversion gaps.

## Date and Range Rules
- Persist transaction dates as `YYYY-MM-DD`.
- Keep range modes consistent: `this_month`, `last_month`, `custom`, `all_time`.

## Error Handling
- Prefer early returns for invalid inputs.
- Wrap expected async failure points in `try/catch`.
- Normalize errors through shared helpers in `src/lib/errorHandling.js`.
- Return actionable, user-readable messages and surface via toast context.

## UI, Accessibility, and Environment
- Prefer Tailwind utility classes over introducing new CSS files.
- Keep semantic HTML, explicit labels, and visible focus states.
- Preserve keyboard interaction paths.
- Use `import.meta.env`; only `VITE_*` vars are client-exposed.
- Never hardcode secrets.

## External Agent Rule Files
Checked in this repository:
- `.cursor/rules/`: not found
- `.cursorrules`: not found
- `.github/copilot-instructions.md`: not found

If any are added later, merge their guidance into this file.
