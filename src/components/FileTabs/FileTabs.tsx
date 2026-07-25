import type { MouseEvent } from 'react'
import classNames from 'classnames'
import type { FileTabsProps } from './FileTabs.types'
import { FILE_TABS_CLASS, FILE_TAB_BASE_CLASS, FILE_TAB_IDLE_CLASS, FILE_TAB_ACTIVE_CLASS } from './FileTabs.constants'

/**
 * File tabs above the code editor for multi-file class-authoring assignments
 * (`starterFiles` — e.g. a driver `Main.java` + a stubbed `Person.java`).
 * Selection only — file names are fixed by the assignment and never editable here.
 */
export default function FileTabs({ files, activeFileName, onSelectFile }: FileTabsProps) {
  function handleClick(event: MouseEvent<HTMLElement>) {
    const target = event.target
    if (!(target instanceof Element)) return
    const name = target.closest('[data-file-name]')?.getAttribute('data-file-name')
    if (name != null) onSelectFile(name)
  }

  return (
    <div role="tablist" aria-label="Files" className={FILE_TABS_CLASS} onClick={handleClick}>
      {files.map((file) => (
        <button
          key={file.name}
          type="button"
          role="tab"
          aria-selected={file.name === activeFileName}
          data-file-name={file.name}
          className={classNames(FILE_TAB_BASE_CLASS, {
            [FILE_TAB_ACTIVE_CLASS]: file.name === activeFileName,
            [FILE_TAB_IDLE_CLASS]: file.name !== activeFileName,
          })}
        >
          {file.name}
        </button>
      ))}
    </div>
  )
}
