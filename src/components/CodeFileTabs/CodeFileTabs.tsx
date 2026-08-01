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
    RUN_BUTTON_CLASS, FILE_TAB_READ_ONLY_LABEL_CLASS,
} from './CodeFileTabs.constants'

export default function CodeFileTabs({
    files,
    activeIndex,
    onSelectFile,
    isRunning,
    onRun,
    isReadOnly
}: CodeFileTabsProps) {
    return (
        <div className={FILE_TABS_ROW_CLASS}>
            <div className={FILE_TABS_LIST_CLASS}>
                {files.map((file, index) => {
                    const isActive = index === activeIndex
                    return (
                        <button
                            key={`${file.variant ?? 'student'}:${file.name}:${index}`}
                            type="button"
                            onClick={() => onSelectFile(index)}
                            className={classNames(
                                FILE_TAB_BASE_CLASS, isActive ? FILE_TAB_ACTIVE_CLASS : FILE_TAB_IDLE_CLASS,
                            )}
                        >
                            <Icon name="code" />
                            {file.name}
                            {isActive && (
                                <span className={FILE_TAB_UNDERLINE_CLASS} />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="flex items-center gap-3">
                {onRun && !isReadOnly && (
                    <button
                        type="button"
                        onClick={onRun}
                        disabled={isRunning}
                        className={RUN_BUTTON_CLASS}
                    >
                        {isRunning ? <Spinner /> : <Icon name="play" />}
                        <span>{isRunning ? 'Running…' : 'Run'}</span>
                    </button>
                )}
                {isReadOnly &&
                    <div className={FILE_TAB_READ_ONLY_LABEL_CLASS}>
                        <Icon name={'pencilOff'}/>
                        Read Only
                    </div>
                }
            </div>
        </div>
    )
}