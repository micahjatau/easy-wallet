import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CATEGORY_OPTIONS,
  DEFAULT_ACCOUNT_NAME,
  DEFAULT_SETTINGS,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
} from '../lib/ledgerConfig.js'
import {
  isValidCurrency,
  normalizeCurrency,
  sanitizeCurrency,
} from '@easy-ledger/core'
import { sanitizeDate } from '../lib/dateValidation.js'
import { dedupeTransactions } from '../lib/deduplication.js'

const toYmdString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const getAccountId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `acct-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const createDefaultAccount = () => ({
  id: getAccountId(),
  name: DEFAULT_ACCOUNT_NAME,
  createdAt: Date.now(),
})

export const sanitizeAccounts = (rawAccounts) => {
  if (!Array.isArray(rawAccounts)) {
    return [createDefaultAccount()]
  }
  const accounts = []
  const seenIds = new Set()
  rawAccounts.forEach((rawAccount) => {
    if (!rawAccount || typeof rawAccount !== 'object') return
    const name =
      typeof rawAccount.name === 'string' ? rawAccount.name.trim() : ''
    if (!name) return
    const rawId =
      typeof rawAccount.id === 'string' || typeof rawAccount.id === 'number'
        ? String(rawAccount.id).trim()
        : ''
    const id = rawId || getAccountId()
    if (seenIds.has(id)) return
    const createdAtValue = Number(rawAccount.createdAt)
    const createdAt = Number.isFinite(createdAtValue)
      ? createdAtValue
      : Date.now()
    accounts.push({ id, name, createdAt })
    seenIds.add(id)
  })
  if (accounts.length === 0) {
    accounts.push(createDefaultAccount())
  }
  return accounts
}

export const sanitizeSettings = (rawSettings) => {
  const baseCurrency = sanitizeCurrency(
    rawSettings?.baseCurrency,
    DEFAULT_SETTINGS.baseCurrency,
  )
  const currencies = Array.isArray(rawSettings?.currencies)
    ? rawSettings.currencies
        .map((currency) => normalizeCurrency(currency))
        .filter((currency) => isValidCurrency(currency))
    : [baseCurrency]
  const uniqueCurrencies = Array.from(new Set(currencies))
  if (!uniqueCurrencies.includes(baseCurrency)) {
    uniqueCurrencies.unshift(baseCurrency)
  }
  if (uniqueCurrencies.length === 0) {
    uniqueCurrencies.push(baseCurrency)
  }
  const rawRates =
    rawSettings?.rates && typeof rawSettings.rates === 'object'
      ? rawSettings.rates
      : {}
  const normalizedRates = Object.entries(rawRates).reduce(
    (accumulator, [code, value]) => {
      const normalizedCode = normalizeCurrency(code)
      if (!isValidCurrency(normalizedCode)) return accumulator
      accumulator[normalizedCode] = value
      return accumulator
    },
    {},
  )
  const rateCodes = Array.from(
    new Set([...uniqueCurrencies, ...Object.keys(normalizedRates)]),
  )
  const rates = {}
  rateCodes.forEach((code) => {
    if (code === baseCurrency) {
      rates[code] = 1
      return
    }
    const parsedRate = Number(normalizedRates?.[code])
    rates[code] = Number.isFinite(parsedRate) && parsedRate > 0 ? parsedRate : null
  })
  const legacyLastRatesAt =
    typeof rawSettings?.lastRatesAt === 'string' ||
    typeof rawSettings?.lastRatesAt === 'number'
      ? rawSettings.lastRatesAt
      : null
  const syncedAt =
    typeof rawSettings?.syncedAt === 'string' ||
    typeof rawSettings?.syncedAt === 'number'
      ? rawSettings.syncedAt
      : legacyLastRatesAt || DEFAULT_SETTINGS.syncedAt
  const ratesAsOf =
    typeof rawSettings?.ratesAsOf === 'string' ||
    typeof rawSettings?.ratesAsOf === 'number'
      ? rawSettings.ratesAsOf
      : legacyLastRatesAt || DEFAULT_SETTINGS.ratesAsOf
  const ratesStale = Boolean(rawSettings?.ratesStale)

  const rawSyncMeta =
    rawSettings?.syncMeta && typeof rawSettings.syncMeta === 'object'
      ? rawSettings.syncMeta
      : {}
  const parsedRemoteVersion = Number(rawSyncMeta.lastRemoteVersion)
  const lastRemoteVersion =
    Number.isFinite(parsedRemoteVersion) && parsedRemoteVersion >= 0
      ? parsedRemoteVersion
      : DEFAULT_SETTINGS.syncMeta.lastRemoteVersion
  const lastRemoteUpdatedAt =
    typeof rawSyncMeta.lastRemoteUpdatedAt === 'string' ||
    typeof rawSyncMeta.lastRemoteUpdatedAt === 'number'
      ? rawSyncMeta.lastRemoteUpdatedAt
      : DEFAULT_SETTINGS.syncMeta.lastRemoteUpdatedAt

  const privacySettings = rawSettings?.privacy || {}
  const dataRetentionDays = Number.isFinite(Number(privacySettings.dataRetentionDays))
    ? Number(privacySettings.dataRetentionDays)
    : 90
  const autoBackup = privacySettings.autoBackup !== false
  const lastExportAt =
    typeof privacySettings.lastExportAt === 'number'
      ? privacySettings.lastExportAt
      : null
  const storageUsage = {
    localBytes: Number(privacySettings.storageUsage?.localBytes) || 0,
    remoteBytes: Number(privacySettings.storageUsage?.remoteBytes) || 0,
  }
  
  // Handle custom categories
  const customCategories = Array.isArray(rawSettings?.customCategories)
    ? rawSettings.customCategories.filter(cat => typeof cat === 'string' && cat.trim())
    : []

  return {
    baseCurrency,
    currencies: uniqueCurrencies,
    rates,
    ratesAsOf,
    syncedAt,
    syncMeta: {
      lastRemoteVersion,
      lastRemoteUpdatedAt,
    },
    ratesStale,
    customCategories,
    privacy: {
      dataRetentionDays,
      autoBackup,
      lastExportAt,
      storageUsage,
    },
  }
}

// Helper to get all categories including custom ones
export const getAllCategories = (settings) => {
  const customCategories = settings?.customCategories || []
  return [...CATEGORY_OPTIONS, ...customCategories.filter(cat => !CATEGORY_OPTIONS.includes(cat))]
}

const sanitizeTransaction = (rawTransaction, settings, accounts) => {
  if (!rawTransaction || typeof rawTransaction !== 'object') return null

  const name =
    typeof rawTransaction.name === 'string' ? rawTransaction.name.trim() : ''
  const amount = Number(rawTransaction.amount)
  const type =
    rawTransaction.type === 'income' || rawTransaction.type === 'expense'
      ? rawTransaction.type
      : 'expense'
  const currency = sanitizeCurrency(
    rawTransaction.currency,
    settings?.baseCurrency || DEFAULT_SETTINGS.baseCurrency,
  )
  const rawCategory =
    typeof rawTransaction.category === 'string'
      ? rawTransaction.category.trim()
      : ''
  const allCategories = [...CATEGORY_OPTIONS, ...(settings?.customCategories || [])]
  const category = allCategories.includes(rawCategory) ? rawCategory : 'Other'
  const rawDate =
    typeof rawTransaction.date === 'string' ? rawTransaction.date : ''
  const createdAtValue = Number(rawTransaction.createdAt)
  const createdAt = Number.isFinite(createdAtValue) ? createdAtValue : Date.now()
  // Use strict date validation (rejects invalid calendar dates like Feb 31)
  const date = sanitizeDate(rawDate) ?? toYmdString(new Date(createdAt))
  const rawId =
    typeof rawTransaction.id === 'string' ||
    typeof rawTransaction.id === 'number'
      ? String(rawTransaction.id).trim()
      : ''
  const id = rawId || getId()
  const defaultAccountId = accounts?.[0]?.id || ''
  const rawAccountId =
    typeof rawTransaction.accountId === 'string' ||
    typeof rawTransaction.accountId === 'number'
      ? String(rawTransaction.accountId).trim()
      : ''
  const accountId = accounts?.some((account) => account.id === rawAccountId)
    ? rawAccountId
    : defaultAccountId
  const updatedAtValue = Number(rawTransaction.updatedAt)
  const updatedAt = Number.isFinite(updatedAtValue) ? updatedAtValue : null
  const isDeleted = Boolean(rawTransaction.isDeleted)
  const deletedAtValue = Number(rawTransaction.deletedAt)
  const deletedAt =
    isDeleted && Number.isFinite(deletedAtValue) ? deletedAtValue : null

  if (!name || !Number.isFinite(amount) || amount <= 0 || !accountId) {
    return null
  }

  return {
    id,
    name,
    amount,
    category,
    date,
    type,
    currency,
    createdAt,
    accountId,
    updatedAt,
    isDeleted,
    deletedAt,
  }
}

export const sanitizeTransactions = (rawTransactions, settings, accounts) => {
  if (!Array.isArray(rawTransactions)) return []
  const sanitized = rawTransactions
    .map((transaction) => sanitizeTransaction(transaction, settings, accounts))
    .filter(Boolean)
  // Deduplicate by ID, keeping newest by updatedAt
  return dedupeTransactions(sanitized)
}

const getDefaultState = () => {
  const defaultAccount = createDefaultAccount()
  return {
    transactions: [],
    settings: DEFAULT_SETTINGS,
    accounts: [defaultAccount],
  }
}

const getStorageKey = (profileId) => {
  if (!profileId) return STORAGE_KEY
  return `${STORAGE_KEY}-${profileId}`
}

const migrateStoredState = (profileId) => {
  try {
    const key = getStorageKey(profileId)
    const current = localStorage.getItem(key)
    if (current) return current
    
    // If no profile-specific data, try legacy storage for default profile
    if (!profileId || profileId === 'default') {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacy) {
        localStorage.setItem(key, legacy)
        return legacy
      }
    }
    return null
  } catch {
    return null
  }
}

const loadStoredState = (profileId) => {
  if (typeof window === 'undefined') {
    return getDefaultState()
  }
  try {
    const raw = migrateStoredState(profileId)
    if (!raw) {
      return getDefaultState()
    }
    const parsed = JSON.parse(raw)
    const settings = sanitizeSettings(parsed?.settings)
    const accounts = sanitizeAccounts(parsed?.accounts)
    const transactions = sanitizeTransactions(
      parsed?.transactions,
      settings,
      accounts,
    )
    return { transactions, settings, accounts }
  } catch {
    return getDefaultState()
  }
}

const saveStoredState = (nextState, profileId) => {
  try {
    const key = getStorageKey(profileId)
    localStorage.setItem(key, JSON.stringify(nextState))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error,
      quotaExceeded: error.name === 'QuotaExceededError' || error.code === 22,
    }
  }
}

export const useStorageState = (profileId, onStorageError) => {
  const initialState = useMemo(() => loadStoredState(profileId), [profileId])
  const [transactions, setTransactions] = useState(initialState.transactions)
  const [settings, setSettings] = useState(initialState.settings)
  const [accounts, setAccounts] = useState(initialState.accounts)
  const previousProfileIdRef = useRef(profileId)

  // Reset state when profileId changes to prevent data from previous profile persisting
  useEffect(() => {
    if (previousProfileIdRef.current !== profileId) {
      const newState = loadStoredState(profileId)
      setTransactions(newState.transactions)
      setSettings(newState.settings)
      setAccounts(newState.accounts)
      previousProfileIdRef.current = profileId
    }
  }, [profileId])

  useEffect(() => {
    const result = saveStoredState({ transactions, settings, accounts }, profileId)
    if (!result?.success && onStorageError) {
      onStorageError(result.error)
    }
  }, [transactions, settings, accounts, profileId, onStorageError])

  return {
    transactions,
    setTransactions,
    settings,
    setSettings,
    accounts,
    setAccounts,
  }
}

export { getStorageKey }
