import type { ExecuteStatus } from '@types'
import type { AssignmentFooterProps } from '@components/AssignmentFooter'

export interface OutputPanelProps {
  output: string
  status: ExecuteStatus | null
  /** Shared Submit / reveal / mark-as-done footer — omit to hide it entirely. */
  footer?: AssignmentFooterProps
}
