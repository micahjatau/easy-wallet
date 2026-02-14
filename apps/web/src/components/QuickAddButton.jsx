import { memo } from 'react'

const QuickAddButton = memo(function QuickAddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 group hover:scale-105 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/40 active:scale-95 lg:flex"
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
