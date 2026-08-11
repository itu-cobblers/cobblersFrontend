export const VIEWER_CLASS = 'flex min-w-0 flex-1 flex-col overflow-hidden bg-card'

// react-pdf's <Document> renders a plain, unclassed wrapper div — without its
// own flex sizing it grows to fit the full-size page and pushes the footer
// below the viewport instead of sharing height with it.
export const VIEWER_DOCUMENT_CLASS = 'flex min-h-0 flex-1 flex-col overflow-hidden'

export const VIEWER_SCROLL_CLASS = 'flex w-full flex-1 flex-col items-center justify-center overflow-y-auto'

// No fixed width — sized by `useFitPageWidth` so the page fits both the
// available width and height at once; the wrapper shrinks to that width.
export const VIEWER_PAGE_WRAPPER_CLASS = 'relative'

export const VIEWER_LOADING_CLASS = 'flex flex-1 items-center justify-center text-sm text-muted-foreground'

// ── live/focus control — sits in the footer, right of "Try this now" ───────

export const VIEWER_FOCUS_BUTTON_CLASS =
  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors'

export const VIEWER_FOCUS_BUTTON_ACTIVE_CLASS = 'bg-accent/20 text-accent border border-accent/40'

export const VIEWER_FOCUS_BUTTON_IDLE_CLASS = 'bg-accent text-accent-foreground hover:brightness-110'

export const VIEWER_LIVE_BADGE_CLASS =
  'inline-flex items-center gap-1 rounded-md bg-accent/20 px-3 py-1.5 text-xs font-semibold text-accent shadow-sm'

// ── page-thumbnail strip — toggled open from the footer's expand button ────

export const VIEWER_THUMBNAILS_CLASS = 'flex shrink-0 gap-2 overflow-x-auto border-t border-divider bg-card px-3 py-2'

export const VIEWER_THUMBNAIL_BUTTON_CLASS =
  'flex shrink-0 flex-col items-center gap-1 rounded-md p-1 transition-colors hover:bg-black/[0.05]'

export const VIEWER_THUMBNAIL_BUTTON_ACTIVE_CLASS = 'ring-2 ring-primary'

export const VIEWER_THUMBNAIL_LABEL_CLASS = 'font-mono text-[10px] text-muted-foreground'

// ── footer — expand (left) · pager (center) · go-to + follow (right) ──────

export const VIEWER_FOOTER_CLASS = 'grid shrink-0 grid-cols-3 items-center gap-2 border-t border-divider bg-card px-4 py-2.5'

export const VIEWER_FOOTER_LEFT_CLASS = 'flex items-center justify-self-start'

export const VIEWER_FOOTER_EXPAND_BUTTON_CLASS =
  'flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-black/[0.05]'

export const VIEWER_FOOTER_EXPAND_ICON_CLASS = 'transition-transform'

export const VIEWER_FOOTER_PAGER_CLASS = 'flex items-center gap-2 justify-self-center'

export const VIEWER_FOOTER_BUTTON_CLASS =
  'flex h-8 w-8 items-center justify-center rounded-md text-xl font-semibold text-foreground transition-colors hover:bg-black/[0.05] disabled:opacity-30 disabled:hover:bg-transparent'

export const VIEWER_FOOTER_COUNTER_CLASS = 'font-mono text-[13px] text-muted-foreground'

export const VIEWER_FOOTER_RIGHT_CLASS = 'flex min-w-0 items-center justify-end gap-3 justify-self-end'

export const VIEWER_FOOTER_GOTO_BUTTON_CLASS =
  'shrink-0 rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-600'

export const VIEWER_FOOTER_FOLLOW_CLASS = 'flex min-w-0 items-center gap-2 text-xs text-accent'

export const VIEWER_FOOTER_FOLLOW_DOT_CLASS = 'h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent'

export const VIEWER_FOOTER_FOLLOW_LABEL_CLASS = 'min-w-0 truncate'

export const VIEWER_FOOTER_FOLLOW_BUTTON_CLASS =
  'shrink-0 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground transition hover:brightness-110'
