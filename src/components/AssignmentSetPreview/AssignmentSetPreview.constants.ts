import type { AssignmentKind } from '@types'

export const PREVIEW_WRAP_CLASS = 'flex flex-col gap-4'

export const PREVIEW_TITLE_CLASS = 'text-[15px] font-bold text-ink'

export const PREVIEW_GROUP_CLASS = 'flex flex-col gap-1.5'

export const PREVIEW_DAY_HEADER_CLASS =
  'text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted'

export const PREVIEW_LIST_CLASS = 'flex flex-col gap-1'

export const PREVIEW_ITEM_CLASS = 'group rounded-md border border-line bg-surface'

export const PREVIEW_SUMMARY_CLASS =
  'flex cursor-pointer list-none items-center gap-2.5 px-3 py-2 [&::-webkit-details-marker]:hidden'

export const PREVIEW_CARET_CLASS =
  'shrink-0 text-[10px] text-ink-muted transition-transform group-open:rotate-90'

export const PREVIEW_TITLE_ROW_CLASS = 'min-w-0 flex-1 truncate text-[13px] text-ink'

export const PREVIEW_KIND_CLASS =
  'shrink-0 rounded border border-line px-1.5 py-[1px] text-[10px] uppercase tracking-[0.5px] text-ink-muted'

export const PREVIEW_DETAIL_CLASS =
  'flex flex-col gap-2 border-t border-line px-3 py-2.5'

export const PREVIEW_DESC_CLASS = 'text-[12px] leading-relaxed text-ink-muted'

export const PREVIEW_HINT_CLASS = 'text-[12px] leading-relaxed text-accent'

export const KIND_LABEL: Record<AssignmentKind, string> = {
  code: 'Code',
  predict: 'Predict',
  project: 'Project',
}
