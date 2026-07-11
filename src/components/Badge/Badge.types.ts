import type { ReactNode } from 'react'

/** `lang` is a filled pill (e.g. "Java"). */
export type BadgeTone = 'lang'

export interface BadgeProps {
  tone: BadgeTone
  children: ReactNode
}
