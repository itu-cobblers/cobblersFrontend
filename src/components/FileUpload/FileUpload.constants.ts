// Lives inside the project panel's terminal-styled bottom strip — dark
// "glass" tokens (terminal-*) so it matches OutputPanel/CodeFileTabs instead
// of the light chrome tokens the rest of the app uses.
export const FILE_UPLOAD_CLASS = 'flex flex-1 min-h-[180px] flex-col gap-2.5'

export const DROPZONE_BASE_CLASS =
  'flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors'

export const DROPZONE_IDLE_CLASS = 'border-terminal-line bg-black/10 hover:border-terminal-muted hover:bg-black/20'

export const DROPZONE_ACTIVE_CLASS = 'border-accent bg-accent/10'

export const DROPZONE_LABEL_CLASS = 'text-[13px] font-medium text-terminal-ink'

export const DROPZONE_SUBLABEL_CLASS = 'text-[11px] text-terminal-muted'

export const FILE_INPUT_HIDDEN_CLASS = 'hidden'

export const FILE_LIST_CLASS = 'flex shrink-0 flex-wrap gap-1.5'

export const FILE_CHIP_CLASS =
  'rounded bg-black/20 px-2 py-0.5 font-mono text-[11px] text-terminal-ink'

export const FILE_EMPTY_CLASS = 'shrink-0 font-mono text-[11px] text-terminal-muted'
