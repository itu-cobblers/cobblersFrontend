export type CodeFileTabVariant = 'student' | 'solution'

export interface CodeFileTab {
  name: string
  variant?: CodeFileTabVariant
}

export interface CodeFileTabsProps {
  files: CodeFileTab[]
  activeIndex: number
  onSelectFile: (index: number) => void
  isRunning?: boolean
  onRun?: () => void
  isReadOnly: boolean
}