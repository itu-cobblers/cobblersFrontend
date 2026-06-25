import type { BadgeTone } from './Badge.types'

const DIFFICULTY_BASE = 'text-[10px] font-semibold uppercase tracking-[0.5px]'

export const BADGE_TONE_CLASS: Record<BadgeTone, string> = {
  lang: 'rounded border border-caramel/40 bg-caramel/15 px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.6px] text-caramel',
  easy: `${DIFFICULTY_BASE} text-mint`,
  medium: `${DIFFICULTY_BASE} text-honey`,
  hard: `${DIFFICULTY_BASE} text-berry`,
}
