import type { AppHeaderVariant } from './AppHeader.types'

/**
 * Modelled on itustudent.itu.dk: a photo band with a translucent black bar
 * across the top of it carrying the logo lockup. Two sizes — the `hero` band
 * on the entry portal, where the photo below the bar stays clear, and the
 * `bar` strip used as app chrome, which is the bar alone over the top slice
 * of the same photo.
 */

/**
 * The photo band — a backsplash pinned to the top of the page.
 *
 * Deliberately carries no `z-index`: that would open a stacking context and
 * trap the bar below any page-level scrim. The band's layers instead take
 * part in the page's stacking order — photo unpositioned (so a scrim can sit
 * over and blur it), bar at `z-20` (so it can't be).
 */
export const APP_HEADER_CLASS = 'relative w-full shrink-0 overflow-hidden bg-foreground'

/** `bar` matches the 40px row height the rails and toolbar already use. */
export const APP_HEADER_BAND_CLASS: Record<AppHeaderVariant, string> = {
  hero: 'h-[261px]',
  bar: 'h-10',
}

/**
 * `object-top` is what makes the `bar` variant read as the top slice of the
 * atrium rather than a squashed copy of the whole photo.
 */
export const APP_HEADER_IMAGE_CLASS = 'absolute inset-0 h-full w-full object-cover object-top'

/** The translucent bar, `rgba(0,0,0,.7)` as on the ITU site. */
export const APP_HEADER_BAR_CLASS =
  'absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-6 bg-black/70'

export const APP_HEADER_BAR_SIZE_CLASS: Record<AppHeaderVariant, string> = {
  hero: 'h-[74px] px-8',
  bar: 'h-full px-3',
}

export const APP_HEADER_BRAND_ROW_CLASS = 'flex min-w-0 items-center gap-3'

/**
 * Two genuinely separate boxes reading "ITU | BootIT", as on the ITU lockup —
 * the divider is a 2px gap that the bar shows through, not a drawn line. The
 * fill therefore belongs on each box, never on this container.
 */
export const APP_HEADER_BRAND_CLASS = 'inline-flex shrink-0 gap-[2px]'

export const APP_HEADER_BRAND_BOX_CLASS =
  'flex items-center bg-foreground uppercase leading-none tracking-tight text-background'

/** `hero` matches the 236x40 lockup the ITU header ships; `bar` fits inside 40px. */
export const APP_HEADER_BRAND_BOX_SIZE_CLASS: Record<AppHeaderVariant, string> = {
  hero: 'h-10 px-5 text-[22px]',
  bar: 'h-6 px-2.5 text-[13px]',
}

/** Only the institution half is bold, as on the ITU lockup. */
export const APP_HEADER_BRAND_PREFIX_CLASS = 'font-bold'

export const APP_HEADER_BRAND_NAME_CLASS = 'font-normal'

export const APP_HEADER_SECTION_CLASS =
  'flex min-w-0 items-center gap-3 text-[13px] font-medium text-background'

export const APP_HEADER_SEPARATOR_CLASS = 'text-background/40'

export const APP_HEADER_SECTION_NAME_CLASS = 'truncate'

/** The right-hand action strip. */
export const APP_HEADER_NAV_CLASS = 'flex min-w-0 shrink items-center gap-[2px]'

/**
 * The action strip, after the ITU Student nav: a row of solid black boxes with
 * white text, square corners and hairline gaps — the same language as the
 * lockup, so the two ends of the bar read as one system.
 */
export const APP_HEADER_CHIP_CLASS =
  'flex h-6 shrink-0 items-center gap-1.5 bg-foreground px-2.5 text-[12px] leading-none text-background'

/**
 * Only the interactive box reacts to the pointer — the identity boxes are
 * labels wearing the same shape, and shouldn't imply they can be clicked.
 * Hover inverts, the way the ITU nav marks its active tab.
 */
export const APP_HEADER_ACTION_CLASS =
  'cursor-pointer transition-colors hover:bg-background hover:text-foreground'

export const APP_HEADER_SESSION_NAME_CLASS = 'min-w-0'

export const APP_HEADER_SESSION_NAME_STRONG_CLASS = 'truncate font-semibold'

export const APP_HEADER_BRAND_PREFIX = 'ITU'

export const APP_HEADER_BRAND_NAME = 'BootIT'
