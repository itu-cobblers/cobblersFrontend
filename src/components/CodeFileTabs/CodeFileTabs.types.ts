export interface CodeFileTab {
  name: string
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
