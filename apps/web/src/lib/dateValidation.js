/**
 * ISO 8601 date validation with calendar correctness
 * Industry standard: explicit validation before Date construction
 */

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

/**
 * Check if year is a leap year
 */
const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/**
 * Get days in month (accounting for leap years)
 */
const getDaysInMonth = (year, month) => {
  // Month is 1-indexed (1 = January)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 2 && isLeapYear(year)) return 29
  return daysInMonth[month - 1]
}

/**
 * Validate date string format and calendar correctness
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {{valid: boolean, error?: string, date?: Date}}
 */
export const validateDate = (dateStr) => {
  // Format check
  if (!ISO_DATE_REGEX.test(dateStr)) {
    return { valid: false, error: 'Invalid format. Expected YYYY-MM-DD' }
  }

  const [yearStr, monthStr, dayStr] = dateStr.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)

  // Range checks
  if (year < 1900 || year > 2100) {
    return { valid: false, error: 'Year must be between 1900 and 2100' }
  }
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Month must be between 1 and 12' }
  }

  const maxDays = getDaysInMonth(year, month)
  if (day < 1 || day > maxDays) {
    return {
      valid: false,
      error: `Invalid day for month. ${month}/${year} has ${maxDays} days`,
    }
  }

  // Safe to construct (use local midnight, not UTC)
  const date = new Date(year, month - 1, day)

  return { valid: true, date }
}

/**
 * Sanitize date input, returning normalized string or null
 * @param {string} dateStr
 * @returns {string|null} - Normalized YYYY-MM-DD or null if invalid
 */
export const sanitizeDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null

  const result = validateDate(dateStr)
  if (!result.valid) return null

  // Return normalized string (preserves local date)
  const d = result.date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Parse date for comparison (local midnight)
 * Industry standard: financial apps use local time boundaries
 */
export const parseDateLocal = (dateStr) => {
  const result = validateDate(dateStr)
  return result.valid ? result.date : null
}

/**
 * Get start of day in local timezone
 */
export const startOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day in local timezone
 */
export const endOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Check if date is within range (inclusive, local timezone)
 * @param {string|Date} date - Date to check
 * @param {string|Date} startDate - Range start
 * @param {string|Date} endDate - Range end
 * @returns {boolean}
 */
export const isDateInRange = (date, startDate, endDate) => {
  const d = startOfDay(new Date(date)).getTime()
  const start = startOfDay(new Date(startDate)).getTime()
  const end = endOfDay(new Date(endDate)).getTime()
  return d >= start && d <= end
}

/**
 * Compare two dates (ignoring time)
 * @param {string|Date} date1
 * @param {string|Date} date2
 * @returns {number} - -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDates = (date1, date2) => {
  const d1 = startOfDay(new Date(date1)).getTime()
  const d2 = startOfDay(new Date(date2)).getTime()

  if (d1 < d2) return -1
  if (d1 > d2) return 1
  return 0
}

/**
 * Check if two dates are the same day
 * @param {string|Date} date1
 * @param {string|Date} date2
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date
 * @returns {string}
 */
export const formatDateYMD = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
