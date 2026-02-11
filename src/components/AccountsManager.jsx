const AccountsManager = ({
  variant = 'desktop',
  accounts,
  accountDrafts,
  setAccountDrafts,
  accountUsage,
  accountError,
  setAccountError,
  accountInput,
  setAccountInput,
  onRenameAccount,
  onRemoveAccount,
  onAddAccount,
  className = '',
}) => {
  const isMobile = variant === 'mobile'

  const baseClassName = `rounded-3xl border border-border bg-background-elevated p-6 shadow-soft dark:shadow-black/40 ${
    isMobile ? '' : 'md:p-7'
  }`
  const mergedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName

  return (
    <div className={mergedClassName}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
            Accounts
          </p>
          <h3 className="mt-2 font-display text-xl text-foreground">Wallets</h3>
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
          {accounts.length} total
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {accounts.map((account) => {
          const draftValue = accountDrafts[account.id] ?? account.name
          const usage = accountUsage[account.id] || 0
          const isOnlyAccount = accounts.length <= 1
          const isUsed = usage > 0
          const isDirty = draftValue.trim() !== account.name
          return (
            <div
              key={account.id}
              className="rounded-2xl border border-border bg-background-muted px-4 py-3 text-xs"
            >
              <div className={isMobile ? 'grid gap-3' : 'flex flex-wrap items-center justify-between gap-3'}>
                <div className={isMobile ? '' : 'min-w-[160px] flex-1'}>
                  <input
                    type="text"
                    value={draftValue}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      setAccountDrafts((prev) => ({
                        ...prev,
                        [account.id]: nextValue,
                      }))
                      setAccountError('')
                    }}
                    className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-subtle">
                    {usage} transactions{isUsed ? ' • in use' : ' • unused'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRenameAccount(account.id)}
                    disabled={!isDirty}
                    className="rounded-full border border-border bg-background px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveAccount(account.id)}
                    disabled={isOnlyAccount || isUsed}
                    className="rounded-full border border-transparent bg-background-muted px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted transition hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4">
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
          Add account
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              type="text"
              value={accountInput}
              onChange={(event) => {
                setAccountInput(event.target.value)
                setAccountError('')
              }}
              placeholder="Cash, Bank"
              className="w-full flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={onAddAccount}
              className="rounded-2xl bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
            >
              Add
            </button>
          </div>
        </label>
        {accountError ? (
          <p className="mt-2 text-xs text-error">{accountError}</p>
        ) : null}
      </div>
    </div>
  )
}

export default AccountsManager
