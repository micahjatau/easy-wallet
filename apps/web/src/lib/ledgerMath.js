import { getRateForCurrency, toBaseAmount } from './currency.js'

const DATE_INPUT_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

const toYmdString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseYmdToDate = (value) => {
  if (typeof value !== 'string') return null
  const match = DATE_INPUT_REGEX.exec(value.trim())
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const parsed = new Date(year, month, day)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date, days) => {
  const next = new Date(date.getTime())
  next.setDate(next.getDate() + days)
  return startOfDay(next)
}

// Re-export for backward compatibility
export { getRateForCurrency, toBaseAmount }

export const normalizeDateToYMD = (value) => {
  if (!value) return ''
  if (value instanceof Date) {
    return toYmdString(value)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (DATE_INPUT_REGEX.test(trimmed)) return trimmed
    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) return ''
    return toYmdString(parsed)
  }
  return ''
}

export const getMonthRange = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  return { start, end }
}

export const getLastMonthRange = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  const end = new Date(date.getFullYear(), date.getMonth(), 1)
  return { start, end }
}

export const isWithinRange = (txDate, range) => {
  if (!range || (!range.start && !range.end)) return true
  let parsed = null
  if (txDate instanceof Date) {
    parsed = startOfDay(txDate)
  } else {
    const parsedDate = parseYmdToDate(normalizeDateToYMD(txDate))
    if (!parsedDate) return false
    parsed = startOfDay(parsedDate)
  }
  if (Number.isNaN(parsed.getTime())) return false
  if (range.start && parsed < range.start) return false
  if (range.end && parsed >= range.end) return false
  return true
}

export const filterTransactions = (
  transactions,
  { range, includeDeleted = false } = {},
) => {
  if (!Array.isArray(transactions)) return []
  return transactions.filter((transaction) => {
    if (!includeDeleted && transaction.isDeleted) return false
    return isWithinRange(transaction.date, range)
  })
}

export const computeTotals = (transactions, settings, ratesOverride) => {
  const baseCurrency = settings?.baseCurrency
  const rates = ratesOverride || settings?.rates || {}
  return transactions.reduce(
    (accumulator, transaction) => {
      const baseAmount = toBaseAmount(
        Number(transaction.amount),
        transaction.currency,
        baseCurrency,
        rates,
      )
      if (baseAmount === null) {
        accumulator.missingRatesCount += 1
        return accumulator
      }
      if (transaction.type === 'income') {
        accumulator.incomeBase += baseAmount
      } else {
        accumulator.expenseBase += baseAmount
      }
      accumulator.balanceBase = accumulator.incomeBase - accumulator.expenseBase
      return accumulator
    },
    {
      incomeBase: 0,
      expenseBase: 0,
      balanceBase: 0,
      missingRatesCount: 0,
    },
  )
}

export const computeCategoryTotals = (transactions, settings, ratesOverride) => {
  const baseCurrency = settings?.baseCurrency
  const rates = ratesOverride || settings?.rates || {}
  return transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type !== 'expense') return accumulator
      const baseAmount = toBaseAmount(
        Number(transaction.amount),
        transaction.currency,
        baseCurrency,
        rates,
      )
      if (baseAmount === null) {
        accumulator.missingRatesCount += 1
        return accumulator
      }
      const category = transaction.category || 'Other'
      accumulator.totalsByCategory[category] =
        (accumulator.totalsByCategory[category] || 0) + baseAmount
      return accumulator
    },
    { totalsByCategory: {}, missingRatesCount: 0 },
  )
}

export const buildCustomRange = (startValue, endValue) => {
  const start = parseYmdToDate(startValue)
  const endInclusive = parseYmdToDate(endValue)
  const end = endInclusive ? addDays(endInclusive, 1) : null
  return {
    start: start ? startOfDay(start) : null,
    end,
  }
}

export const getTodayRangeEnd = () => {
  return addDays(startOfDay(new Date()), 1)
}
