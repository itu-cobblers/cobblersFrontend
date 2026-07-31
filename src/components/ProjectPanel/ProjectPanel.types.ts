import type { SourceFile } from '@types'

export interface ProjectPanelProps {
  /** The student's uploaded (and possibly since-edited) source files, cached per assignment. */
  files: SourceFile[]
  /** Fires with the full replacement file set on every drop/pick — overwrites, never appends. */
  onFilesChange: (files: SourceFile[]) => void

  /** True once this attempt has been recorded via Submit — gates the solution reveal. */
  hasSubmitted: boolean
  isSubmitting: boolean
  /**
   * Whether *this exact* submit just landed — projects aren't graded (`passed`
   * is always `null`), so a successful submit always flashes "Well Done".
   */
  lastSubmitPassed?: boolean | null
  onSubmit: () => void

  /** True while `onToggleSolution`'s fetch is in flight (first reveal only). */
  isLoadingSolution: boolean
  /** Whether the fetched solution is currently shown in the IDE tabs above. */
  isSolutionVisible: boolean
  onToggleSolution: () => void
}
