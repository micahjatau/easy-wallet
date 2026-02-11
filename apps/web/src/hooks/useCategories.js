import { useMemo } from 'react'
import { DEFAULT_CATEGORIES } from '../lib/ledgerConfig.js'

export const useCategories = (customCategories = []) => {
  const allCategories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...customCategories.filter(cat => !DEFAULT_CATEGORIES.includes(cat))]
  }, [customCategories])

  const isDefaultCategory = (category) => DEFAULT_CATEGORIES.includes(category)
  
  const getCategoryColorIndex = (category) => {
    return DEFAULT_CATEGORIES.indexOf(category)
  }

  return {
    allCategories,
    defaultCategories: DEFAULT_CATEGORIES,
    isDefaultCategory,
    getCategoryColorIndex,
  }
}

export default useCategories
