/**
 * The thin credit band at the very bottom of a workspace. Deliberately the
 * smallest chrome in the app — it costs the editor 24px of height, so it earns
 * that by staying a single line.
 *
 * `z-10` to clear PortalShell's scrim, which sits at `z-[1]` and would
 * otherwise dim this band along with the page behind it.
 */
export const COLOPHON_CLASS =
  'relative z-10 flex h-6 w-full shrink-0 items-center justify-center gap-2 bg-brand-surface px-3 text-[10px] text-brand-ink/60'

export const COLOPHON_LINK_CLASS =
  'truncate underline-offset-2 transition-colors hover:text-brand-ink hover:underline'

/** Decorative separator — hidden from screen readers so it isn't read as "middle dot". */
export const COLOPHON_SEPARATOR = '·'

export const COLOPHON_ORG_URL = 'https://github.com/itu-cobblers'

export const COLOPHON_LINK_LABEL = 'github.com/itu-cobblers'

export const COLOPHON_CREDIT_PREFIX = 'Built by the cobblers —'

export const COLOPHON_CREDIT_SUFFIX = '© 2026. All rights reserved.'

export const COLOPHON_TEAM: { name: string; url: string }[] = [
  { name: 'Ai Ting Lee', url: 'https://github.com/AitingLee' },
  { name: 'Ymir Arnarson', url: 'https://github.com/ymarymar' },
  { name: 'Amanda Cunha', url: 'https://github.com/alimacunha' },
]
