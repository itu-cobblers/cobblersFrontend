import type { ReactNode } from 'react'

/** `lang` is a filled pill (e.g. "Java"); the difficulty tones are colored labels. */
export type BadgeTone = 'lang' | 'easy' | 'medium' | 'hard'

export interface BadgeProps {
  tone: BadgeTone
  children: ReactNode
}
