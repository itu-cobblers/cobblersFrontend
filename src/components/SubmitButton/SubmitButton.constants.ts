import type { IconName } from '@components'
import type { SubmitButtonStatus } from './SubmitButton.types'

/** How long a landed success/error result holds before the button relaxes back to idle. */
export const SUBMIT_BUTTON_RESET_DELAY_MS = 2000

export const SUBMIT_BUTTON_LABEL: Record<SubmitButtonStatus, string> = {
  idle: 'Submit',
  waiting: 'Submitting…',
  success: 'Well Done',
  error: 'Not Quite',
}

export const SUBMIT_BUTTON_ICON: Record<SubmitButtonStatus, IconName> = {
  idle: 'arrowUp',
  waiting: 'spinner',
  success: 'check',
  error: 'alert',
}

/** Icon stays white on every status — the pill's own background now carries the status color. */
export const SUBMIT_BUTTON_ICON_CLASS = 'text-primary-foreground'

/** Pill background per status: idle/waiting keep the CTA blue, success/error read the palette's status colors. */
export const SUBMIT_BUTTON_BG_CLASS: Record<SubmitButtonStatus, string> = {
  idle: 'bg-primary enabled:hover:bg-primary/90',
  waiting: 'bg-primary',
  success: 'bg-status-success',
  error: 'bg-status-warning',
}

export const SUBMIT_BUTTON_CLASS =
  `relative inline-flex h-[29px] min-w-[90px] cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-lg px-2 text-primary-foreground transition-colors duration-300 disabled:cursor-not-allowed text-xs font-medium`

/** Waiting darkens the pill (still `bg-primary`, just dimmed) and blocks re-clicks. */
export const SUBMIT_BUTTON_WAITING_CLASS = 'brightness-[0.6]'

export const SUBMIT_BUTTON_ICON_WRAP_CLASS = 'flex h-4 w-2 items-center justify-center'
