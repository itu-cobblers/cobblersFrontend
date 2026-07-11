import type { RosterStatus } from './StudentRoster.types'

export const ROSTER_WRAP_CLASS = 'flex flex-col gap-2.5'

export const ROSTER_EMPTY_CLASS = 'text-[12px] leading-relaxed text-foam'

export const ROSTER_ITEM_CLASS =
  'flex flex-col gap-2 rounded-lg border border-oak bg-night p-3.5'

export const ROSTER_ITEM_HEADER_CLASS = 'flex items-center justify-between gap-2'

export const ROSTER_NAME_CLASS = 'text-[14px] font-semibold text-milk'

export const ROSTER_META_CLASS = 'flex items-center justify-between gap-2 text-[12px] text-foam'

export const ROSTER_CURRENT_CLASS = 'min-w-0 truncate'

export const ROSTER_PROGRESS_CLASS = 'shrink-0'

export const ROSTER_PILL_BASE_CLASS =
  'shrink-0 rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.5px]'

export const ROSTER_PILL_TONE_CLASS: Record<RosterStatus, string> = {
  working: 'bg-caramel/20 text-caramel',
  stuck: 'bg-berry/20 text-berry',
  done: 'bg-mint/20 text-mint',
}

export const ROSTER_PILL_LABEL: Record<RosterStatus, string> = {
  working: 'Working',
  stuck: 'Stuck',
  done: 'Done',
}
