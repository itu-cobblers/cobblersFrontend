import type { SubmitButtonStatus } from '@components/SubmitButton'

export type ToolbarFileVariant = 'student' | 'solution'

export interface ToolbarFile {
  name: string
  variant?: ToolbarFileVariant
}

/**
 * The strip above the editor, shared by every assignment kind. Both halves are
 * optional so each kind shows only what applies:
 *
 *   code     tabs + Run + Submit
 *   predict  tabs + Submit          (nothing to run — the answer is typed)
 *   project  tabs + Submit          (nothing to run — files are uploaded)
 */
export interface ToolbarProps {
  /** Omit for kinds with no file strip; a single file still renders one tab. */
  files?: ToolbarFile[]
  activeIndex?: number
  onSelectFile?: (index: number) => void

  /** Omit to hide Run. */
  isRunning?: boolean
  onRun?: () => void

  submitStatus: SubmitButtonStatus
  onSubmit: () => void
  isSubmitDisabled?: boolean

  /**
   * `code` / `predict` only — while the reference answer is open, Submit
   * becomes "Mark As Done" and calls `onMarkAsDone` instead, keeping its own
   * status animation. This binding moved here from the deleted AssignmentFooter.
   */
  canMarkAsDone?: boolean
  isMarkingDone?: boolean
  onMarkAsDone?: () => void
}
