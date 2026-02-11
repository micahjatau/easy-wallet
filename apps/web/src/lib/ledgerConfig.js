export const APP_NAME = 'Easy Wallet'
export const APP_SLUG = 'easy-wallet'
export const SCHEMA_VERSION = 2
export const STORAGE_KEY = `${APP_SLUG}-state`
export const LEGACY_STORAGE_KEY = 'expense-tracker:v1'
export const DEFAULT_ACCOUNT_NAME = 'Cash'
export const EXCHANGE_API_PRIMARY =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies'
export const EXCHANGE_API_FALLBACK =
  'https://latest.currency-api.pages.dev/v1/currencies'

export const DEFAULT_CATEGORIES = [
  'Food',
  'Rent',
  'Utilities',
  'Transport',
  'Shopping',
  'Health',
  'Fun',
  'Travel',
  'Other',
]

// Immutable default categories - use getAllCategories(settings) to include custom categories
export const CATEGORY_OPTIONS = [...DEFAULT_CATEGORIES]

export const CATEGORY_COLORS = [
  '#2f6f6d',
  '#f2b866',
  '#ee8c65',
  '#6d8b74',
  '#c78552',
  '#3e6165',
  '#d48a6a',
  '#8da394',
  '#b1856c',
]

export const DEFAULT_SETTINGS = {
  baseCurrency: 'NGN',
  currencies: ['NGN'],
  rates: { NGN: 1 },
  ratesAsOf: null,
  syncedAt: null,
  syncMeta: {
    lastRemoteVersion: 0,
    lastRemoteUpdatedAt: null,
  },
  ratesStale: false,
  privacy: {
    dataRetentionDays: 90,
    autoBackup: true,
    lastExportAt: null,
    storageUsage: {
      localBytes: 0,
      remoteBytes: 0,
    },
  },
}
