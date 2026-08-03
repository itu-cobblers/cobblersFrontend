/**
 * Active/hover washes are `bg-black/…` to match `LIST_ITEM_ACTIVE_CLASS` on
 * the assignment rail. They were `bg-white/…` — invisible on a white panel,
 * which made clicking a row look like it did nothing.
 */
export const SUBMISSION_ROW_ACTIVE_CLASS =
    'flex items-center justify-between gap-3 px-4 py-3 text-left text-sm cursor-pointer bg-black/[0.06]'

export const SUBMISSION_ROW_IDLE_CLASS = '' +
    'flex items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-black/[0.03] cursor-pointer bg-transparent'

export const SUBMISSION_BADGE_PASSED_CLASS =
    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500'

export const SUBMISSION_BADGE_FAILED_CLASS =
    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500'

export const SUBMISSION_TITLE_CLASS = 'text-sm font-medium text-foreground'

export const SUBMISSION_META_CLASS = 'text-[11px] text-muted-foreground'

