import type { JoinMode } from './StudentEntry.types'

export const ENTRY_SCREEN_CLASS =
  'flex h-screen flex-col items-center justify-center gap-6 bg-roast px-4 text-milk'

export const ENTRY_CARD_CLASS =
  'flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-oak bg-night p-7 shadow-xl'

export const ENTRY_TITLE_CLASS = 'text-[22px] font-bold text-milk'

export const ENTRY_SUBTITLE_CLASS = 'text-[13px] leading-relaxed text-foam'

export const ENTRY_FIELD_LABEL_CLASS = 'text-[11px] font-semibold uppercase tracking-[0.08em] text-foam'

export const ENTRY_FIELD_CLASS = 'flex flex-col gap-1.5'

export const ENTRY_TOGGLE_CLASS = 'flex gap-1 rounded-lg border border-oak bg-roast p-1'

export const ENTRY_TOGGLE_BTN_BASE_CLASS =
  'flex-1 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors'

export const ENTRY_TOGGLE_BTN_ACTIVE_CLASS = 'bg-caramel text-night'

export const ENTRY_TOGGLE_BTN_IDLE_CLASS = 'text-foam hover:text-milk'

export const ENTRY_HINT_CLASS = 'text-[12px] leading-relaxed text-foam'

export const ENTRY_TOGGLE_LABELS: Record<JoinMode, string> = {
  join: 'Join a class',
  solo: 'Solo practice',
}

export const SOLO_MODE_HINT =
  "Solo practice is for when you can't join a class on site — work through the assignments at your own pace."
