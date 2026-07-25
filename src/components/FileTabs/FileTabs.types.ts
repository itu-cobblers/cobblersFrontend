import type { SourceFile } from '@types'

export interface FileTabsProps {
  files: SourceFile[]
  activeFileName: string
  onSelectFile: (name: string) => void
}
