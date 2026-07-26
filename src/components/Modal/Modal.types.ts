import type { ReactNode } from 'react'

/** `sm` (default) fits a confirm dialog; `lg` fits a scrollable content panel (e.g. My Progress). */
export type ModalSize = 'sm' | 'lg'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  /** Close when the backdrop (or Escape) is used. Disable while a flow is in flight. */
  closeOnOverlay?: boolean
  size?: ModalSize
  children: ReactNode
}
