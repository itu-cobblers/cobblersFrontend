import type { SubmitButtonStatus } from '@components/SubmitButton'

/**
 * Derives the shared Submit button's animation status. Projects have no
 * grader (`passed` is always `null`), so any landed submit flashes success
 * ("Well Done") — never "Not Quite".
 */
export function getProjectSubmitStatus(isSubmitting: boolean, lastSubmitPassed?: boolean | null): SubmitButtonStatus {
  if (isSubmitting) return 'waiting'
  if (lastSubmitPassed != null) return 'success'
  return 'idle'
}
