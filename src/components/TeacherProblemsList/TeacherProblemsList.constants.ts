// Classnames used only by TeacherProblemsList — shared list chrome
// (LIST_CLASS_BASE, LIST_HEADER_CLASS, LIST_ITEM_*, KIND_LABEL, …) still
// comes from @components/ProblemsList/ProblemsList.constants.

export const ROOM_CODE_SECTION_CLASS = 'flex flex-col gap-1 border-b border-border p-4 bg-card'

export const ROOM_CODE_LABEL_CLASS = 'text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground'

export const ROOM_CODE_VALUE_CLASS = 'font-mono text-3xl font-extrabold tracking-widest text-accent'

// Timer, as a fixed action section at the foot of the rail — always visible,
// not a menu the teacher has to open. Collapses to a bare icon with the list.
export const TIMER_SECTION_CLASS = 'mt-auto flex flex-col gap-2 border-t border-border bg-card p-3'

export const TIMER_SECTION_COLLAPSED_CLASS = 'mt-auto flex items-center justify-center border-t border-border bg-card py-3'

export const TIMER_LABEL_ROW_CLASS = 'flex items-center justify-between gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'

export const TIMER_LABEL_CLASS = 'flex items-center gap-1.5'

export const TIMER_ENDS_BADGE_CLASS =
  'inline-flex items-center rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal text-emerald-600'

export const TIMER_INPUT_ROW_CLASS = 'flex items-center gap-2'

export const TIMER_INPUT_CLASS =
  'h-8 w-16 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring'

export const TIMER_UNIT_LABEL_CLASS = 'text-xs text-muted-foreground'

export const TIMER_START_CLASS =
  'ml-auto flex h-8 shrink-0 cursor-pointer items-center rounded-md bg-foreground px-3 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'

export const TIMER_ERROR_CLASS = 'text-xs text-destructive'

// Row 1 of an item: kind badge on the left, pass-count + live badge grouped
// together on the right — kept on one baseline (no stacking) so it lines up
// evenly with the badge on the opposite side.
export const ITEM_CONTENT_CLASS = 'min-w-0 flex-1'

export const ITEM_META_ROW_CLASS = 'flex items-center justify-between gap-1.5 text-[11px] font-mono text-foreground/40'

export const ITEM_STATS_GROUP_CLASS = 'flex items-center gap-1.5'

export const ITEM_PASSED_COUNT_CLASS = 'font-mono text-[10px] font-semibold text-status-success'

export const ITEM_LIVE_BADGE_CLASS = 'rounded-md bg-accent px-2 text-[9px] uppercase leading-4 tracking-widest text-white'

// Shown instead of the pass/fail dot when no per-student status applies yet.
export const ITEM_NUMBER_BADGE_CLASS =
  'mt-0.5 inline-flex h-4 w-4 items-center justify-center font-mono text-[11px] text-foreground/40'

export const FOOTER_CLASS = 'mt-auto flex items-stretch border-t border-border'

export const FOOTER_BUTTON_CLASS =
  'flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50'

/** The teacher rail has no tab row, so its outline is a plain card. */
export const TEACHER_LIST_CARD_CLASS = 'rounded-md border border-divider'
