import { useMemo, useState } from 'react'
import { CATEGORY_COLORS } from '../lib/ledgerConfig.js'

const EMOJI_OPTIONS = ['📁', '🏠', '🚗', '🍽️', '🛒', '💊', '🎬', '✈️', '👕', '💡', '📱', '🎁', '💼', '🏋️', '📚', '🐾', '🌱', '🔧', '💄', '☕']

export default function CategoryManager({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  transactions,
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '📁', type: 'expense' })
  const [error, setError] = useState('')

  const usageByCategory = useMemo(() => {
    return transactions.reduce((accumulator, transaction) => {
      const categoryName = transaction.category
      accumulator[categoryName] = (accumulator[categoryName] || 0) + 1
      return accumulator
    }, {})
  }, [transactions])

  const validateCategory = (name, isEdit = false) => {
    if (!name.trim()) {
      return 'Category name is required'
    }
    if (name.length > 20) {
      return 'Category name must be 20 characters or less'
    }
    if (!isEdit && categories.some(c => c.toLowerCase() === name.toLowerCase())) {
      return 'Category already exists'
    }
    return ''
  }

  const handleAdd = () => {
    const validationError = validateCategory(newCategory.name)
    if (validationError) {
      setError(validationError)
      return
    }
    
    onAddCategory({
      ...newCategory,
      name: newCategory.name.trim(),
    })
    
    setNewCategory({ name: '', emoji: '📁', type: 'expense' })
    setShowAdd(false)
    setError('')
  }

  const handleEdit = () => {
    if (!editingCategory) return
    
    const validationError = validateCategory(editingCategory.name, true)
    if (validationError) {
      setError(validationError)
      return
    }
    
    onEditCategory(editingCategory.originalName, {
      ...editingCategory,
      name: editingCategory.name.trim(),
    })
    
    setEditingCategory(null)
    setError('')
  }

  const handleDelete = (categoryName) => {
    const usage = usageByCategory[categoryName] || 0
    if (usage > 0) {
      const confirmed = window.confirm(
        `"${categoryName}" is used in ${usage} transaction${usage !== 1 ? 's' : ''}. ` +
        'Deleting will set these transactions to "Other". Continue?'
      )
      if (!confirmed) return
    }
    onDeleteCategory(categoryName)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}
        </p>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors"
        >
          Add Category
        </button>
      </div>

      {showAdd && (
        <div className="rounded-lg border border-border p-4 bg-background-elevated space-y-3">
          <h4 className="font-medium text-foreground">New Category</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-foreground-muted mb-1">Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Subscription"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground-muted mb-1">Emoji</label>
              <select
                value={newCategory.emoji}
                onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {EMOJI_OPTIONS.map(emoji => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-foreground-muted mb-1">Type</label>
            <div className="flex gap-2">
              {['expense', 'income', 'both'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, type })}
                  className={`px-3 py-1.5 rounded-full text-xs capitalize transition ${
                    newCategory.type === type
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-foreground-muted hover:bg-background-muted/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newCategory.name.trim()}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAdd(false)
                setNewCategory({ name: '', emoji: '📁', type: 'expense' })
                setError('')
              }}
              className="flex-1 px-3 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-background-muted/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="rounded-lg border border-border p-4 bg-background-elevated space-y-3">
          <h4 className="font-medium text-foreground">Edit Category</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-foreground-muted mb-1">Name</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground-muted mb-1">Emoji</label>
              <select
                value={editingCategory.emoji}
                onChange={(e) => setEditingCategory({ ...editingCategory, emoji: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {EMOJI_OPTIONS.map(emoji => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEdit}
              disabled={!editingCategory.name.trim()}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null)
                setError('')
              }}
              className="flex-1 px-3 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-background-muted/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {categories.map((category, index) => {
          const usage = usageByCategory[category] || 0
          return (
            <div
              key={category}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-background-elevated hover:bg-background-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                >
                  📁
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{category}</p>
                  <p className="text-xs text-foreground-subtle">{usage} transaction{usage !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingCategory({ originalName: category, name: category, emoji: '📁', type: 'expense' })}
                  className="p-2.5 text-foreground-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Edit"
                  aria-label={`Edit ${category} category`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="p-2.5 text-foreground-muted hover:text-error transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Delete"
                  aria-label={`Delete ${category} category`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
