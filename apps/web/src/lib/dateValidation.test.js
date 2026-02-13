import { describe, expect, it } from 'vitest'
import {
  validateDate,
  sanitizeDate,
  parseDateLocal,
  startOfDay,
  endOfDay,
  isDateInRange,
  compareDates,
  isSameDay,
  formatDateYMD,
} from './dateValidation.js'

describe('dateValidation', () => {
  describe('validateDate', () => {
    it('accepts valid dates', () => {
      expect(validateDate('2024-03-15').valid).toBe(true)
      expect(validateDate('2024-12-31').valid).toBe(true)
      expect(validateDate('1900-01-01').valid).toBe(true)
    })

    it('rejects invalid format', () => {
      expect(validateDate('2024/03/15').valid).toBe(false)
      expect(validateDate('15-03-2024').valid).toBe(false)
      expect(validateDate('2024-3-15').valid).toBe(false)
      expect(validateDate('not-a-date').valid).toBe(false)
    })

    it('rejects invalid calendar dates', () => {
      // Feb 31 doesn't exist
      expect(validateDate('2024-02-31').valid).toBe(false)
      // Apr 31 doesn't exist
      expect(validateDate('2024-04-31').valid).toBe(false)
      // Nov 31 doesn't exist
      expect(validateDate('2024-11-31').valid).toBe(false)
    })

    it('handles leap years correctly', () => {
      // 2024 is a leap year - Feb 29 is valid
      expect(validateDate('2024-02-29').valid).toBe(true)
      // 2023 is not a leap year - Feb 29 is invalid
      expect(validateDate('2023-02-29').valid).toBe(false)
      // 1900 is not a leap year (divisible by 100 but not 400)
      expect(validateDate('1900-02-29').valid).toBe(false)
      // 2000 is a leap year (divisible by 400)
      expect(validateDate('2000-02-29').valid).toBe(true)
    })

    it('rejects out of range years', () => {
      expect(validateDate('1899-12-31').valid).toBe(false)
      expect(validateDate('2101-01-01').valid).toBe(false)
    })

    it('rejects invalid months', () => {
      expect(validateDate('2024-00-15').valid).toBe(false)
      expect(validateDate('2024-13-15').valid).toBe(false)
    })

    it('rejects invalid days', () => {
      expect(validateDate('2024-03-00').valid).toBe(false)
      expect(validateDate('2024-03-32').valid).toBe(false)
    })

    it('returns Date object in local timezone', () => {
      const result = validateDate('2024-03-15')
      expect(result.valid).toBe(true)
      expect(result.date instanceof Date).toBe(true)
      expect(result.date.getFullYear()).toBe(2024)
      expect(result.date.getMonth()).toBe(2) // March is 2 (0-indexed)
      expect(result.date.getDate()).toBe(15)
      expect(result.date.getHours()).toBe(0) // Midnight local
    })
  })

  describe('sanitizeDate', () => {
    it('returns normalized string for valid dates', () => {
      expect(sanitizeDate('2024-03-15')).toBe('2024-03-15')
      expect(sanitizeDate('2024-02-29')).toBe('2024-02-29')
    })

    it('returns null for invalid dates', () => {
      expect(sanitizeDate('2024-02-31')).toBe(null)
      expect(sanitizeDate('not-a-date')).toBe(null)
      expect(sanitizeDate('')).toBe(null)
    })

    it('handles non-string inputs', () => {
      expect(sanitizeDate(null)).toBe(null)
      expect(sanitizeDate(undefined)).toBe(null)
      expect(sanitizeDate(12345)).toBe(null)
      expect(sanitizeDate({})).toBe(null)
    })
  })

  describe('parseDateLocal', () => {
    it('returns Date for valid dates', () => {
      const date = parseDateLocal('2024-03-15')
      expect(date instanceof Date).toBe(true)
      expect(date.getFullYear()).toBe(2024)
    })

    it('returns null for invalid dates', () => {
      expect(parseDateLocal('2024-02-31')).toBe(null)
    })
  })

  describe('startOfDay', () => {
    it('returns start of day', () => {
      const date = new Date('2024-03-15T14:30:00')
      const start = startOfDay(date)
      expect(start.getHours()).toBe(0)
      expect(start.getMinutes()).toBe(0)
      expect(start.getSeconds()).toBe(0)
      expect(start.getMilliseconds()).toBe(0)
      expect(start.getDate()).toBe(15)
    })
  })

  describe('endOfDay', () => {
    it('returns end of day', () => {
      const date = new Date('2024-03-15T14:30:00')
      const end = endOfDay(date)
      expect(end.getHours()).toBe(23)
      expect(end.getMinutes()).toBe(59)
      expect(end.getSeconds()).toBe(59)
      expect(end.getMilliseconds()).toBe(999)
      expect(end.getDate()).toBe(15)
    })
  })

  describe('isDateInRange', () => {
    it('returns true for date within range', () => {
      expect(isDateInRange('2024-03-15', '2024-03-01', '2024-03-31')).toBe(true)
    })

    it('returns true for date on range boundaries', () => {
      expect(isDateInRange('2024-03-01', '2024-03-01', '2024-03-31')).toBe(true)
      expect(isDateInRange('2024-03-31', '2024-03-01', '2024-03-31')).toBe(true)
    })

    it('returns false for date outside range', () => {
      expect(isDateInRange('2024-02-29', '2024-03-01', '2024-03-31')).toBe(false)
      expect(isDateInRange('2024-04-01', '2024-03-01', '2024-03-31')).toBe(false)
    })

    it('ignores time component', () => {
      expect(
        isDateInRange(
          new Date('2024-03-15T23:59:59'),
          new Date('2024-03-15T00:00:00'),
          new Date('2024-03-15T23:59:59'),
        ),
      ).toBe(true)
    })
  })

  describe('compareDates', () => {
    it('returns -1 when date1 < date2', () => {
      expect(compareDates('2024-03-14', '2024-03-15')).toBe(-1)
    })

    it('returns 1 when date1 > date2', () => {
      expect(compareDates('2024-03-16', '2024-03-15')).toBe(1)
    })

    it('returns 0 when dates are equal', () => {
      expect(compareDates('2024-03-15', '2024-03-15')).toBe(0)
    })

    it('ignores time component', () => {
      expect(
        compareDates(
          new Date('2024-03-15T10:00:00'),
          new Date('2024-03-15T20:00:00'),
        ),
      ).toBe(0)
    })
  })

  describe('isSameDay', () => {
    it('returns true for same day', () => {
      expect(isSameDay('2024-03-15', '2024-03-15')).toBe(true)
    })

    it('returns false for different days', () => {
      expect(isSameDay('2024-03-15', '2024-03-16')).toBe(false)
    })

    it('ignores time component', () => {
      expect(isSameDay(new Date('2024-03-15T10:00'), new Date('2024-03-15T20:00'))).toBe(true)
    })
  })

  describe('formatDateYMD', () => {
    it('formats date to YYYY-MM-DD', () => {
      expect(formatDateYMD(new Date('2024-03-15'))).toBe('2024-03-15')
      expect(formatDateYMD(new Date('2024-12-01'))).toBe('2024-12-01')
    })

    it('pads single-digit months and days', () => {
      expect(formatDateYMD(new Date('2024-01-05'))).toBe('2024-01-05')
    })
  })
})
