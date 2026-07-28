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
  /** True while the solution is being fetched — shows "Loading answer…" in place of the default label. */
  isLoading?: boolean
}

export interface OutputPanelProps {
  output: string
  status: ExecuteStatus | null
  /** Renders the shared Submit button in the terminal footer when given; omit to hide it. */
  submit?: OutputPanelSubmit
  /**
   * Renders the shared "Show answer" button in the footer, to the left of
   * Submit, when given — mirrors PredictPanel's layout. The caller decides
   * eligibility/visibility (see StudentView.hooks.ts's `buildShowAnswer`);
   * omit once the answer is already revealed.
   */
  showAnswer?: OutputPanelShowAnswer
}
