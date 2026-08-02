/**
 * Typography here deliberately mirrors the student rail (ProblemsList): section
 * headers at `text-sm` in normal case rather than the letter-spaced caps this
 * panel used to carry, and row titles at `text-[13px]`, so the two views read
 * as one product.
 */
export const ROSTER_CLASS =
  'flex h-full w-64 shrink-0 flex-col overflow-hidden rounded-md border border-divider bg-card'

export const ROSTER_HEADER_CLASS =
  'flex h-10 shrink-0 items-center justify-between border-b border-divider px-3 text-sm text-foreground'

export const ROSTER_HEADER_LEFT_CLASS = 'flex items-center gap-2'

export const ROSTER_SUBHEADER_CLASS =
  'border-b border-divider bg-black/[0.04] px-3 py-1.5 text-[13px] font-medium text-foreground truncate'

export const ROSTER_ITEMS_CLASS = 'min-h-0 flex-1 overflow-y-auto py-2 scrollbar-hide'

export const ROSTER_EMPTY_CLASS = 'px-4 py-8 text-center text-[13px] text-muted-foreground'

export const ROSTER_ITEM_BASE_CLASS =
  'group relative flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors'

export const ROSTER_ITEM_ACTIVE_CLASS = 'bg-black/[0.06] text-foreground'

export const ROSTER_ITEM_IDLE_CLASS = 'text-muted-foreground hover:bg-black/[0.03] hover:text-foreground'

export const ROSTER_ITEM_LEFT_CLASS = 'flex min-w-0 flex-1 items-center gap-2'

/** `status-success`, not a raw palette green — the rest of the app reads pass state from tokens. */
export const ROSTER_ONLINE_DOT_CLASS = 'inline-block h-2 w-2 shrink-0 rounded-full bg-status-success'

export const ROSTER_ITEM_NAME_CLASS = 'truncate text-[13px] leading-tight text-foreground'
