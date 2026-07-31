import type { SubmitButtonStatus } from '@components/SubmitButton'

/**
 * Shared footer for code / predict / project panels:
 *   [Show/Hide reference answer?] [Submit]
 *
 * Reveal unlocks after the first submit and disappears once the assignment
 * is completed (passed on submit, or Marked as done). Mark as done is only
 * offered for graded kinds (`code` / `predict`) while the reference answer
 * is visible, reusing the Submit button and its status animation.
 */
export interface AssignmentFooterProps {
  submitStatus: SubmitButtonStatus
  onSubmit: () => void
  isSubmitDisabled?: boolean

  /** True once the student has submitted at least once and has not yet completed. */
  canRevealAnswer?: boolean
  isSolutionVisible?: boolean
  isLoadingSolution?: boolean
  onToggleSolution?: () => void

  /** `code` / `predict` only — replaces Submit's action while the reference answer is open. */
  canMarkAsDone?: boolean
  isMarkingDone?: boolean
  onMarkAsDone?: () => void
}
