import { BUTTON_HEIGHT_CLASS } from '@components/Button/Button.constants'

/**
 * VS Code's split run control: a play button with a chevron beside it that
 * opens the list of actions. The two halves share one shell with a hairline
 * between them, the way the header lockup does.
 *
 * Black in both themes — it belongs to the same brand chrome as the header and
 * the credit band, not to the CTA colour that inverts.
 */
export const RUN_MENU_WRAPPER_CLASS = 'relative shrink-0'

export const RUN_MENU_SHELL_CLASS =
  'inline-flex items-stretch gap-px overflow-hidden rounded-md bg-brand-surface text-brand-ink'

export const RUN_MENU_PLAY_CLASS =
  `flex ${BUTTON_HEIGHT_CLASS} w-10 cursor-pointer items-center justify-center bg-brand-surface transition-colors enabled:hover:bg-brand-surface-hover disabled:cursor-not-allowed`

export const RUN_MENU_CHEVRON_CLASS =
  `flex ${BUTTON_HEIGHT_CLASS} w-7 cursor-pointer items-center justify-center bg-brand-surface transition-colors hover:bg-brand-surface-hover`

/**
 * Anchored right so it can't run off the edge of the rail. Black on white,
 * matching the button it drops out of — so no grey outline, which would read
 * as a seam around a solid block.
 */
export const RUN_MENU_LIST_CLASS =
  'absolute right-0 top-full z-30 mt-1 min-w-[160px] overflow-hidden rounded-md bg-brand-surface py-1'

/**
 * Brand-surface, so it stays black in both themes — which means its hover must
 * be `--brand-ink` rather than a wash. A wash is keyed to the page, and would
 * vanish against a fixed black surface in one theme or the other.
 */
export const RUN_MENU_ITEM_CLASS =
  'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm text-brand-ink transition-colors hover:bg-brand-ink/15 disabled:cursor-not-allowed disabled:opacity-40'

export const RUN_MENU_LABEL = {
  run: 'Run',
  submit: 'Submit',
} as const
