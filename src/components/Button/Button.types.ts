import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'ghost'

export interface ButtonProps {
  variant?: ButtonVariant
  type?: 'button' | 'submit'
  /** Show a spinner and block interaction. */
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
  title?: string
  children: ReactNode
}
