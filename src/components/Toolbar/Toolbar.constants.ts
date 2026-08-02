export const TOOLBAR_ROW_CLASS =
  'flex h-10 shrink-0 items-center justify-between gap-2 border-b border-terminal-line px-2'

export const TOOLBAR_ACTIONS_CLASS = 'flex shrink-0 items-center gap-3'

export const TOOLBAR_TABS_CLASS = 'flex h-full items-center gap-0 overflow-hidden'

export const FILE_TAB_BASE_CLASS =
  'relative flex h-full items-center gap-1.5 px-3 font-mono text-[11px] transition-colors'

export const FILE_TAB_ACTIVE_CLASS = 'text-foreground'

export const FILE_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'

/** Reference-answer tabs — accent ink so they read as distinct from the student's own. */
export const FILE_TAB_SOLUTION_ACTIVE_CLASS = 'text-accent'

export const FILE_TAB_SOLUTION_IDLE_CLASS = 'text-accent/60 hover:text-accent'

export const FILE_TAB_UNDERLINE_CLASS = 'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-black'

export const FILE_TAB_SOLUTION_UNDERLINE_CLASS = 'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent'

export const RUN_BUTTON_CLASS =
  'inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/70 disabled:cursor-not-allowed disabled:opacity-40'
