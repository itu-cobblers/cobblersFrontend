import type { SpinnerVariant } from './Spinner.types'

export const SPINNER_BASE_CLASS =
  'inline-block h-3 w-3 animate-spin rounded-full border-2 [animation-duration:0.7s]'

export const SPINNER_VARIANT_CLASS: Record<SpinnerVariant, string> = {
  solid: 'border-white/30 border-t-white',
  accent: 'border-accent/15 border-t-accent',
  action: 'border-action/15 border-t-action',
}
