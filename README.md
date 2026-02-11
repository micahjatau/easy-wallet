# Easy Wallet

A local-first, multi-currency expense tracker with a calm editorial dashboard and category insights.

## Monorepo Layout
- `apps/web` - existing React + Vite app
- `apps/mobile` - Expo Router app (mobile-first)
- `packages/core` - shared currency and ledger math utilities
- `packages/ui` - shared Tamagui config and primitives

## Getting Started
```sh
npm install
npm run dev:web
```

Start mobile:

```sh
npm run dev:mobile
```

## Root Scripts
- `npm run dev` - temporary fallback to `dev:web` (kept for one release cycle)
- `npm run dev:web` - run web app through Turbo
- `npm run dev:mobile` - run mobile app through Turbo
- `npm run lint` - run workspace lint tasks
- `npm run test` - run workspace test tasks
- `npm run build` - run workspace build tasks
- `npm run verify` - run workspace verify tasks
- `npm run preview` - preview web production build

## Features
- Record income and expense transactions with categories and dates
- Edit transactions with a quick inline form
- Soft delete with restore support
- Accounts/wallets for assigning and filtering transactions
- Multi-currency entries with a configurable base currency
- Manual exchange-rate refresh from currency-api
- Dashboard totals, balance, and spending mix chart
- Search and filter activity
- Export/import JSON and CSV
- localStorage persistence with safe fallbacks

## Tech Stack
- React 19 + Vite 7
- Expo Router (React Native)
- Tamagui (mobile UI system)
- Tailwind CSS (custom theme)
- Recharts

## Data Model
- Transaction: `{ id, name, amount, category, date, type, currency, accountId, createdAt, updatedAt, isDeleted, deletedAt }`
- Account: `{ id, name, createdAt }`
- Settings: `{ baseCurrency, currencies, rates, lastRatesAt }`

## Storage
- localStorage key: `easy-ledger-state`
- Stored payload: `{ transactions, settings, accounts }`
- Parsing errors fall back to defaults; the app remains usable

## Currency and Rates
- Base currency defaults to `NGN`
- Rates represent `1 baseCurrency = rate in target currency`
- Base conversion: `amount / rate`
- Missing rates exclude transactions from totals and charts
- Base currency rate is always `1`

## Project Layout
- `apps/web/index.html` mounts the web app in `#root`
- `apps/web/src/main.jsx` bootstraps React and imports `apps/web/src/index.css`
- `apps/web/src/App.jsx` contains the main UI and logic
- `apps/web/tailwind.config.js` and `apps/web/postcss.config.js` configure Tailwind

## Tests
- Test runner: Vitest + React Testing Library
- Run all tests once: `npm run test:run`
- Watch mode: `npm run test`
- Coverage: `npm run test:coverage` (outputs to `coverage/`)
- Run a single file: `npx vitest src/path/file.test.jsx`
- Run by test name: `npx vitest -t "test name"`

## Before Opening a PR
Run:

```sh
npm run verify
```
