// 4:6 split with the editor column (STUDENT_EDITOR_COLUMN_CLASS / PROJECT_PANEL_CLASS) — description gets 4, code gets 6.
export const PANEL_CLASS = 'flex min-w-0 flex-[4] flex-col overflow-hidden border-r border-border bg-card'

export const PANEL_SCROLL_CLASS = 'flex-1 overflow-y-auto px-5 py-4'

export const PANEL_TITLE_CLASS = 'mb-3 text-[19px] font-semibold tracking-tight text-foreground'

export const PANEL_LESSON_TEXT_CLASS = 'mb-3 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground'

export const PANEL_LESSON_CODE_CLASS =
  'mb-3 overflow-x-auto bg-black/10 px-3.5 py-3 font-mono text-[12px] leading-relaxed whitespace-pre text-foreground/90'

export const PANEL_TASK_LABEL_CLASS = 'mb-1.5 mt-4 text-[13px] font-semibold uppercase tracking-[0.8px] text-black'

export const PANEL_TASK_CLASS = 'whitespace-pre-wrap text-[15px] leading-relaxed text-foreground'

export const PANEL_BODY_CLASS = 'mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground'

// Project briefs (embedded PDF + setup-guide popup) render via the shared
// `ProjectBrief` component (@components/ProjectBrief) — used here and by
// `TeacherAssignmentPanel` so both look identical.

export const PANEL_HINT_CLASS =
  'mt-4 bg-black/10 px-2.5 py-2 text-[12px] leading-relaxed text-foreground'

export const PANEL_HINT_TOGGLE_CLASS =
  'flex w-full items-center justify-between gap-2 text-left font-medium text-foreground'

export const PANEL_HINT_ARROW_CLASS = 'inline-block text-[18px] transition-transform'

export const PANEL_HINT_ARROW_EXPANDED_CLASS = 'rotate-90'

export const PANEL_HINT_BODY_CLASS = 'mt-1.5'

export const PANEL_HINT_CODE_CLASS = 'font-mono text-[11px] text-foreground'

export const PANEL_TABS_CLASS = 'flex h-10 shrink-0 items-stretch gap-1 border-b border-border px-3'

export const PANEL_TAB_BASE_CLASS = 'relative flex h-full items-center px-3 text-sm transition-colors'

export const PANEL_TAB_ACTIVE_CLASS = 'text-foreground'

export const PANEL_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'

export const PANEL_TAB_UNDERLINE_CLASS = 'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-black'

export const PANEL_TAB_COUNT_CLASS = 'ml-2 rounded bg-muted px-1.5 text-[10px]'

export const PANEL_SUBMISSIONS_EMPTY_CLASS =
  'flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground'

export const PANEL_SUBMISSIONS_LIST_CLASS = 'divide-y divide-border rounded-md border border-border'

export const PANEL_SUBMISSION_ROW_CLASS = 'flex items-center justify-between gap-3 px-4 py-3 text-left text-sm'

export const PANEL_SUBMISSION_BADGE_PASSED_CLASS =
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500'

export const PANEL_SUBMISSION_BADGE_FAILED_CLASS =
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500'

export const PANEL_SUBMISSION_TITLE_CLASS = 'text-sm font-medium text-foreground'

export const PANEL_SUBMISSION_META_CLASS = 'text-[11px] text-muted-foreground'

export const PANEL_REVEAL_ROW_CLASS = 'mt-4 flex'

export const PANEL_REVEAL_LABEL = {
  show: 'Show reference answer',
  hide: 'Hide reference answer',
  loading: 'Loading…',
} as const
