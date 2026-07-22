import classNames from 'classnames'
import type { OutputPanelProps } from './OutputPanel.types'
import {
  OUTPUT_PANEL_CLASS,
  OUTPUT_HEADER_CLASS,
  OUTPUT_STATUS_BASE_CLASS,
  OUTPUT_CONTENT_CLASS,
  OUTPUT_PLACEHOLDER_CLASS,
} from './OutputPanel.constants'
import { isErrorStatus, getStatusLabel } from './OutputPanel.utils'

export default function OutputPanel({ output, status }: OutputPanelProps) {
  const isError = isErrorStatus(status)
  const statusLabel = getStatusLabel(status)

  return (
    <div className={OUTPUT_PANEL_CLASS}>
      <div className={OUTPUT_HEADER_CLASS}>
        <span>Terminal</span>
        {status && (
          <span
            className={classNames(OUTPUT_STATUS_BASE_CLASS, {
              'text-term-ok': !isError,
              'text-term-err': isError,
            })}
          >
            {statusLabel}
          </span>
        )}
      </div>
      <pre className={classNames(OUTPUT_CONTENT_CLASS, { 'text-term-err': isError })}>
        {output || <span className={OUTPUT_PLACEHOLDER_CLASS}>Press Run to see your output…</span>}
      </pre>
    </div>
  )
}
