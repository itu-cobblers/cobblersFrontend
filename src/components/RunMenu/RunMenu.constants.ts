import { BUTTON_HEIGHT_CLASS } from '@components/Button/Button.constants'

/**
 * VS Code's split run control: a play button with a chevron beside it that
 * opens the list of actions. The two halves share one shell with a hairline
 * between them, the way the header lockup does.
 */
export const RUN_MENU_WRAPPER_CLASS = 'relative shrink-0'

export const RUN_MENU_SHELL_CLASS =
  'inline-flex items-stretch gap-px overflow-hidden rounded-md bg-primary text-primary-foreground'

export const RUN_MENU_PLAY_CLASS =
  `flex ${BUTTON_HEIGHT_CLASS} w-10 cursor-pointer items-center justify-center bg-primary transition-colors enabled:hover:bg-primary/85 disabled:cursor-not-allowed`

export const RUN_MENU_CHEVRON_CLASS =
  `flex ${BUTTON_HEIGHT_CLASS} w-7 cursor-pointer items-center justify-center bg-primary transition-colors hover:bg-primary/85`

/**
 * Anchored right so it can't run off the edge of the rail. Black on white,
 * matching the button it drops out of — so no grey outline, which would read
 * as a seam around a solid block.
 */
export const RUN_MENU_LIST_CLASS =
  'absolute right-0 top-full z-30 mt-1 min-w-[160px] overflow-hidden rounded-md bg-foreground py-1'

export const RUN_MENU_ITEM_CLASS =
  'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm text-background transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40'

export const RUN_MENU_LABEL = {
  run: 'Run',
  submit: 'Submit',
} as const
