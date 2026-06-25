import type { SubmissionResult } from '@types'

export interface SubmitModalProps {
  isOpen: boolean
  isSubmitting: boolean
  /** null ⇒ confirmation step; present ⇒ verdict step. */
  result: SubmissionResult | null
  onConfirm: () => void
  onCancel: () => void
  onClose: () => void
}
