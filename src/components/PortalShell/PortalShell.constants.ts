/**
 * The full-page chrome shared by every pre-workspace screen: student entry,
 * teacher gate, session creation. Atrium band, dimmed page, one centred card,
 * ITU footer. Only the card's contents differ between them.
 */
export const PORTAL_SCREEN_CLASS =
  'relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground'

/**
 * Takes the atrium band out of flow so it reads as a backsplash behind the
 * page rather than a block that pushes content down — which is what lets the
 * card overlap it.
 */
export const PORTAL_BACKDROP_CLASS = 'absolute inset-x-0 top-0'

/**
 * The same treatment MODAL_OVERLAY_CLASS puts behind a dialog, minus the
 * `fixed` positioning and the click target. Sits at `z-[1]`, which puts it
 * above the atrium photo (so the photo blurs) but below the header bar
 * (`z-20`) and the card (`z-10`), both of which stay crisp.
 */
export const PORTAL_SCRIM_CLASS = 'absolute inset-0 z-[1] bg-black/50 backdrop-blur-[2px]'

/** Centres the card in the viewport, the way the Modal overlay centres a dialog. */
export const PORTAL_CENTER_CLASS = 'relative z-10 flex flex-1 items-center justify-center p-5'

/**
 * Borrows the Modal's card chrome (radius, border, background) but not its
 * proportions: narrower than a `lg` dialog, and a deeper bottom pad, since
 * nothing sits under the buttons the way a Close button does in a modal.
 */
export const PORTAL_CARD_CLASS =
  'w-full max-w-[560px] max-h-[85vh] overflow-y-auto rounded-[10px] bg-background p-[22px] pb-10 text-center'

/** Section heading inside a card — for screens that don't warrant the hero title. */
export const PORTAL_HEADING_CLASS = 'text-2xl font-light tracking-tight text-foreground'

/**
 * Every input and select on a portal card. Button-shaped, matching the CTA row
 * beneath it — the gate and the creator had each grown their own field styling.
 */
export const PORTAL_FIELD_CLASS =
  'w-full rounded-md border border-border bg-black/[0.03] px-6 py-3 text-left text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-black/30 focus:bg-black/[0.06]'

export const PORTAL_FIELD_ROW_CLASS = 'mx-auto mt-10 flex w-full max-w-md flex-col gap-2 text-left'
