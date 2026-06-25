import type { ExecuteStatus } from '@types'
import { OUTPUT_STATUS_LABEL } from './OutputPanel.constants'

export function isErrorStatus(status: ExecuteStatus | null): boolean {
  return status === 'compile_error' || status === 'runtime_error'
}

export function getStatusLabel(status: ExecuteStatus | null): string {
  if (!status) return ''
  return OUTPUT_STATUS_LABEL[status]
}
