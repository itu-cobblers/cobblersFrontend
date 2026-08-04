export const ENTRY_PORTAL_TITLE_CLASS = 'text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl'

/**
 * Body copy. Shares `max-w-md` and `mx-auto` with the name row, so its left
 * edge lines up with the input's — hence `text-left` against the card's
 * `text-center`.
 */
export const ENTRY_PORTAL_BODY_CLASS =
  'mx-auto mt-6 max-w-md text-left text-sm leading-relaxed text-foreground/70'

export const ENTRY_PORTAL_NAME_ROW_CLASS = 'mx-auto mt-10 flex w-full max-w-md items-center justify-center'

export { PORTAL_FIELD_CLASS as ENTRY_PORTAL_NAME_INPUT_CLASS } from '@components/PortalShell/PortalShell.constants'

export const ENTRY_PORTAL_CTA_ROW_CLASS = 'mt-12 flex flex-col-reverse items-center justify-center gap-4 sm:flex-row'

export const ENTRY_PORTAL_SOLO_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md border border-border bg-wash-hover px-6 py-3 text-sm font-medium text-secondary-foreground transition hover:border-wash-line hover:bg-wash-panel hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_JOIN_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-wash-hover disabled:text-foreground/40 disabled:border disabled:border-border'

export const ENTRY_PORTAL_JOIN_BTN_CODE_CLASS =
  'rounded bg-wash-strong px-2 py-0.5 text-xs font-semibold tracking-wider'

export const ENTRY_PORTAL_NO_SESSION_ROW_CLASS =
  'inline-flex items-center gap-3 rounded-md border border-border bg-wash-hover px-6 py-3 text-sm font-medium text-foreground/40'

export const ENTRY_PORTAL_REFRESH_BTN_CLASS =
  'inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground/50 transition hover:bg-wash-panel hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_NO_SESSION_LABEL = 'No current active session to join'

export const ENTRY_PORTAL_CHECKING_LABEL = 'Checking for a session…'

export const ENTRY_PORTAL_TITLE = 'BootCode'

export const ENTRY_PORTAL_INTRO =
  'Enter your name in the field below. You can either start a solo session or, if you are in class, '
  + 'refresh this page when your teacher has made a classroom to join. Be sure to check that your '
  + 'session codes match.'

export const ENTRY_PORTAL_NAME_PLACEHOLDER = 'Type your nickname here'