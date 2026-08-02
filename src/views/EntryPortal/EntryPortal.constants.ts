export const ENTRY_PORTAL_SCREEN_CLASS =
  'relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground'

/**
 * Takes the atrium band out of flow so it reads as a backsplash behind the
 * page rather than a block that pushes content down — which is what lets the
 * card overlap it.
 */
export const ENTRY_PORTAL_BACKDROP_CLASS = 'absolute inset-x-0 top-0'

/**
 * The same treatment `MODAL_OVERLAY_CLASS` puts behind a dialog, minus the
 * `fixed` positioning and the click target. Sits at `z-[1]`, which puts it
 * above the atrium photo (so the photo blurs) but below the header bar
 * (`z-20`) and the card (`z-10`), both of which stay crisp.
 */
export const ENTRY_PORTAL_SCRIM_CLASS = 'absolute inset-0 z-[1] bg-black/50 backdrop-blur-[2px]'

/** Centres the card in the viewport, the way the Modal overlay centres a dialog. */
export const ENTRY_PORTAL_CENTER_CLASS =
  'relative z-10 flex flex-1 items-center justify-center p-5'

/**
 * Borrows the Modal's card chrome (radius, border, background) but not its
 * proportions: narrower than a `lg` dialog, and a deeper bottom pad, since
 * nothing sits under the buttons the way a Close button does in a modal.
 */
export const ENTRY_PORTAL_CARD_CLASS =
  'w-full max-w-[560px] max-h-[85vh] overflow-y-auto rounded-[10px] border border-border bg-background p-[22px] pb-10 text-center'

export const ENTRY_PORTAL_TITLE_CLASS = 'text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl'

/**
 * Body copy. Shares `max-w-md` and `mx-auto` with the name row, so its left
 * edge lines up with the input's — hence `text-left` against the card's
 * `text-center`.
 */
export const ENTRY_PORTAL_BODY_CLASS =
  'mx-auto mt-6 max-w-md text-left text-sm leading-relaxed text-foreground/70'

export const ENTRY_PORTAL_NAME_ROW_CLASS = 'mx-auto mt-10 flex w-full max-w-md items-center justify-center'

export const ENTRY_PORTAL_NAME_INPUT_CLASS =
  'w-full rounded-md border border-border bg-black/[0.03] px-6 py-3 text-left text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-black/30 focus:bg-black/[0.06]'

export const ENTRY_PORTAL_CTA_ROW_CLASS = 'mt-12 flex flex-col-reverse items-center justify-center gap-4 sm:flex-row'

export const ENTRY_PORTAL_SOLO_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md border border-border bg-black/[0.03] px-6 py-3 text-sm font-medium text-secondary-foreground transition hover:border-black/30 hover:bg-black/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_JOIN_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-foreground/40 disabled:border disabled:border-border'

export const ENTRY_PORTAL_JOIN_BTN_CODE_CLASS =
  'rounded bg-black/20 px-2 py-0.5 text-xs font-semibold tracking-wider'

export const ENTRY_PORTAL_NO_SESSION_ROW_CLASS =
  'inline-flex items-center gap-3 rounded-md border border-border bg-black/[0.03] px-6 py-3 text-sm font-medium text-foreground/40'

export const ENTRY_PORTAL_REFRESH_BTN_CLASS =
  'inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground/50 transition hover:bg-black/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_NO_SESSION_LABEL = 'No current active session to join'

export const ENTRY_PORTAL_CHECKING_LABEL = 'Checking for a session…'

export const ENTRY_PORTAL_TITLE = 'BootCode'

export const ENTRY_PORTAL_INTRO =
  'Enter your name in the field below. You can either start a solo session or, if you are in class, '
  + 'refresh this page when your teacher has made a classroom to join. Be sure to check that your '
  + 'session codes match.'

export const ENTRY_PORTAL_NAME_PLACEHOLDER = 'Type your nickname here'