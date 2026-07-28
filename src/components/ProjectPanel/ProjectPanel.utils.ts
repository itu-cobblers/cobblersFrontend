import type { SubmitButtonStatus } from '@components/SubmitButton'

/** Derives the shared Submit button's animation status from this panel's submit state. */
export function getProjectSubmitStatus(isSubmitting: boolean, lastSubmitPassed?: boolean | null): SubmitButtonStatus {
  if (isSubmitting) return 'waiting'
  if (lastSubmitPassed === true) return 'success'
  if (lastSubmitPassed === false) return 'error'
  return 'idle'
}
