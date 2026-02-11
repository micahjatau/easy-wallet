import { useCallback, useRef } from 'react'
import { useCategories } from '../hooks/useCategories.js'

const TransactionForm = ({
  variant = 'desktop',
  formState,
  formErrors,
  isEditing,
  accounts,
  settings,
  rateMissingForForm,
  inputClass,
  onSubmit,
  onCancelEdit,
  setFormState,
  className = '',
}) => {
  // Get all categories including custom ones from settings
  const { allCategories } = useCategories(settings?.customCategories)
  const typeRadioRef = useRef([])

  const handleTypeKeyDown = useCallback((event, currentType) => {
    const types = ['expense', 'income']
    const currentIndex = types.indexOf(currentType)
    let newIndex

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        newIndex = currentIndex > 0 ? currentIndex - 1 : types.length - 1
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        newIndex = currentIndex < types.length - 1 ? currentIndex + 1 : 0
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = types.length - 1
        break
      default:
        return
    }

    const newType = types[newIndex]
    setFormState((prev) => ({ ...prev, type: newType }))
    // Focus the new radio button
    const radioButton = typeRadioRef.current[newIndex]
    if (radioButton) {
      radioButton.focus()
    }
  }, [setFormState])

  if (variant === 'mobile') {
    return (
      <div className="rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft dark:shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
              New entry
            </p>
            <h2 className="mt-2 font-display text-xl text-foreground">
              Record transaction
            </h2>
          </div>
          <div 
            className="flex rounded-full bg-background-muted/50 p-1 text-[10px] font-semibold uppercase tracking-wide text-foreground-muted"
            role="radiogroup"
            aria-label="Transaction type"
          >
            {['expense', 'income'].map((type, index) => (
              <button
                key={type}
                ref={(el) => { typeRadioRef.current[index] = el }}
                type="button"
                role="radio"
                aria-checked={formState.type === type}
                tabIndex={formState.type === type ? 0 : -1}
                onClick={() =>
                  setFormState((prev) => ({ ...prev, type }))
                }
                onKeyDown={(event) => handleTypeKeyDown(event, type)}
                className={`rounded-full px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  formState.type === type
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-foreground-muted hover:bg-background-elevated/60'
                }`}
              >
                {type === 'expense' ? 'Expense' : 'Income'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-5">
          <div>
            <label htmlFor="txn-name" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Reference name
            </label>
            <input
              id="txn-name"
              type="text"
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              placeholder="Grocery run, salary"
              className={inputClass}
              aria-describedby={formErrors.name ? 'txn-name-error' : undefined}
            />
            {formErrors.name ? (
              <span id="txn-name-error" className="mt-2 block text-xs text-error">
                {formErrors.name}
              </span>
            ) : null}
          </div>

          <div>
            <label htmlFor="txn-amount" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Value amount
            </label>
            <input
              id="txn-amount"
              type="number"
              min="0"
              step="0.01"
              value={formState.amount}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  amount: event.target.value,
                }))
              }
              placeholder="0.00"
              className={inputClass}
              aria-describedby={formErrors.amount ? 'txn-amount-error' : undefined}
            />
            {formErrors.amount ? (
              <span id="txn-amount-error" className="mt-2 block text-xs text-error">
                {formErrors.amount}
              </span>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="txn-account" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                Account
              </label>
              <select
                id="txn-account"
                value={formState.accountId}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    accountId: event.target.value,
                  }))
                }
                className={inputClass}
                aria-describedby={formErrors.accountId ? 'txn-account-error' : undefined}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              {formErrors.accountId ? (
                <span id="txn-account-error" className="mt-2 block text-xs text-error">
                  {formErrors.accountId}
                </span>
              ) : null}
            </div>

            <div>
              <label htmlFor="txn-category" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                Category
              </label>
              <select
                id="txn-category"
                value={formState.category}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
                className={inputClass}
              >
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="txn-currency" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
                Currency
              </label>
              <select
                id="txn-currency"
                value={formState.currency}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    currency: event.target.value,
                  }))
                }
                className={inputClass}
              >
                {settings.currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              {rateMissingForForm ? (
                <span className="mt-2 block text-xs text-error">
                  Add a rate for {formState.currency}.
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="txn-date" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Date
            </label>
            <input
              id="txn-date"
              type="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  date: event.target.value,
                }))
              }
              className={inputClass}
              aria-describedby={formErrors.date ? 'txn-date-error' : undefined}
            />
            {formErrors.date ? (
              <span id="txn-date-error" className="mt-2 block text-xs text-error">
                {formErrors.date}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {isEditing ? (
              <button
                type="button"
                onClick={onCancelEdit}
                className="w-full rounded-full border border-border bg-background-elevated px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted transition hover:bg-background-muted/40"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-soft transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {isEditing ? 'Save changes' : 'Create transaction'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={`rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft md:p-7 dark:shadow-black/40 ${className}`.trim()}>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
          New entry
        </p>
        <h2 className="mt-2 font-display text-2xl text-foreground">
          Record transaction
        </h2>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-1 flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="txn-name-desktop" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Reference name
            </label>
            <input
              id="txn-name-desktop"
              type="text"
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              placeholder="Grocery run, salary"
              className={inputClass}
              aria-describedby={formErrors.name ? 'txn-name-desktop-error' : undefined}
            />
            {formErrors.name ? (
              <span id="txn-name-desktop-error" className="block text-xs text-error">
                {formErrors.name}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="txn-amount-desktop" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Value amount
            </label>
            <input
              id="txn-amount-desktop"
              type="number"
              min="0"
              step="0.01"
              value={formState.amount}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  amount: event.target.value,
                }))
              }
              placeholder="0.00"
              className={inputClass}
              aria-describedby={formErrors.amount ? 'txn-amount-desktop-error' : undefined}
            />
            {formErrors.amount ? (
              <span id="txn-amount-desktop-error" className="block text-xs text-error">
                {formErrors.amount}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="txn-account-desktop" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Account
            </label>
            <select
              id="txn-account-desktop"
              value={formState.accountId}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  accountId: event.target.value,
                }))
              }
              className={inputClass}
              aria-describedby={formErrors.accountId ? 'txn-account-desktop-error' : undefined}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {formErrors.accountId ? (
              <span id="txn-account-desktop-error" className="block text-xs text-error">
                {formErrors.accountId}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="txn-category-desktop" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Classification
            </label>
            <select
              id="txn-category-desktop"
              value={formState.category}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
              className={inputClass}
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="txn-currency-desktop" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Currency
            </label>
            <select
              id="txn-currency-desktop"
              value={formState.currency}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  currency: event.target.value,
                }))
              }
              className={inputClass}
            >
              {settings.currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {rateMissingForForm ? (
              <span className="block text-xs text-error">
                Add a rate for {formState.currency}.
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="txn-date-desktop" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
              Date
            </label>
            <input
              id="txn-date-desktop"
              type="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  date: event.target.value,
                }))
              }
              className={inputClass}
              aria-describedby={formErrors.date ? 'txn-date-desktop-error' : undefined}
            />
            {formErrors.date ? (
              <span id="txn-date-desktop-error" className="block text-xs text-error">
                {formErrors.date}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-center py-2">
          <div 
            className="flex rounded-full bg-background-muted/50 p-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-muted"
            role="radiogroup"
            aria-label="Transaction type"
          >
            {['expense', 'income'].map((type, index) => (
              <button
                key={type}
                ref={(el) => { typeRadioRef.current[index] = el }}
                type="button"
                role="radio"
                aria-checked={formState.type === type}
                tabIndex={formState.type === type ? 0 : -1}
                onClick={() =>
                  setFormState((prev) => ({ ...prev, type }))
                }
                onKeyDown={(event) => handleTypeKeyDown(event, type)}
                className={`rounded-full px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  formState.type === type
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-foreground-muted hover:bg-background-elevated/60'
                }`}
              >
                {type === 'expense' ? 'Expense' : 'Income'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {formErrors.currency ? (
            <span className="text-xs text-error">{formErrors.currency}</span>
          ) : (
            <span />
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {isEditing ? (
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-full border border-border bg-background-elevated px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted transition hover:bg-background-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-soft transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {isEditing ? 'Save changes' : 'Create transaction'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
