import type { SubmissionResult } from '@types'

/** Display-ready verdict derived from a submission result (keeps JSX free of data logic). */
export interface SubmitResultView {
  badge: string
  title: string
  isAccepted: boolean
  message: string
  /** Non-empty only when there's stderr worth showing. */
  stderr: string
}

function feedbackMessage(result: SubmissionResult): string {
  if (result.passed === true) {
    return 'Well done! Move on to the next one.'
  }
  if (result.passed === null) {
    return 'Submitted.'
  }
  // Client-built failure (empty subId) — transport/API error, not a grading verdict.
  if (!result.subId) {
    return 'Something went wrong submitting. Please try again.'
  }
  const status = result.result?.status
  if (status === 'compile_error') {
    return 'Your code did not compile. Check the errors below and try again.'
  }
  if (status === 'runtime_error') {
    return 'Your code did not run. Check the errors below and try again.'
  }
  return 'Not quite… Check the description and make sure you follow the requirements exactly. A single missing character or a misspelling can be enough to fail.'
}

export function getSubmitResultView(result: SubmissionResult): SubmitResultView {
  const isAccepted = result.passed !== false
  const stderr = result.result?.stderr?.trim() ? result.result.stderr : ''
  return {
    badge: isAccepted ? '✓' : '!',
    title: result.passed === false ? 'Not quite yet' : 'Submitted',
    isAccepted,
    message: feedbackMessage(result),
    stderr,
  }
}
