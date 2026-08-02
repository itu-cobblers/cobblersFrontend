import classNames from 'classnames'
import { Icon } from '@components/Icon'
import { Spinner } from '@components/Spinner'
import { SubmitButton } from '@components/SubmitButton'
import type { ToolbarProps } from './Toolbar.types'
import {
  TOOLBAR_ROW_CLASS,
  TOOLBAR_TABS_CLASS,
  TOOLBAR_ACTIONS_CLASS,
  FILE_TAB_BASE_CLASS,
  FILE_TAB_ACTIVE_CLASS,
  FILE_TAB_IDLE_CLASS,
  FILE_TAB_SOLUTION_ACTIVE_CLASS,
  FILE_TAB_SOLUTION_IDLE_CLASS,
  FILE_TAB_UNDERLINE_CLASS,
  FILE_TAB_SOLUTION_UNDERLINE_CLASS,
  RUN_BUTTON_CLASS,
} from './Toolbar.constants'

/**
 * The strip above the editor: one tab per file on the left, the actions on the
 * right. Run and Submit sit together because they're the same gesture at two
 * confidence levels — "let me check" and "I'm done".
 *
 * Every assignment kind renders this. Tabs and Run are both optional, so
 * `predict` (nothing to run) and `project` (nothing to run) show Submit alone.
 *
 * While a reference answer is open, Submit becomes "Mark As Done" and calls
 * `onMarkAsDone`, reusing its own status animation — the binding that used to
 * live in AssignmentFooter.
 */
export default function Toolbar({
  files,
  activeIndex = 0,
  onSelectFile,
  isRunning,
  onRun,
  submitStatus,
  onSubmit,
  isSubmitDisabled = false,
  canMarkAsDone = false,
  isMarkingDone = false,
  onMarkAsDone,
}: ToolbarProps) {
  const isMarkDoneAction = canMarkAsDone && Boolean(onMarkAsDone)
  const buttonStatus = isMarkDoneAction && isMarkingDone ? 'waiting' : submitStatus
  const buttonLabel = isMarkDoneAction ? 'Mark As Done' : undefined
  const handleButtonClick = isMarkDoneAction ? (onMarkAsDone ?? onSubmit) : onSubmit
  const isButtonDisabled = isMarkDoneAction ? isMarkingDone : isSubmitDisabled

  return (
    <div className={TOOLBAR_ROW_CLASS}>
      <div className={TOOLBAR_TABS_CLASS}>
        {files?.map((file, index) => {
          const isSolution = file.variant === 'solution'
          const isActive = index === activeIndex
          return (
            <button
              key={`${file.variant ?? 'student'}:${file.name}:${index}`}
              type="button"
              onClick={() => onSelectFile?.(index)}
              className={classNames(
                FILE_TAB_BASE_CLASS,
                isSolution
                  ? isActive
                    ? FILE_TAB_SOLUTION_ACTIVE_CLASS
                    : FILE_TAB_SOLUTION_IDLE_CLASS
                  : isActive
                    ? FILE_TAB_ACTIVE_CLASS
                    : FILE_TAB_IDLE_CLASS,
              )}
            >
              <Icon name="book" />
              {file.name}
              {isActive && (
                <span className={isSolution ? FILE_TAB_SOLUTION_UNDERLINE_CLASS : FILE_TAB_UNDERLINE_CLASS} />
              )}
            </button>
          )
        })}
      </div>

      <div className={TOOLBAR_ACTIONS_CLASS}>
        {onRun && (
          <button type="button" onClick={onRun} disabled={isRunning} className={RUN_BUTTON_CLASS}>
            {isRunning ? <Spinner /> : <Icon name="play" />}
            <span>{isRunning ? 'Running…' : 'Run'}</span>
          </button>
        )}
        <SubmitButton
          status={buttonStatus}
          onClick={handleButtonClick}
          isDisabled={isButtonDisabled}
          label={buttonLabel}
        />
      </div>
    </div>
  )
}
