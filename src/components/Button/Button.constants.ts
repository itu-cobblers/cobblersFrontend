import type { SpinnerVariant } from '@components/Spinner'
import type { ButtonVariant } from './Button.types'
import {TYPOGRAPHY_LEVELS} from "@constants";

/**
 * Shared height for the assignment rail's controls — Show Answer, Submit and
 * the run menu. Left off BUTTON_BASE_CLASS on purpose so ordinary Buttons
 * elsewhere keep sizing from their padding; these three have to line up with
 * each other, and derived heights drifted (Submit 33px, Show Answer 34px with
 * its ghost border, run menu 36px). 35px sits in that original range.
 */
export const BUTTON_HEIGHT_CLASS = 'h-[33px]'

export const BUTTON_BASE_CLASS =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-1.5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-55'

export const BUTTON_BASE_TYPOGRAPHY = TYPOGRAPHY_LEVELS.bodyStrong.tailwindClass;

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white enabled:hover:bg-primary',
  ghost: 'border border-border bg-transparent text-muted-foreground enabled:hover:border-muted-foreground enabled:hover:text-foreground',
  solid: 'bg-primary text-primary-foreground enabled:hover:bg-primary/90',
  zinc: 'bg-zinc-700 text-white hover:bg-zinc-600'
}

/** Spinner color that reads well on each button variant. */
export const BUTTON_SPINNER_VARIANT: Record<ButtonVariant, SpinnerVariant> = {
  primary: 'solid',
  ghost: 'action',
  solid: 'solid',
  zinc: 'action'
}