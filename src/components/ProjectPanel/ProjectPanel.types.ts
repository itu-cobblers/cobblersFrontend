import type { SourceFile } from '@types'

export interface ProjectPanelProps {
  /** The student's uploaded (and possibly since-edited) source files, cached per assignment. */
  files: SourceFile[]
  /** Fires with the full replacement file set on every drop/pick — overwrites, never appends. */
  onFilesChange: (files: SourceFile[]) => void

  /** True once this attempt has been recorded via Submit — gates the solution reveal. */
  hasSubmitted: boolean

}
