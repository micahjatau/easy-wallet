import { memo } from 'react'

const SidebarItem = memo(function SidebarItem({
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
  badge,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-primary/10 text-primary border-l-4 border-primary'
          : 'text-foreground-muted hover:bg-background-muted hover:text-foreground border-l-4 border-transparent'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : undefined}
    >
      <span className="material-symbols-outlined text-xl flex-shrink-0">
        {icon}
      </span>
      {!isCollapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  )
})

export default SidebarItem
