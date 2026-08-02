import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type { OutputPanelProps } from './OutputPanel.types'
import {
  OUTPUT_PANEL_CLASS,
  OUTPUT_HEADER_CLASS,
  OUTPUT_HEADER_LEFT_CLASS,
  OUTPUT_STATUS_BASE_CLASS,
  OUTPUT_CONTENT_CLASS,
  OUTPUT_PLACEHOLDER_CLASS,
} from './OutputPanel.constants'
import { isErrorStatus, getStatusLabel } from './OutputPanel.utils'

export default function OutputPanel({ output, status, placeHolder }: OutputPanelProps) {
  const isError = isErrorStatus(status)
  const statusLabel = getStatusLabel(status)

  return (
    <div className={OUTPUT_PANEL_CLASS}>
      <div className={OUTPUT_HEADER_CLASS}>
        <span className={OUTPUT_HEADER_LEFT_CLASS}>
          <Icon name="terminal" />
          Terminal
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
        </span>
      </div>
      <pre className={classNames(OUTPUT_CONTENT_CLASS, { 'text-term-err': isError })}>
        {output || <span className={OUTPUT_PLACEHOLDER_CLASS}>{placeHolder}</span>}
      </pre>
    </div>
  )
}
