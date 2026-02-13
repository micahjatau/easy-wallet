import { memo } from 'react'

const NavHeader = memo(function NavHeader({ isCollapsed, onToggle }) {
  return (
    <div className={`p-4 border-b border-border ${isCollapsed ? 'flex flex-col items-center gap-4' : ''}`}>
      {/* Logo and Toggle */}
      <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between gap-3'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'gap-3'}`}>
          {/* App Icon */}
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-xl text-primary-foreground">
              account_balance_wallet
            </span>
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg text-foreground leading-tight">Easy</span>
              <span className="font-display text-lg text-foreground leading-tight">Wallet</span>
            </div>
          )}
        </div>
        
        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="p-2 rounded-lg text-foreground-muted hover:bg-background-muted hover:text-foreground transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined text-lg">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>
      
    </div>
  )
})

export default NavHeader
