/**
 * The tab strip doubles as the editor's action rail: file tabs on the left,
 * Show Answer / Submit on the right.
 *
 * The divider runs along the row's bottom edge and the active tab breaks it —
 * a manila-folder seam. That needs three things to line up: the row draws
 * `border-b`, the tab is pulled down `-mb-px` over it, and the tab's own opaque
 * background covers the 1px it overlaps. Children paint above a parent's
 * border, which is what makes the break work. Don't add `overflow-hidden` to
 * the list — it clips exactly that overlap and the seam closes up.
 */
export const FILE_TABS_ROW_CLASS =
  'flex h-10 shrink-0 items-stretch justify-between gap-2 border-b border-divider bg-background pl-2'

export const FILE_TABS_LIST_CLASS = 'flex items-stretch gap-1'

export const FILE_TAB_BASE_CLASS =
  'relative flex items-center gap-1.5 rounded-t-md px-3 font-mono text-[13px] transition-colors'

/** The raised folder tab: bordered on three sides, sitting over the row's rule. */
export const FILE_TAB_ACTIVE_CLASS =
  '-mb-px border border-b-0 border-divider bg-background text-foreground'

export const FILE_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'