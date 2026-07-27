import type { AssignmentKind } from '@types'

export const LIST_CLASS_BASE =
  'flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-card/60 backdrop-blur transition-all duration-200 ease-out'

export const LIST_CLASS_OPEN = 'w-64'

export const LIST_CLASS_CLOSED = 'w-12'

export const LIST_HEADER_CLASS =
  'flex h-10 shrink-0 items-center gap-2 border-b border-border px-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground'

export const LIST_HEADER_RIGHT_CLASS = 'ml-auto flex items-center gap-1.5'

export const LIST_SESSION_CLASS =
  'flex flex-col gap-1 border-b border-border px-3 py-2 text-[11px] text-muted-foreground'

export const LIST_SESSION_LABEL_CLASS =
  'w-fit rounded-md border px-2 py-0.5 text-[11px] font-semibold border-accent/30 bg-accent/20 text-muted-foreground'

export const LIST_SESSION_NAME_CLASS = 'truncate'

export const LIST_SESSION_NAME_STRONG_CLASS = 'font-medium text-foreground'

export const LIST_COUNT_CLASS = 'rounded bg-muted px-1.5 py-0.5 text-[10px] normal-case tracking-normal'

export const LIST_TOGGLE_CLASS = 'rounded p-1 text-muted-foreground normal-case tracking-normal transition-colors hover:bg-white/5'

// The two tabs — "Session" (this session's assignment list) and "History"
// (this student's full cross-day submission history) — rendered as one
// underlined tab pair right under the header, mirroring AssignmentPanel's
// Description/Submissions tabs so the pattern reads consistently app-wide.
export const LIST_RAIL_TABS_CLASS = 'flex shrink-0 border-b border-border'

export const LIST_RAIL_TAB_BASE_CLASS =
  'relative flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-[11px] font-medium transition-colors'

export const LIST_RAIL_TAB_ACTIVE_CLASS = 'text-foreground'

export const LIST_RAIL_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'

export const LIST_RAIL_TAB_UNDERLINE_CLASS = 'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent'

export const LIST_RAIL_TAB_LABEL_CLASS = 'truncate normal-case tracking-normal'

export const LIST_HISTORY_LOADING_CLASS = 'px-3 py-4 text-center text-[12px] text-muted-foreground'

export const LIST_ITEMS_CLASS = 'min-h-0 flex-1 overflow-y-auto scrollbar-hide py-2'

export const LIST_ITEM_BASE_CLASS =
  'group relative flex w-full items-start gap-2.5 px-3 py-2 text-left text-sm transition-colors'

export const LIST_ITEM_ACTIVE_CLASS = 'bg-white/[0.06] text-foreground'

export const LIST_ITEM_IDLE_CLASS = 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'

export const LIST_ITEM_ACCENT_BAR_CLASS = 'absolute inset-y-1 left-0 w-0.5 rounded-r bg-accent'

export const LIST_ITEM_META_CLASS = 'flex items-center gap-1.5 text-[11px] font-mono text-foreground/40'

export const LIST_ITEM_KIND_BADGE_CLASS =
  'inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-[1px] text-[9px] uppercase tracking-widest'

export const LIST_ITEM_TITLE_CLASS = 'mt-0.5 truncate text-[13px] leading-tight'

export const LIST_ITEM_LIVE_CLASS = 'ml-auto text-[9px] uppercase tracking-widest bg-accent text-white px-2 rounded-md'

// Same "live" pill as LIST_ITEM_LIVE_CLASS but without `ml-auto` — for stacking
// under a sibling (e.g. TeacherProblemsList's passed-count) instead of sharing its row.
export const LIST_ITEM_LIVE_BADGE_CLASS = 'text-[9px] uppercase tracking-widest bg-accent text-white px-2 rounded-md'

export const LIST_FOOTER_CLASS = 'flex items-center gap-3 border-t border-border px-4 py-2 text-[10px] uppercase tracking-widest text-foreground/30'

// Footer action bar pinned to the bottom of the rail — just Leave/Exit now
// that "My Progress" lives inline as the History tab above.
export const LIST_TABS_CLASS = 'mt-auto flex items-stretch border-t border-border'

export const LIST_TAB_BASE_CLASS =
  'flex flex-1 items-center justify-center gap-2 px-2 py-2.5 text-xs transition-colors'

export const LIST_TAB_IDLE_CLASS = 'text-muted-foreground hover:bg-white/5'

export const LIST_TAB_LABEL_CLASS = 'truncate'

export const LIST_STATUS_DOT_CLASS: Record<string, string> = {
  passed: 'mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-status-success text-status-success',
  tried: 'mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-status-warning text-status-warning',
  untried: 'mt-0.5 inline-flex h-4 w-4 items-center justify-center text-foreground/25',
}

export const LIST_LEGEND_DOT_CLASS: Record<string, string> = {
  passed: 'inline-block h-1.5 w-1.5 rounded-full bg-status-success',
  tried: 'inline-block h-1.5 w-1.5 rounded-full bg-status-warning',
  untried: 'inline-block h-1.5 w-1.5 rounded-full bg-white/30',
}

export const KIND_LABEL: Record<AssignmentKind, string> = {
  code: 'code',
  predict: 'predict',
  project: 'project',
}
