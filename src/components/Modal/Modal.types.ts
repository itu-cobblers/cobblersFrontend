import type { ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  /** Close when the backdrop (or Escape) is used. Disable while a flow is in flight. */
  closeOnOverlay?: boolean
  children: ReactNode
}
