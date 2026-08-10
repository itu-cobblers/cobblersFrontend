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

export const SUBMIT_BUTTON_ICON_CLASS = 'text-brand-ink'

export const SUBMIT_BUTTON_CLASS = `${BUTTON_BASE_CLASS} ${BUTTON_BASE_TYPOGRAPHY} ${BUTTON_HEIGHT_CLASS} min-w-[128px] relative`;

/**
 * Brand chrome, not CTA colour: this button occupies the same slot in the
 * editor rail that `RunMenu` does on `code` assignments, so it has to stay
 * black in both themes or the two kinds would disagree. Same hover as the run
 * control, for the same reason.
 */
export const SUBMIT_BUTTON_BG_CLASS: Record<SubmitButtonStatus, string> = {
  idle: 'bg-brand-surface text-brand-ink enabled:hover:bg-brand-surface-hover',
  waiting: 'bg-brand-surface text-brand-ink'
}

/** Waiting darkens the pill (still `bg-brand-surface`, just dimmed) and blocks re-clicks. */
export const SUBMIT_BUTTON_WAITING_CLASS = 'brightness-[0.6]'

export const SUBMIT_BUTTON_ICON_WRAP_CLASS = 'flex h-5 w-5 items-center justify-center'
