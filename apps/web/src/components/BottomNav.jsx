import { NavLink, useLocation } from 'react-router-dom'

const BottomNav = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/' || currentPath === '/dashboard'
    }
    return currentPath.startsWith(path)
  }

  const navItemClass = (path) =>
    `flex flex-col items-center gap-1 transition ${
      isActive(path) ? 'text-foreground' : 'text-foreground-muted'
    }`

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-border/70 bg-background-elevated/95 px-4 py-3 shadow-2xl backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 items-center text-center">
        {/* Home */}
        <NavLink
          to="/"
          className={navItemClass('/')}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/') ? 'fill' : ''}`}>
            house
          </span>
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>

        {/* Transactions */}
        <NavLink
          to="/transactions"
          className={navItemClass('/transactions')}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/transactions') ? 'fill' : ''}`}>
            receipt_long
          </span>
          <span className="text-[10px] font-medium">Txn</span>
        </NavLink>

        {/* Add (Center, Elevated) */}
        <NavLink
          to="/new"
          className="relative -mt-6 flex flex-col items-center"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 ${
            isActive('/new') 
              ? 'bg-primary text-primary-foreground shadow-primary/30' 
              : 'bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary-hover'
          }`}>
            <span className="material-symbols-outlined text-[28px]">
              add_circle
            </span>
          </div>
          <span className="mt-1 text-[10px] font-medium text-foreground">Add</span>
        </NavLink>

        {/* Tools */}
        <NavLink
          to="/tools"
          className={navItemClass('/tools')}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/tools') ? 'fill' : ''}`}>
            construction
          </span>
          <span className="text-[10px] font-medium">Tools</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={navItemClass('/settings')}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/settings') ? 'fill' : ''}`}>
            settings
          </span>
          <span className="text-[10px] font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default BottomNav
