import { memo } from 'react'

const QuickAddButton = memo(function QuickAddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group"
      aria-label="Add transaction"
      title="Add transaction"
    >
      <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-200">
        add
      </span>
    </button>
  )
})

export default QuickAddButton
