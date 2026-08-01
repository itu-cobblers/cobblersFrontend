import type { ExecuteStatus } from '@types'

export interface OutputPanelProps {
  output: string
  status: ExecuteStatus | null
}
