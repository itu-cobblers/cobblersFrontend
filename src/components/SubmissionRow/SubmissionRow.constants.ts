/**
 * Active/hover washes use the shared wash scale, matching
 * `LIST_ITEM_ACTIVE_CLASS` on the assignment rail. They were once literal
 * `bg-white/…` — invisible on a white panel, which made clicking a row look
 * like it did nothing. The tokens are what stop that recurring per theme.
 */
export const SUBMISSION_ROW_ACTIVE_CLASS =
    'flex items-center justify-between gap-3 px-4 py-3 text-left text-sm cursor-pointer bg-wash-active'

export const SUBMISSION_ROW_IDLE_CLASS = '' +
    'flex items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-wash-hover cursor-pointer bg-transparent'

export const SUBMISSION_TITLE_CLASS = 'text-sm font-medium text-foreground'

export const SUBMISSION_META_CLASS = 'text-[11px] text-muted-foreground'

