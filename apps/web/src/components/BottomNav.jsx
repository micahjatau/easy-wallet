import IconPlus from './icons/IconPlus.jsx'
import IconSnapshot from './icons/IconSnapshot.jsx'
import IconTools from './icons/IconTools.jsx'

const BottomNav = ({ activeView, onSetView }) => {
  const navItemClass = (view) =>
    `flex flex-col items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.3em] transition ${
activeView === view ? 'text-foreground' : 'text-foreground-muted'
    }`
  const navIconClass = (view) =>
    `h-5 w-5 ${activeView === view ? 'text-foreground' : 'text-foreground-muted'}`

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 rounded-[28px] border border-border/70 bg-background-elevated/90 px-5 py-4 shadow-2xl backdrop-blur lg:hidden dark:shadow-black/40">
      <div className="grid grid-cols-4 items-center text-center">
        <button
          type="button"
          onClick={() => onSetView('activity')}
          className={navItemClass('activity')}
        >
          <span className={`material-symbols-outlined text-[20px] ${activeView === 'activity' ? 'text-foreground' : 'text-foreground-muted'}`}>
            account_balance_wallet
          </span>
          <span>Activity</span>
        </button>
        <button
          type="button"
          onClick={() => onSetView('new')}
          className={navItemClass('new')}
        >
          <IconPlus className={navIconClass('new')} />
          <span>New</span>
        </button>
        <button
          type="button"
          onClick={() => onSetView('snapshot')}
          className={navItemClass('snapshot')}
        >
          <IconSnapshot className={navIconClass('snapshot')} />
          <span>Snapshot</span>
        </button>
        <button
          type="button"
          onClick={() => onSetView('tools')}
          className={navItemClass('tools')}
        >
          <IconTools className={navIconClass('tools')} />
          <span>Tools</span>
        </button>
      </div>
    </nav>
  )
}

export default BottomNav
