import type { SourceFile } from '@types'

export interface FileUploadProps {
  files: SourceFile[]
  onFilesChange: (files: SourceFile[]) => void
  /** File picker accept filter. Defaults to `.java`. */
  accept?: string
}
