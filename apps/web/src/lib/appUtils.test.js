import { describe, expect, it } from 'vitest'
import { formatLocalYmd, getToday } from './appUtils.js'

describe('appUtils date helpers', () => {
  it('formats a date using local YYYY-MM-DD parts', () => {
    const date = new Date(2026, 1, 7, 23, 30, 0)
    expect(formatLocalYmd(date)).toBe('2026-02-07')
  })

  it('returns today in YYYY-MM-DD format', () => {
    expect(getToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
