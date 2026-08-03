import type { AssignmentKind } from '@types'

export const LIST_CLASS_BASE =
  'flex h-full shrink-0 flex-col overflow-hidden bg-card transition-all duration-200 ease-out'

/**
 * Carries the card's outline instead of the section, so the sides start at the
 * tab row's rule rather than running up past it and exposing the seam.
 */
export const LIST_CARD_BODY_CLASS =
  'flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-md border-x border-b border-divider'

export const LIST_CLASS_OPEN = 'w-64'

export const LIST_CLASS_CLOSED = 'w-12'

/**
 * The rail's own header row is gone — the collapse toggle moved into the
 * session row and the count onto the Session tab. These are kept because
 * `TeacherProblemsList` still renders a header of its own.
 */
/**
 * Teacher-only (the student rail has tabs instead). Matches
 * LIST_RAIL_TAB_BASE_CLASS's `text-sm` in normal case — the letter-spaced
 * caps this used to carry were the loudest mismatch between the two views.
 */
export const LIST_HEADER_CLASS =
  'flex h-10 shrink-0 items-center gap-2 border-b border-divider px-3 text-sm text-foreground -mb-px border border-b-0 border-divider bg-card text-foreground'

export const LIST_HEADER_RIGHT_CLASS = 'ml-auto flex items-center gap-1.5'

export const LIST_COUNT_CLASS = 'rounded bg-muted px-1.5 py-0.5 text-[10px] normal-case tracking-normal'

export const LIST_TOGGLE_CLASS = 'rounded p-1 text-muted-foreground normal-case tracking-normal transition-colors hover:bg-black/5'

// The two tabs — "Session" (this session's assignment list) and "History"
// (this student's full cross-day submission history) — rendered as one
// underlined tab pair right under the header, mirroring AssignmentPanel's
// Description/Submissions tabs so the pattern reads consistently app-wide.
/**
 * Session tab on the left, a compact History icon-toggle and the collapse
 * toggle on the right. History gave up its half of the row as a labelled tab
 * (see LIST_RAIL_HISTORY_TOGGLE_CLASS) — it wasn't earning that much space —
 * but it still needs an entry point, so it's a small icon button instead.
 * `items-stretch` lets the session tab fill the row so its active underline
 * lands on the row's own bottom border.
 */
export const LIST_RAIL_TABS_CLASS = 'flex h-10 shrink-0 items-stretch border-b border-divider'

export const LIST_RAIL_TABS_OPEN_CLASS = 'pr-1'

/** Collapsed, the toggle is the only thing left in the row. */
export const LIST_RAIL_TABS_CLOSED_CLASS = 'justify-center'

export const LIST_RAIL_TOGGLE_CLASS = 'shrink-0 self-center'

/** `text-sm` to match PANEL_TAB_BASE_CLASS — the rail and the panel read as one tab row. */
export const LIST_RAIL_TAB_BASE_CLASS =
  'relative flex flex-1 items-center justify-center gap-2 rounded-t-md px-3 text-sm transition-colors'

/** Same three-part seam as the file tabs: rule on the row, tab pulled over it, opaque fill. */
export const LIST_RAIL_TAB_ACTIVE_CLASS =
  '-mb-px border border-b-0 border-divider bg-card text-foreground'

export const LIST_RAIL_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'

export const LIST_RAIL_TAB_LABEL_CLASS = 'truncate normal-case tracking-normal'

/** Icon-only, same footprint as the fold toggle beside it — not a second full tab. */
export const LIST_RAIL_HISTORY_TOGGLE_CLASS = 'shrink-0 self-center rounded p-1.5 transition-colors'

export const LIST_RAIL_HISTORY_TOGGLE_ACTIVE_CLASS = 'bg-black/[0.06] text-foreground'

export const LIST_RAIL_HISTORY_TOGGLE_IDLE_CLASS = 'text-muted-foreground hover:bg-black/5 hover:text-foreground'

/** Avoids the word "problems", which means nothing to a beginner. */
export const LIST_TOGGLE_LABEL = {
  collapse: 'Collapse assignment list',
  expand: 'Expand assignment list',
} as const

export const LIST_HISTORY_LOADING_CLASS = 'px-3 py-4 text-center text-[12px] text-muted-foreground'

export const LIST_ITEMS_CLASS = 'min-h-0 flex-1 overflow-y-auto scrollbar-hide py-2'

export const LIST_ITEM_BASE_CLASS =
  'group relative flex h-12 w-full items-center gap-2.5 px-3 text-left text-sm transition-colors'

export const LIST_ITEM_ACTIVE_CLASS = 'bg-muted text-foreground'

export const LIST_ITEM_IDLE_CLASS = 'text-muted-foreground hover:bg-black/[0.03] hover:text-foreground'

export const LIST_ITEM_LIVE_BORDER_CLASS = 'border-2 border-primary'

export const LIST_ITEM_META_CLASS = 'flex items-center gap-1.5 text-[11px] font-mono text-foreground/40'

export const LIST_ITEM_KIND_BADGE_CLASS =
  'inline-flex items-center gap-1 rounded bg-black/5 px-1.5 py-[1px] text-[9px] uppercase tracking-widest'

export const LIST_ITEM_TITLE_CLASS = 'mt-0.5 truncate text-[13px] leading-tight'

/** Label only, no chip fill — the row's own `bg-foreground/60` highlight already carries the "this one's live" signal. */
export const LIST_ITEM_LIVE_CLASS = 'ml-auto text-[9px] font-semibold uppercase tracking-widest text-accent'

export const LIST_FOOTER_CLASS = 'flex flex-col items-center gap-1.5 text-[10px]'

export const LIST_FOOTER_LEGEND_CLASS = 'flex items-center justify-center px-4 py-2 gap-3'

/** Same gray "pill" as the teacher rail's own countdown badge. */
export const LIST_TIMER_BADGE_CLASS =
  'inline-flex items-center justify-center w-[100%] bg-muted px-2 py-2 font-mono text-[13px] font-medium normal-case tracking-normal text-muted-foreground'

// Footer action bar pinned to the bottom of the rail — just Leave/Exit now
// that "My Progress" lives inline as the History tab above.
export const LIST_STATUS_DOT_CLASS: Record<string, string> = {
  passed: 'mt-0.5 inline-flex h-2 w-2 items-center justify-center rounded-full bg-status-success text-status-success',
  tried: 'mt-0.5 inline-flex h-2 w-2 items-center justify-center rounded-full bg-status-warning text-status-warning',
  untried: 'mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-foreground/25',
}

export const LIST_LEGEND_DOT_CLASS: Record<string, string> = {
  passed: 'inline-block h-1.5 w-1.5 rounded-full bg-status-success',
  tried: 'inline-block h-1.5 w-1.5 rounded-full bg-status-warning',
  untried: 'inline-block h-1.5 w-1.5 rounded-full bg-black/30',
}

export const KIND_LABEL: Record<AssignmentKind, string> = {
  code: 'code',
  predict: 'predict',
  project: 'project',
}
