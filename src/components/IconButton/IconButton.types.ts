import type { ReactNode } from 'react'

export interface IconButtonProps {
  /** Accessible label (also the default tooltip). */
  label: string
  isDisabled?: boolean
  isLoading?: boolean
  onClick?: () => void
  title?: string
  children: ReactNode
}
