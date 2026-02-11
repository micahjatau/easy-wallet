import { useCallback } from 'react'

export const useCategoryActions = ({
  setTransactions,
  setSettings,
  success,
  queueChange,
}) => {
  const handleAddCategory = useCallback(
    (newCategory) => {
      setSettings((prev) => {
        const customCategories = [...(prev.customCategories || [])]
        if (!customCategories.includes(newCategory.name)) {
          customCategories.push(newCategory.name)
        }
        return {
          ...prev,
          customCategories,
        }
      })
      queueChange?.()
      success(`Category "${newCategory.name}" added`)
    },
    [setSettings, success, queueChange],
  )

  const handleEditCategory = useCallback(
    (oldName, updatedCategory) => {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.category === oldName
            ? { ...transaction, category: updatedCategory.name }
            : transaction,
        ),
      )

      setSettings((prev) => {
        const customCategories = (prev.customCategories || []).map((cat) =>
          cat === oldName ? updatedCategory.name : cat,
        )
        return {
          ...prev,
          customCategories,
        }
      })

      queueChange?.()
      success(`Category renamed from "${oldName}" to "${updatedCategory.name}"`)
    },
    [setTransactions, setSettings, success, queueChange],
  )

  const handleDeleteCategory = useCallback(
    (categoryName) => {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.category === categoryName
            ? { ...transaction, category: 'Other' }
            : transaction,
        ),
      )

      setSettings((prev) => {
        const customCategories = (prev.customCategories || []).filter(
          (cat) => cat !== categoryName,
        )
        return {
          ...prev,
          customCategories,
        }
      })

      queueChange?.()
      success(`Category "${categoryName}" deleted`)
    },
    [setTransactions, setSettings, success, queueChange],
  )

  return {
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  }
}

export default useCategoryActions
