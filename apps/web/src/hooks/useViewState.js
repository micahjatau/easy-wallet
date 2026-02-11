import { useMemo } from 'react'

export const useViewState = (activeView) => {
  const showActivity = useMemo(() => activeView === 'activity', [activeView])
  const showNew = useMemo(() => activeView === 'new', [activeView])
  const showSnapshot = useMemo(() => activeView === 'snapshot', [activeView])
  const showTools = useMemo(() => activeView === 'tools', [activeView])

  return {
    showActivity,
    showNew,
    showSnapshot,
    showTools,
  }
}

export default useViewState
