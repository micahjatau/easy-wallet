const DATE_INPUT_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

const parseYmdToLocalDate = (value) => {
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

export const formatMoney = (amount, currency) => {
  if (!Number.isFinite(amount)) return '--'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export const formatDate = (value) => {
  if (!value) return ''
  let parsed = null
  if (value instanceof Date) {
    parsed = value
  } else if (typeof value === 'string') {
    parsed = parseYmdToLocalDate(value) || new Date(value)
  } else if (typeof value === 'number') {
    parsed = new Date(value)
  } else {
    parsed = new Date(value)
  }
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return typeof value === 'string' ? value : ''
  }
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

export const formatTimestamp = (value) => {
  if (!value) return 'Never'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

export const formatRate = (value) => {
  if (!Number.isFinite(value)) return '--'
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 4,
  }).format(value)
}
