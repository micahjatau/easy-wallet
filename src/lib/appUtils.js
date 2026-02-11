import { formatDate } from './formatters.js'
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORIES,
} from './ledgerConfig.js'
import {
  getMonthRange,
  getTodayRangeEnd,
  normalizeDateToYMD,
} from './ledgerMath.js'

export const formatLocalYmd = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getToday = () => formatLocalYmd(new Date())

export const getRangeEndDisplay = (rangeEnd) => {
  if (!rangeEnd) return null
  const end = new Date(rangeEnd.getTime())
  end.setDate(end.getDate() - 1)
  return end
}

export const getThisMonthRange = () => {
  const fullRange = getMonthRange(new Date())
  const todayEnd = getTodayRangeEnd()
  const end = todayEnd < fullRange.end ? todayEnd : fullRange.end
  return { start: fullRange.start, end }
}

export const getDefaultCustomDates = () => {
  const range = getThisMonthRange()
  const endDisplay = getRangeEndDisplay(range.end) || range.start
  return {
    customStart: normalizeDateToYMD(range.start),
    customEnd: normalizeDateToYMD(endDisplay),
  }
}

export const getRangeLabel = (mode, range) => {
  if (mode === 'all_time') return 'All time'
  const startLabel = range?.start ? formatDate(range.start) : ''
  const endDisplay = getRangeEndDisplay(range?.end)
  const endLabel = endDisplay ? formatDate(endDisplay) : ''
  if (mode === 'this_month') {
    return endLabel ? `This month (${startLabel} - ${endLabel})` : 'This month'
  }
  if (mode === 'last_month') {
    return endLabel ? `Last month (${startLabel} - ${endLabel})` : 'Last month'
  }
  if (mode === 'custom') {
    if (startLabel && endLabel) return `${startLabel} - ${endLabel}`
    if (startLabel) return `From ${startLabel}`
    if (endLabel) return `Through ${endLabel}`
  }
  return 'Custom range'
}

export const toCsvValue = (value) => {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  // Escape fields containing quotes, commas, newlines, or carriage returns
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const getCategoryAccent = (category) => {
  const index = DEFAULT_CATEGORIES.indexOf(category)
  const color = CATEGORY_COLORS[
    index >= 0 ? index : CATEGORY_COLORS.length - 1
  ]
  const initials = category
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return { color, initials }
}

export const getDefaultFormState = (baseCurrency, accountId, type) => ({
  name: '',
  amount: '',
  category: DEFAULT_CATEGORIES[0],
  date: getToday(),
  type: type || 'expense',
  currency: baseCurrency,
  accountId: accountId || '',
})
