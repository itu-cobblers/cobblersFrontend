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
  /**
   * Run is temporarily unrendered — these stay on the interface so the wiring
   * survives until it comes back. Read-only state is now shown by dimming the
   * editor itself, so the rail no longer carries a badge for it.
   */
  isRunning?: boolean
  onRun?: () => void
  /** Rendered on the right of the rail: Show Answer / Submit and friends. */
  actions?: ReactNode
}