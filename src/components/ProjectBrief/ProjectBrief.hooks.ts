import { useState } from 'react'

/** Owns the setup-guide popup's open/closed state. */
export function useSetupGuideModal(): [boolean, () => void, () => void] {
  const [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return [isOpen, open, close]
}
