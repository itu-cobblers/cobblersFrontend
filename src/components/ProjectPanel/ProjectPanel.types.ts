import type { ExecuteStatus, SourceFile } from '@types'

export interface ProjectPanelProps {
  brief: string
  files: SourceFile[]
  output: string
  status: ExecuteStatus | null
  isRunning: boolean
  onFilesChange: (files: SourceFile[]) => void
  onRun: () => void
}
