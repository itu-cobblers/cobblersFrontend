import type { ExecuteStatus } from '@types'

export interface OutputPanelProps {
  output: string
  status: ExecuteStatus | null
  placeHolder: string
  /** Per-rule hints from a graded submission — additive to stdout/stderr, not a substitute. Omitted when the submission passed or no rule had a message. */
  feedback?: string[] | null
}
