import type { SpinnerVariant } from '@components/Spinner'
import type { ButtonVariant } from './Button.types'

export const BUTTON_BASE_CLASS =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-1.5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-55'

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-caramel text-[#2a1c10] enabled:hover:bg-toffee',
  ghost: 'border border-oak bg-transparent text-foam enabled:hover:border-foam enabled:hover:text-milk',
}

/** Spinner color that reads well on each button variant. */
export const BUTTON_SPINNER_VARIANT: Record<ButtonVariant, SpinnerVariant> = {
  primary: 'solid',
  ghost: 'accent',
}
