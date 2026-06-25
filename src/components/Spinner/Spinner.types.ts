export type SpinnerVariant = 'solid' | 'accent'

export interface SpinnerProps {
  /** `solid` = dark spinner for caramel buttons; `accent` = caramel spinner for outline/icon buttons. */
  variant?: SpinnerVariant
}
