import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import ProfileSwitcher from '../auth/ProfileSwitcher.jsx'
import NavHeader from './NavHeader.jsx'

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'transactions', icon: 'receipt_long', label: 'Transactions', path: '/transactions' },
  { id: 'tools', icon: 'construction', label: 'Tools', path: '/tools' },
  { id: 'settings', icon: 'settings', label: 'Settings', path: '/settings' },
  { id: 'support', icon: 'help', label: 'Support', path: '/support' },
]

const SidebarItem = memo(function SidebarItem({
  to,
  icon,
  label,
  isCollapsed,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm shadow-primary/10'
            : 'text-foreground-muted hover:bg-background-muted hover:text-foreground hover:scale-[1.02] border-l-4 border-transparent'
        } ${isCollapsed ? 'justify-center' : ''}`
      }
      title={isCollapsed ? label : undefined}
    >
      <span className="material-symbols-outlined text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      {!isCollapsed && (
        <span className="text-sm font-medium flex-1 text-left">{label}</span>
      )}
    </NavLink>
  )
})

const Sidebar = memo(function Sidebar({
  isCollapsed,
  onToggle,
  isDarkMode,
  onToggleDarkMode,
  className = '',
}) {
  return (
    <aside
      data-sidebar="app"
      className={`fixed left-0 top-0 h-screen flex flex-col bg-background-elevated border-r border-border shadow-lg transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <NavHeader
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            to={item.path}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="border-t border-border p-3 space-y-3">
        <div className={`flex ${isCollapsed ? 'justify-center' : ''}`}>
          <ProfileSwitcher compact={isCollapsed} fullWidth={!isCollapsed} />
        </div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className={`p-2 rounded-lg border border-border bg-background-elevated text-foreground-muted hover:text-foreground transition-colors ${
            isCollapsed ? 'w-10 h-10 mx-auto flex items-center justify-center' : 'w-full flex items-center justify-center gap-2'
          }`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="material-symbols-outlined text-lg">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-border ${isCollapsed ? 'text-center' : ''}`}>
        {!isCollapsed && (
          <p className="text-xs text-foreground-subtle">
            Easy Wallet v2.1.0
          </p>
        )}
      </div>
    </aside>
  )
})

export default Sidebar
