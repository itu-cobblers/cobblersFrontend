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

/**
 * The raised folder tab: bordered on three sides, sitting over the row's rule.
 *
 * `bg-terminal` — the editor's own surface, not the row's — so the tab reads as
 * the front face of the pane it opens onto and the two join with no step. It is
 * therefore *darker* than the rail and than the idle tabs beside it, which is
 * VS Code's behaviour and the opposite of the assignment panel's rail, where
 * `PANEL_TAB_ACTIVE_CLASS` is `bg-card` and sits lighter. Both follow the same
 * rule — the active tab takes the colour of the surface behind it — and the two
 * rails diverge because the surfaces do.
 *
 * Still opaque, so it covers the 1px of the row's rule it overlaps. Invisible in
 * light: `--terminal` and `--background` are both pure white there.
 */
export const FILE_TAB_ACTIVE_CLASS =
  '-mb-px border border-b-0 border-divider bg-terminal text-foreground'

export const FILE_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'