/**
 * The ITU page footer: a 36px grey band with the university's address on the
 * left and its name in a solid black box on the right — the same box treatment
 * the header lockup and action strip use.
 *
 * Shortened from 60px when AppColophon was added beneath it, so the two bands
 * together still occupy the 60px the footer alone used to.
 */
export const APP_FOOTER_CLASS =
  'relative z-10 flex h-9 w-full shrink-0 items-center justify-between gap-6 bg-black/80 px-8'

export const APP_FOOTER_ADDRESS_CLASS = 'min-w-0 truncate text-[12px] text-brand-ink/80'

export const APP_FOOTER_BRAND_CLASS =
  'flex h-7 shrink-0 items-center bg-brand-surface px-3 text-[12px] uppercase tracking-[0.02em] text-brand-ink'

export const APP_FOOTER_ADDRESS =
  'IT-Universitetet i København • Rued Langgaards Vej 7 • 2300 København S • Danmark'

/** Uppercased in CSS rather than in the string, so it isn't spelled out letter by letter. */
export const APP_FOOTER_BRAND = 'IT University of Copenhagen'
