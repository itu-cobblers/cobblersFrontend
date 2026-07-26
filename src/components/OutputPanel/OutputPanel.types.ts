import type { ExecuteStatus } from '@types'

export interface OutputPanelSubmit {
  isSubmitting: boolean
  isDisabled?: boolean
  onSubmit: () => void
  /**
   * The last submission's verdict, once known — drives the shared Submit
   * button's "well done" / "not quite" hold. `null`/omitted while no verdict
   * is available yet (idle, or mid-submission — `isSubmitting` covers that).
   */
  lastResultPassed?: boolean | null
}

export interface OutputPanelShowAnswer {
  onClick: () => void
  isDisabled?: boolean
}

export interface OutputPanelProps {
  output: string
  status: ExecuteStatus | null
  /** Renders the shared Submit button in the terminal footer when given; omit to hide it. */
  submit?: OutputPanelSubmit
  /**
   * Renders the shared "Show answer" button when given. For code assignments
   * this should only be passed once the teacher's reveal-answer signal comes
   * over SignalR (not wired yet — see `sessionHub.ts`), unlike Predict, which
   * can show it right after a single submit.
   */
  showAnswer?: OutputPanelShowAnswer
}
