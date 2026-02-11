export const normalizeCurrency = (value) => String(value || '').trim().toUpperCase()

export const isValidCurrency = (value) => /^[A-Z]{3,5}$/.test(value)

export const sanitizeCurrency = (value, fallback) => {
  const normalized = normalizeCurrency(value)
  return isValidCurrency(normalized) ? normalized : fallback
}

export const getRateForCurrency = (rates, baseCurrency, currency) => {
  if (!currency) return null
  if (currency === baseCurrency) return 1
  const rate = rates?.[currency]
  return typeof rate === 'number' && rate > 0 ? rate : null
}

export const toBaseAmount = (amount, currency, baseCurrency, rates) => {
  const rate = getRateForCurrency(rates, baseCurrency, currency)
  if (!rate || !Number.isFinite(amount)) return null
  return amount / rate
}
