import classNames from 'classnames'
import { Icon } from '@components/Icon'
import { Spinner } from '@components/Spinner'
import type { CodeFileTabsProps } from './CodeFileTabs.types'
import {
  FILE_TABS_ROW_CLASS,
  FILE_TABS_LIST_CLASS,
  FILE_TAB_BASE_CLASS,
  FILE_TAB_ACTIVE_CLASS,
  FILE_TAB_IDLE_CLASS,
  FILE_TAB_SOLUTION_ACTIVE_CLASS,
  FILE_TAB_SOLUTION_IDLE_CLASS,
  FILE_TAB_UNDERLINE_CLASS,
  FILE_TAB_SOLUTION_UNDERLINE_CLASS,
  RUN_BUTTON_CLASS,
} from './CodeFileTabs.constants'

/**
 * The strip above the Monaco editor: one tab per file (the student's own
 * file plus any read-only harness/grader files) and, when `onRun` is given,
 * the Run button. A single file still gets one tab, matching the multi-file
 * layout. Project assignments reuse this same strip for their uploaded file
 * tabs but omit `onRun` — there's nothing to run, only upload.
 *
 * When a reference answer is revealed, solution tabs are appended with
 * `variant: 'solution'` (accent-coloured) so students can flip between their
 * work and the example without the solution ever being submitted.
 */
export default function CodeFileTabs({ files, activeIndex, onSelectFile, isRunning, isRunDisabled, onRun }: CodeFileTabsProps) {
  return (
    <div className={FILE_TABS_ROW_CLASS}>
      <div className={FILE_TABS_LIST_CLASS}>
        {files.map((file, index) => {
          const isSolution = file.variant === 'solution'
          const isActive = index === activeIndex
          return (
            <button
              key={`${file.variant ?? 'student'}:${file.name}:${index}`}
              type="button"
              onClick={() => onSelectFile(index)}
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
      {onRun && (
        <button type="button" onClick={onRun} disabled={isRunning || isRunDisabled} className={RUN_BUTTON_CLASS}>
          {isRunning ? <Spinner variant="action" /> : <Icon name="play" />}
          Run
        </button>
      )}
    </div>
  )
}
