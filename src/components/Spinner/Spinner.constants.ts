import type { SpinnerVariant } from '@components'

export const SPINNER_BASE_CLASS =
  'inline-block h-3 w-3 animate-spin rounded-full border-2 [animation-duration:0.7s]'

export const SPINNER_VARIANT_CLASS: Record<SpinnerVariant, string> = {
  solid: 'border-black/20 border-t-black',
  accent: 'border-accent/15 border-t-accent',
  action: 'border-primary/15 border-t-primary',
  white: 'border-white/20 border-t-white',
}
