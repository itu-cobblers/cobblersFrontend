export const VIEWER_CLASS =
  'flex h-full min-w-0 flex-[6] flex-col overflow-hidden bg-background'

/**
 * Carries the card outline so the sides start at the tab row's rule rather
 * than running up past it. Mirrors PANEL_CARD_BODY_CLASS.
 */
export const VIEWER_BODY_CLASS =
  'flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-md border-x border-b border-divider'

export const HEADER_CLASS = 'flex h-10 shrink-0 items-center justify-between border-b border-divider bg-card px-4 text-xs'
export const HEADER_LEFT_CLASS = 'flex items-center gap-2 truncate font-mono text-muted-foreground'
export const HEADER_STUDENT_NAME_CLASS = 'font-semibold text-foreground'
export const HEADER_SUBMITTED_AT_CLASS = 'text-[11px] text-muted-foreground/70'
export const HEADER_BADGE_BASE_CLASS =
  'inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold'
export const HEADER_BADGE_PASSED_CLASS =
  'bg-status-success/20 text-status-success border border-status-success/30'
export const HEADER_BADGE_FAILED_CLASS = 'bg-status-error/20 text-status-error border border-status-error/30'

export const TABS_CLASS = 'flex h-10 shrink-0 items-stretch gap-2 border-b border-divider bg-card px-2'
export const TABS_LIST_CLASS = 'flex items-stretch gap-1'
export const TAB_BASE_CLASS =
  'relative flex items-center gap-1.5 rounded-t-md px-3 font-mono text-[11px] transition-colors'
export const TAB_ACTIVE_CLASS =
  '-mb-px border border-b-0 border-divider bg-card text-foreground'
export const TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'
export const TABS_LABEL_CLASS = 'ml-auto shrink-0 self-center text-[10px] uppercase tracking-wider text-muted-foreground/60'

// ── project reference solution (mirrors ProjectPanel's reveal area/footer) ──

export const SOLUTION_WRAP_CLASS = 'flex flex-1 min-h-0 flex-col overflow-hidden bg-terminal'

export const SOLUTION_BODY_CLASS = 'flex-1 overflow-y-auto p-4 scrollbar-hide'

export const SOLUTION_NOTE_CLASS = 'text-[12px] leading-relaxed text-terminal-muted'

export const SOLUTION_BLOCK_CLASS = 'mt-3 flex flex-col gap-2.5 rounded-md border border-divider bg-black/20 p-3'

export const SOLUTION_LABEL_CLASS = 'text-[11px] font-semibold uppercase tracking-[0.8px] text-terminal-muted'

export const SOLUTION_FILE_NAME_CLASS = 'mb-1 font-mono text-[11px] text-terminal-muted'

export const SOLUTION_FILE_CONTENT_CLASS =
  'mb-3 overflow-x-auto whitespace-pre rounded bg-black/30 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-terminal-ink last:mb-0'

export const SOLUTION_FOOTER_CLASS =
  'flex shrink-0 items-center justify-end gap-2.5 border-t border-divider px-4 py-2'

export const ANSWER_FOOTER_CLASS = 'flex shrink-0 items-center justify-end gap-2.5 border-t border-divider px-4 py-2'

export const RESULT_PANEL_CLASS =
  'flex h-[35%] shrink-0 flex-col overflow-hidden border-t border-divider bg-terminal font-mono text-xs text-term-ink'
export const RESULT_HEADER_CLASS =
  'flex h-8 shrink-0 items-center justify-between border-b border-divider px-4 text-[11px] uppercase tracking-wider text-muted-foreground'
export const RESULT_STATUS_BASE_CLASS = 'text-[10px] font-bold'
export const RESULT_STATUS_ERROR_CLASS = 'text-status-error'
export const RESULT_STATUS_OK_CLASS = 'text-status-success'
export const RESULT_BODY_CLASS = 'flex-1 overflow-y-auto p-4 scrollbar-hide'
export const RESULT_PRE_CLASS = 'whitespace-pre-wrap leading-relaxed font-mono text-[12px] text-terminal-ink'
export const RESULT_PLACEHOLDER_CLASS = 'text-terminal-muted'

export const PREDICT_LABEL_CLASS = 'mb-1.5 text-[11px] font-bold uppercase tracking-wider text-terminal-muted'
export const PREDICT_ANSWER_CLASS = 'whitespace-pre-wrap font-mono text-[12px] text-terminal-ink'
export const PREDICT_ANSWER_CORRECT_CLASS = 'text-term-ok'
export const PREDICT_ANSWER_WRONG_CLASS = 'text-term-err'
export const PREDICT_SECTION_CLASS = 'mb-4 last:mb-0'
