import type { IconName } from '@components'
import type { SubmitButtonStatus } from './SubmitButton.types'
import {BUTTON_BASE_CLASS, BUTTON_BASE_TYPOGRAPHY, BUTTON_HEIGHT_CLASS} from "@components/Button/Button.constants.ts";

/** How long a landed success/error result holds before the button relaxes back to idle. */
export const SUBMIT_BUTTON_RESET_DELAY_MS = 2000

export const SUBMIT_BUTTON_LABEL: Record<SubmitButtonStatus, string> = {
  idle: 'Submit',
  waiting: 'Submitting…'
}

export const SUBMIT_BUTTON_ICON: Record<SubmitButtonStatus, IconName> = {
  idle: 'arrowUp',
  waiting: 'spinner'
}

/** Icon stays white on every status — the pill's own background now carries the status color. */
export const SUBMIT_BUTTON_ICON_CLASS = 'text-primary-foreground'

export const SUBMIT_BUTTON_CLASS = `${BUTTON_BASE_CLASS} ${BUTTON_BASE_TYPOGRAPHY} ${BUTTON_HEIGHT_CLASS} min-w-[128px] relative`;

export const SUBMIT_BUTTON_BG_CLASS: Record<SubmitButtonStatus, string> = {
  idle: 'bg-primary text-primary-foreground enabled:hover:bg-primary/90',
  waiting: 'bg-primary text-primary-foreground'
}

/** Waiting darkens the pill (still `bg-primary`, just dimmed) and blocks re-clicks. */
export const SUBMIT_BUTTON_WAITING_CLASS = 'brightness-[0.6]'

export const SUBMIT_BUTTON_ICON_WRAP_CLASS = 'flex h-5 w-5 items-center justify-center'
