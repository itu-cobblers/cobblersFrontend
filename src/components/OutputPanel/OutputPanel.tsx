import classNames from 'classnames'
import { Icon } from '@components/Icon'
import { SubmitButton } from '@components/SubmitButton'
import { ShowAnswerButton } from '@components/ShowAnswerButton'
import type { OutputPanelProps } from './OutputPanel.types'
import {
  OUTPUT_PANEL_CLASS,
  OUTPUT_HEADER_CLASS,
  OUTPUT_HEADER_LEFT_CLASS,
  OUTPUT_STATUS_BASE_CLASS,
  OUTPUT_CONTENT_CLASS,
  OUTPUT_PLACEHOLDER_CLASS,
  OUTPUT_FOOTER_CLASS,
} from './OutputPanel.constants'
import { isErrorStatus, getStatusLabel, getSubmitButtonStatus } from './OutputPanel.utils'

export default function OutputPanel({ output, status, submit, showAnswer }: OutputPanelProps) {
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
        {output || <span className={OUTPUT_PLACEHOLDER_CLASS}>Press Run to see your output…</span>}
      </pre>
      {(submit || showAnswer) && (
        <div className={OUTPUT_FOOTER_CLASS}>
          {/* Code's "Show answer" waits on a future SignalR reveal-answer signal — see OutputPanel.types.ts. */}
          {showAnswer && <ShowAnswerButton onClick={showAnswer.onClick} isDisabled={showAnswer.isDisabled} />}
          {submit && (
            <SubmitButton
              status={getSubmitButtonStatus(submit)}
              onClick={submit.onSubmit}
              isDisabled={submit.isDisabled}
            />
          )}
        </div>
      )}
    </div>
  )
}
