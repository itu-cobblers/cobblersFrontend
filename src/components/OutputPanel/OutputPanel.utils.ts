import type { ExecuteStatus } from '@types'
import type { SubmitButtonStatus } from '@components/SubmitButton'
import { OUTPUT_STATUS_LABEL } from './OutputPanel.constants'
import type { OutputPanelSubmit } from './OutputPanel.types'

export function isErrorStatus(status: ExecuteStatus | null): boolean {
  return status === 'compile_error' || status === 'runtime_error'
}

export function getStatusLabel(status: ExecuteStatus | null): string {
  if (!status) return ''
  return OUTPUT_STATUS_LABEL[status]
}

/** Derives the shared Submit button's animation status from a submit config. */
export function getSubmitButtonStatus(submit: OutputPanelSubmit): SubmitButtonStatus {
  if (submit.isSubmitting) return 'waiting'
  if (submit.lastResultPassed === true) return 'success'
  if (submit.lastResultPassed === false) return 'error'
  return 'idle'
}
