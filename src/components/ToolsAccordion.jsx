import { useState } from 'react'

const ToolsAccordion = ({ sections, className = '' }) => {
  const [openSection, setOpenSection] = useState(null)

  const handleToggle = (sectionId) => {
    setOpenSection((current) => (current === sectionId ? null : sectionId))
  }

  return (
    <div
      className={`rounded-3xl border border-border bg-background-muted p-4 shadow-soft dark:shadow-black/40 ${className}`.trim()}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground-muted">
        Tools
      </p>
      <div className="mt-3 space-y-3">
        {sections.map((section) => {
          const isOpen = openSection === section.id

          return (
              <div
              key={section.id}
              className="rounded-2xl border border-border bg-background-elevated px-4 py-3"
            >
              <button
                type="button"
                onClick={() => handleToggle(section.id)}
                className="flex w-full cursor-pointer items-center justify-between text-xs font-semibold text-foreground"
              >
                <span>{section.title}</span>
                <span
                  className={`inline-block text-[10px] text-foreground-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                >
                  &gt;
                </span>
              </button>
              {isOpen && (
                <div className="mt-3 space-y-4">{section.content}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ToolsAccordion
