import type { ViewMode } from './ViewModeToggle.types'

/**
 * Same black-boxes-with-hairline-gaps language as `AppHeader`'s own chips
 * (`APP_HEADER_CHIP_CLASS`), but deliberately larger — `h-8`/`text-[14px]`
 * against the chips' `h-6`/`text-[12px]` — since this is the page-level Slides/
 * Practice switch, not a secondary action, and it needs to read as the more
 * prominent control of the two. Modelled on itustudent.itu.dk's own nav tabs:
 * the active tab inverts to a white fill with black text.
 */
export const TOGGLE_CLASS = 'inline-flex h-8 shrink-0 items-stretch gap-[2px]'

// Layout only — no bg-*/text-* here. Active and idle each own a complete,
// mutually-exclusive color pair below; mixing a base color with an override
// pair let same-specificity Tailwind utilities (bg-foreground vs bg-background)
// collide, and the generated stylesheet's fixed order — not class order —
// picked the winner, so the "active" pair silently lost.
export const TOGGLE_BUTTON_CLASS =
  'flex h-8 shrink-0 cursor-pointer items-center justify-center px-5 text-[14px] font-medium leading-none transition-colors'

export const TOGGLE_BUTTON_ACTIVE_CLASS = 'bg-background text-foreground font-semibold'

export const TOGGLE_BUTTON_IDLE_CLASS = 'bg-foreground text-background hover:bg-background hover:text-foreground'

export const TOGGLE_LABEL: Record<ViewMode, string> = {
  slides: 'Slides',
  practice: 'Practice',
}
