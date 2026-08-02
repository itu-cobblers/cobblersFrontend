import type { AssignmentKind } from '@types'

export const LIST_CLASS_BASE =
  'flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-card transition-all duration-200 ease-out'

export const LIST_CLASS_OPEN = 'w-64'

export const LIST_CLASS_CLOSED = 'w-12'

/**
 * The rail's own header row is gone — the collapse toggle moved into the
 * session row and the count onto the Session tab. These are kept because
 * `TeacherProblemsList` still renders a header of its own.
 */
export const LIST_HEADER_CLASS =
  'flex h-10 shrink-0 items-center gap-2 border-b border-border px-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground'

export const LIST_HEADER_RIGHT_CLASS = 'ml-auto flex items-center gap-1.5'

/**
 * Holds the collapse toggle alone — session identity moved to the AppHeader.
 * Always renders, even collapsed: it carries the only control that can
 * reopen the rail.
 */
export const LIST_SESSION_CLASS =
  'flex shrink-0 items-start gap-2 border-b border-border py-2 text-[11px] text-muted-foreground'

export const LIST_SESSION_OPEN_CLASS = 'justify-end px-3'

/** Collapsed, the toggle is all that's left, so it centres in the 48px rail. */
export const LIST_SESSION_CLOSED_CLASS = 'justify-center px-1'

export const LIST_COUNT_CLASS = 'rounded bg-muted px-1.5 py-0.5 text-[10px] normal-case tracking-normal'

export const LIST_TOGGLE_CLASS = 'rounded p-1 text-muted-foreground normal-case tracking-normal transition-colors hover:bg-black/5'

// The two tabs — "Session" (this session's assignment list) and "History"
// (this student's full cross-day submission history) — rendered as one
// underlined tab pair right under the header, mirroring AssignmentPanel's
// Description/Submissions tabs so the pattern reads consistently app-wide.
export const LIST_RAIL_TABS_CLASS = 'flex shrink-0 border-b border-border'

export const LIST_RAIL_TAB_BASE_CLASS =
  'relative flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-[11px] font-medium transition-colors'

export const LIST_RAIL_TAB_ACTIVE_CLASS = 'text-foreground'

export const LIST_RAIL_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'

export const LIST_RAIL_TAB_UNDERLINE_CLASS = 'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-black'

export const LIST_RAIL_TAB_LABEL_CLASS = 'truncate normal-case tracking-normal'

/** Avoids the word "problems", which means nothing to a beginner. */
export const LIST_TOGGLE_LABEL = {
  collapse: 'Collapse assignment list',
  expand: 'Expand assignment list',
} as const

export const LIST_HISTORY_LOADING_CLASS = 'px-3 py-4 text-center text-[12px] text-muted-foreground'

export const LIST_ITEMS_CLASS = 'min-h-0 flex-1 overflow-y-auto scrollbar-hide py-2'

export const LIST_ITEM_BASE_CLASS =
  'group relative flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors'

export const LIST_ITEM_ACTIVE_CLASS = 'bg-black/[0.06] text-foreground'

export const LIST_ITEM_IDLE_CLASS = 'text-muted-foreground hover:bg-black/[0.03] hover:text-foreground'

export const LIST_ITEM_ACCENT_BAR_CLASS = 'absolute inset-y-1 left-0 w-0.5 rounded-r bg-accent'

export const LIST_ITEM_META_CLASS = 'flex items-center gap-1.5 text-[11px] font-mono text-foreground/40'

export const LIST_ITEM_KIND_BADGE_CLASS =
  'inline-flex items-center gap-1 rounded bg-black/5 px-1.5 py-[1px] text-[9px] uppercase tracking-widest'

export const LIST_ITEM_TITLE_CLASS = 'mt-0.5 truncate text-[13px] leading-tight'

export const LIST_ITEM_LIVE_CLASS = 'ml-auto text-[9px] uppercase tracking-widest bg-accent text-white px-2 rounded-md'

export const LIST_FOOTER_CLASS = 'flex items-center justify-center gap-3 border-t border-border px-4 py-2 text-[10px]'

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
