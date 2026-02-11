import { useCallback } from 'react'
import { formatLocalYmd } from '../lib/appUtils.js'

export const useFormActions = ({
  setEditingId,
  setFormErrors,
  setFormState,
  setFilters,
  setActiveView,
  setIsDarkMode,
}) => {
  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setFormErrors({})
    setFormState((prev) => ({
      ...prev,
      name: '',
      amount: '',
      date: formatLocalYmd(new Date()),
    }))
  }, [setEditingId, setFormErrors, setFormState])

  const handleClearFilters = useCallback(() => {
    const today = new Date()
    const defaultDates = {
      customStart: formatLocalYmd(
        new Date(today.getFullYear(), today.getMonth(), 1),
      ),
      customEnd: formatLocalYmd(
        new Date(today.getFullYear(), today.getMonth() + 1, 0),
      ),
    }
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      accountId: 'all',
      showDeleted: false,
      dateRangeMode: 'this_month',
      customStart: defaultDates.customStart,
      customEnd: defaultDates.customEnd,
    })
  }, [setFilters])

  const handleSetView = useCallback((nextView) => {
    setActiveView(nextView)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [setActiveView])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev)
  }, [setIsDarkMode])

  return {
    handleCancelEdit,
    handleClearFilters,
    handleSetView,
    toggleDarkMode,
  }
}

export default useFormActions
