// The bottom strip for `project` assignments — same dark "glass" terminal
// chrome as OutputPanel (bg-terminal, terminal-line borders) so swapping
// between assignment kinds doesn't jar, but there's no run output here: the
// content is a big upload dropzone instead, and no Run button (see
// CodeFileTabs, which omits it for this kind).
export const PROJECT_PANEL_CLASS = 'flex h-[40%] shrink-0 flex-col border-t border-terminal-line bg-terminal font-mono'

export const PROJECT_HEADER_CLASS =
  'flex shrink-0 items-center justify-between border-b border-terminal-line px-3.5 py-1.5 text-[11px] uppercase tracking-[0.8px] text-terminal-muted'

export const PROJECT_HEADER_LEFT_CLASS = 'flex items-center gap-2'

export const PROJECT_HEADER_COUNT_CLASS = 'font-bold text-term-ok'

// Fills the space between header and footer — the dropzone inside (flex-1)
// ends up occupying the large majority of it, matching what the terminal
// used to take up.
export const PROJECT_BODY_CLASS = 'flex flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 py-2.5'

export const PROJECT_NOTE_CLASS = 'shrink-0 text-[11px] leading-relaxed text-terminal-muted'

export const PROJECT_FOOTER_CLASS = 'flex shrink-0 items-center justify-end gap-2.5 border-t border-terminal-line px-3.5 py-2'

export const PROJECT_SOLUTION_CLASS =
  'flex shrink-0 flex-col gap-2.5 rounded-md border border-terminal-line bg-black/20 p-3'

export const PROJECT_SOLUTION_LABEL_CLASS = 'text-[11px] font-semibold uppercase tracking-[0.8px] text-terminal-muted'

export const PROJECT_SOLUTION_FILE_NAME_CLASS = 'mb-1 font-mono text-[11px] text-terminal-muted'

export const PROJECT_SOLUTION_FILE_CONTENT_CLASS =
  'mb-3 overflow-x-auto whitespace-pre rounded bg-black/30 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-terminal-ink last:mb-0'
