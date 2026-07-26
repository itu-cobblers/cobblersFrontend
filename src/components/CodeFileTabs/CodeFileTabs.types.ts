export interface CodeFileTab {
  name: string
}

export interface CodeFileTabsProps {
  files: CodeFileTab[]
  activeIndex: number
  onSelectFile: (index: number) => void
  isRunning: boolean
  isRunDisabled?: boolean
  onRun: () => void
}
