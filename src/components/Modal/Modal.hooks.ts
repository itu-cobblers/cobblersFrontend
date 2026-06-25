import { useEffect } from 'react'

/** Calls `onClose` on Escape while `isEnabled`. State/effects live here, not in the component body. */
export function useEscapeToClose(isEnabled: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isEnabled) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEnabled, onClose])
}
