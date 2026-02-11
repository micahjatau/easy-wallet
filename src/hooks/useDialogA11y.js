import { useEffect, useRef } from 'react'

export const useDialogA11y = ({
  isOpen,
  onEscape,
  initialFocusRef,
  lockBodyScroll = false,
}) => {
  const previousActiveRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    previousActiveRef.current = document.activeElement

    const timer = setTimeout(() => {
      initialFocusRef?.current?.focus?.()
    }, 0)

    const previousOverflow = document.body.style.overflow
    if (lockBodyScroll) {
      document.body.style.overflow = 'hidden'
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)

      if (lockBodyScroll) {
        document.body.style.overflow = previousOverflow
      }

      if (
        previousActiveRef.current &&
        typeof previousActiveRef.current.focus === 'function'
      ) {
        previousActiveRef.current.focus()
      }
    }
  }, [isOpen, onEscape, initialFocusRef, lockBodyScroll])
}

export default useDialogA11y
