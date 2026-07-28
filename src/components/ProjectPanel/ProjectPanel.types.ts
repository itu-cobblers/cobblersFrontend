import type { SourceFile } from '@types'

export interface ProjectPanelProps {
  /** The student's uploaded (and possibly since-edited) source files, cached per assignment. */
  files: SourceFile[]
  /** Fires with the full replacement file set on every drop/pick — overwrites, never appends. */
  onFilesChange: (files: SourceFile[]) => void

  /** True once this attempt has been recorded via Submit — gates the solution reveal. */
  hasSubmitted: boolean
  isSubmitting: boolean
  /** The last submit's verdict — always `null` here (projects aren't auto-graded yet); drives the shared Submit button's flash when it isn't. */
  lastSubmitPassed?: boolean | null
  onSubmit: () => void

  /** True while `onRevealSolution`'s request is in flight. */
  isLoadingSolution: boolean
  /** The revealed reference solution, once fetched — `null` before reveal or if unavailable. */
  solution: SourceFile[] | null
  onRevealSolution: () => void
}
