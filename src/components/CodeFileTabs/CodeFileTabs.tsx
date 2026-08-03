import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type { CodeFileTabsProps } from './CodeFileTabs.types'
import {
    FILE_TABS_ROW_CLASS,
    FILE_TABS_LIST_CLASS,
    FILE_TAB_BASE_CLASS,
    FILE_TAB_ACTIVE_CLASS,
    FILE_TAB_IDLE_CLASS,
} from './CodeFileTabs.constants'

export default function CodeFileTabs({
    files,
    activeIndex,
    onSelectFile,
    actions,
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
                        </button>
                    )
                })}
            </div>
            {actions}
        </div>
    )
}
