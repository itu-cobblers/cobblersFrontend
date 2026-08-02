import { useEffect, useRef, useState } from 'react'

/**
 * Open state for the action list, plus the two ways out a menu is expected to
 * have: clicking elsewhere, and Escape. Without those the list survives a click
 * on the editor and hangs over the code.
 */
export function useRunMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current?.contains(event.target as Node)) return
      setIsOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return { isOpen, setIsOpen, wrapperRef }
}
