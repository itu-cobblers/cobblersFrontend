import type { ReactNode } from 'react'

export type CodeFileTabVariant = 'student' | 'solution'

export interface CodeFileTab {
  name: string
  variant?: CodeFileTabVariant
}

export interface CodeFileTabsProps {
  files: CodeFileTab[]
  activeIndex: number
  onSelectFile: (index: number) => void
  /** Rendered on the right of the rail: Show Answer / Submit and friends. */
  actions?: ReactNode
}