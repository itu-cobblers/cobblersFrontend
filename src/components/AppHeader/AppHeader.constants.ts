/**
 * Modelled on itustudent.itu.dk: a 261px photo band, with a 74px translucent
 * black bar across the top of it carrying the logo lockup and the nav tabs.
 * The photo below that bar stays clear — the bar is not a full-band scrim.
 */

/**
 * The photo band — a backsplash pinned to the top of the page.
 *
 * Deliberately carries no `z-index`: that would open a stacking context and
 * trap the bar below any page-level scrim. The band's layers instead take
 * part in the page's stacking order — photo unpositioned (so a scrim can sit
 * over and blur it), bar at `z-20` (so it can't be).
 */
export const APP_HEADER_CLASS = 'relative h-[261px] w-full shrink-0 overflow-hidden bg-foreground'

export const APP_HEADER_IMAGE_CLASS = 'absolute inset-0 h-full w-full object-cover'

/** The translucent bar: only the top 74px, `rgba(0,0,0,.7)` as on the ITU site. */
export const APP_HEADER_BAR_CLASS =
  'absolute inset-x-0 top-0 z-20 flex h-[74px] items-center justify-between gap-6 bg-black/70 px-8'

/**
 * Two solid boxes reading "ITU | BootIT". `divide-x` draws the hairline
 * between them the way the ITU lockup does, rather than a gap.
 */
export const APP_HEADER_BRAND_CLASS =
  'inline-flex shrink-0 divide-x divide-background/70 bg-foreground text-background'

/** ~40px tall, matching the 236x40 lockup the ITU header ships. */
export const APP_HEADER_BRAND_BOX_CLASS =
  'flex h-10 items-center px-5 text-[22px] uppercase leading-none tracking-tight'

/** Only the institution half is bold, as on the ITU lockup. */
export const APP_HEADER_BRAND_PREFIX_CLASS = 'font-bold'

export const APP_HEADER_BRAND_NAME_CLASS = 'font-normal'

/** The right-hand tab strip. Empty until the nav buttons land. */
export const APP_HEADER_NAV_CLASS = 'flex shrink-0 items-center gap-px'

export const APP_HEADER_BRAND_PREFIX = 'ITU'

export const APP_HEADER_BRAND_NAME = 'BootIT'
