export const VIEWER_CLASS = 'flex h-full min-w-0 flex-[6] flex-col overflow-hidden border-l border-border bg-background'

export const HEADER_CLASS = 'flex h-10 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 text-xs'
export const HEADER_LEFT_CLASS = 'flex items-center gap-2 truncate font-mono text-muted-foreground'
export const HEADER_STUDENT_NAME_CLASS = 'font-semibold text-foreground'
export const HEADER_SUBMITTED_AT_CLASS = 'text-[11px] text-muted-foreground/70'
export const HEADER_BADGE_BASE_CLASS =
  'inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold'
export const HEADER_BADGE_PASSED_CLASS =
  'bg-status-success/20 text-status-success border border-status-success/30'
export const HEADER_BADGE_FAILED_CLASS = 'bg-status-error/20 text-status-error border border-status-error/30'

export const TABS_CLASS = 'flex h-10 shrink-0 items-center gap-2 border-b border-border bg-card/60 px-2'
export const TABS_LIST_CLASS = 'flex h-full items-center gap-0 overflow-hidden'
export const TAB_BASE_CLASS = 'relative flex h-full items-center gap-1.5 px-3 font-mono text-[11px] transition-colors'
export const TAB_ACTIVE_CLASS = 'text-foreground'
export const TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'
export const TAB_UNDERLINE_CLASS = 'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent'
export const TABS_LABEL_CLASS = 'ml-auto shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground/60'

export const BRIEF_WRAP_CLASS = 'flex-1 min-h-0 overflow-y-auto bg-terminal p-6 scrollbar-hide'
export const BRIEF_LABEL_CLASS = 'mb-2 text-[11px] font-bold uppercase tracking-wider text-terminal-muted'
export const BRIEF_TEXT_CLASS = 'whitespace-pre-wrap text-sm leading-relaxed text-terminal-ink'

export const RESULT_PANEL_CLASS =
  'flex h-[35%] shrink-0 flex-col overflow-hidden border-t border-border bg-terminal font-mono text-xs text-term-ink'
export const RESULT_HEADER_CLASS =
  'flex h-8 shrink-0 items-center justify-between border-b border-border bg-black/40 px-4 text-[11px] uppercase tracking-wider text-muted-foreground'
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
