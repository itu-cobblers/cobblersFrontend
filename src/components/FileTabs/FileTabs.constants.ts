/** Tab strip sits on `terminal-line` so the active tab can "punch through" to the
 *  editor's `terminal` background directly beneath it, like a VS Code tab bar. */
export const FILE_TABS_CLASS = 'flex shrink-0 items-center gap-0.5 bg-terminal-line px-2 pt-1.5'

export const FILE_TAB_BASE_CLASS = 'cursor-pointer rounded-t-md px-3 py-1.5 text-[12px] font-medium transition-colors'

export const FILE_TAB_IDLE_CLASS = 'text-terminal-muted hover:text-terminal-ink'

export const FILE_TAB_ACTIVE_CLASS = 'bg-terminal text-terminal-ink'
