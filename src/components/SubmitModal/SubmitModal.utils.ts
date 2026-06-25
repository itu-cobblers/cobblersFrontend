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

export function getSubmitResultView(result: SubmissionResult): SubmitResultView {
  return {
    badge: result.accepted ? '✓' : '!',
    title: result.accepted ? 'Submitted' : 'Not submitted',
    isAccepted: result.accepted,
    message: result.message,
    stderr: result.stderr.trim() ? result.stderr : '',
  }
}
