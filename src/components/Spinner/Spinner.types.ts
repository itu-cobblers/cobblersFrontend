export type SpinnerVariant = 'solid' | 'accent' | 'action'

export interface SpinnerProps {
  /** `solid` = white on filled buttons; `action` = blue on outline/icon buttons; `accent` = purple on accent UI. */
  variant?: SpinnerVariant
}
