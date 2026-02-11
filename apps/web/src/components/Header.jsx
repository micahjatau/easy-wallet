const LogoIcon = () => (
  <span className="material-symbols-outlined text-[32px] text-foreground">
    account_balance_wallet
  </span>
)

const Header = ({
  variant = 'desktop',
  appName,
  tagline,
}) => {
  if (variant === 'mobile') {
    return (
      <header className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
          Personal wealth
        </p>
        <div className="flex items-center gap-3">
          <LogoIcon />
          <h1 className="font-display text-3xl text-foreground">{appName}</h1>
        </div>
        {tagline ? (
          <p className="text-xs text-foreground-muted">{tagline}</p>
        ) : null}
      </header>
    )
  }

  return (
    <header className="hidden items-end justify-between gap-6 lg:flex">
      <div className="max-w-xl">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
              Personal wealth
            </p>
            <h1 className="mt-1 font-display text-4xl text-foreground md:text-5xl">
              {appName}
            </h1>
          </div>
        </div>
        {tagline ? <p className="mt-2 text-sm text-foreground-muted">{tagline}</p> : null}
      </div>
      <div />
    </header>
  )
}

export default Header
