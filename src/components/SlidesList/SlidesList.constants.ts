// Same rail language as `ProblemsList` — width/collapse classes are imported
// directly from `ProblemsList.constants` in the component (same pattern
// `TeacherProblemsList` already uses) so the two rails can't drift apart.
export const SLIDES_LIST_CLASS_BASE = 'flex h-full shrink-0 flex-col overflow-hidden bg-card transition-all duration-200 ease-out'

export const SLIDES_LIST_CARD_BODY_CLASS =
  'flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-md border-x border-b border-divider'

export const SLIDES_LIST_HEADER_CLASS =
  'flex h-10 shrink-0 items-center gap-2 border border-divider bg-card px-3 text-sm text-foreground'

export const SLIDES_LIST_ITEMS_CLASS = 'min-h-0 flex-1 overflow-y-auto scrollbar-hide py-2'

export const SLIDES_LIST_ITEM_BASE_CLASS =
  'flex h-12 w-full items-center gap-2.5 px-3 text-left text-sm transition-colors'

export const SLIDES_LIST_ITEM_ACTIVE_CLASS = 'bg-muted text-foreground'

export const SLIDES_LIST_ITEM_IDLE_CLASS = 'text-muted-foreground hover:bg-black/[0.03] hover:text-foreground'

export const SLIDES_LIST_ITEM_META_CLASS = 'text-[11px] font-mono text-foreground/40'

/**
 * Circular page-number chip — same shape/sizing convention as `StatusBadge`
 * (`SIZE_CLASSES.s`), rendered outside the `isOpen` gate so a collapsed rail
 * still shows which page is which, not just a blank highlighted button.
 */
export const SLIDES_LIST_ITEM_BADGE_CLASS = 'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-mono text-[10px]'

export const SLIDES_LIST_ITEM_BADGE_IDLE_CLASS = 'bg-foreground/15 text-muted-foreground'

/** Teacher is broadcasting focus on this page — same accent used by `LIST_ITEM_LIVE_CLASS`/the Focus button. */
export const SLIDES_LIST_ITEM_BADGE_LIVE_CLASS = 'bg-accent/20 text-accent'

export const SLIDES_LIST_ITEM_TITLE_CLASS = 'mt-0.5 truncate text-[13px] leading-tight'

/** Footer Focus toggle — teacher-only, same visual language as `TeacherAssignmentPanel`'s Focus button. */
export const SLIDES_LIST_FOOTER_CLASS = 'border-t border-divider p-2'

export const SLIDES_LIST_FOCUS_BUTTON_CLASS =
  'flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors'

export const SLIDES_LIST_FOCUS_BUTTON_ACTIVE_CLASS = 'bg-accent/20 text-accent border border-accent/40'

export const SLIDES_LIST_FOCUS_BUTTON_IDLE_CLASS = 'bg-accent text-accent-foreground hover:brightness-110'
