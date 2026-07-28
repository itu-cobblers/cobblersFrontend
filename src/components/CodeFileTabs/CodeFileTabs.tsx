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
  FILE_TAB_UNDERLINE_CLASS,
  RUN_BUTTON_CLASS,
} from './CodeFileTabs.constants'

/**
 * The strip above the Monaco editor: one tab per file (the student's own
 * file plus any read-only harness/grader files) and, when `onRun` is given,
 * the Run button. A single file still gets one tab, matching the multi-file
 * layout. Project assignments reuse this same strip for their uploaded file
 * tabs but omit `onRun` — there's nothing to run, only upload.
 */
export default function CodeFileTabs({ files, activeIndex, onSelectFile, isRunning, isRunDisabled, onRun }: CodeFileTabsProps) {
  return (
    <div className={FILE_TABS_ROW_CLASS}>
      <div className={FILE_TABS_LIST_CLASS}>
        {files.map((file, index) => (
          <button
            key={file.name + index}
            type="button"
            onClick={() => onSelectFile(index)}
            className={classNames(FILE_TAB_BASE_CLASS, index === activeIndex ? FILE_TAB_ACTIVE_CLASS : FILE_TAB_IDLE_CLASS)}
          >
            <Icon name="book" />
            {file.name}
            {index === activeIndex && <span className={FILE_TAB_UNDERLINE_CLASS} />}
          </button>
        ))}
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
