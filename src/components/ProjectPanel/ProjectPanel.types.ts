import type { ExecuteStatus, SourceFile } from '@types'
import type { OutputPanelShowAnswer } from '@components/OutputPanel'

export interface ProjectPanelProps {
  files: SourceFile[]
  output: string
  status: ExecuteStatus | null
  isRunning: boolean
  onFilesChange: (files: SourceFile[]) => void
  onRun: () => void
  /** Renders the shared "Show answer" button in the embedded OutputPanel's footer when given. */
  showAnswer?: OutputPanelShowAnswer
}
