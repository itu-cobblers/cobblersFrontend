export type CodeFileTabVariant = 'student' | 'solution'

export interface CodeFileTab {
  name: string
  /**
   * Visual variant — `solution` tabs use a distinct accent so students can
   * tell the reference answer apart from their own files. Omit/`student` is
   * the default (the student's editable work).
   */
  variant?: CodeFileTabVariant
}

export interface CodeFileTabsProps {
  files: CodeFileTab[]
  activeIndex: number
  onSelectFile: (index: number) => void
  isRunning: boolean
  isRunDisabled?: boolean
  /** Omit to hide the Run button entirely (e.g. project assignments, which upload instead of running). */
  onRun?: () => void
}
