// 4:6 split with the editor column (STUDENT_EDITOR_COLUMN_CLASS / PROJECT_PANEL_CLASS) — description gets 4, code gets 6.
export const PANEL_CLASS = 'flex min-w-0 flex-[4] flex-col overflow-hidden bg-card'

/**
 * Carries the card's outline instead of the section, so the sides start at the
 * tab row's rule rather than running up past it and exposing the seam.
 */
export const PANEL_CARD_BODY_CLASS =
  'flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-md border-x border-b border-divider'

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

/**
 * Same manila-folder seam as the editor's tab rail: the row draws the rule,
 * the active tab is pulled `-mb-px` over it and covers that pixel with its own
 * opaque background. Nothing here may gain `overflow-hidden` — it clips the
 * overlap and closes the seam.
 */
export const PANEL_TABS_CLASS = 'flex h-10 shrink-0 items-stretch gap-1 border-b border-divider px-3'

/**
 * No `h-full`. The seam depends on the tab being *stretched* by the row: a
 * stretched item's height is `row content height - margins`, so `-mb-px` makes
 * it 1px taller and it covers the rule. An explicit `height: 100%` opts out of
 * stretch, pins the tab to the top at exactly the content height, and the
 * negative margin then moves nothing — which is why this rule stayed visible
 * while the file tabs' did not.
 */
export const PANEL_TAB_BASE_CLASS =
  'relative flex items-center rounded-t-md px-3 text-sm transition-colors'

/** `bg-card` because that is the panel's surface — it has to match to hide the rule. */
export const PANEL_TAB_ACTIVE_CLASS =
  '-mb-px border border-b-0 border-divider bg-card text-foreground'

export const PANEL_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'

export const PANEL_TAB_COUNT_CLASS = 'ml-2 rounded bg-muted px-1.5 text-[10px]'

export const PANEL_SUBMISSIONS_EMPTY_CLASS =
  'flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground'

export const PANEL_SUBMISSIONS_LIST_CLASS = 'rounded-md'


