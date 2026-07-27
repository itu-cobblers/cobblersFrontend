import type { ExecuteResult, AssignmentKind } from '@types'
import type { CodeFileTab } from '@components/CodeFileTabs'

export interface TeacherCodeViewerProps {
  /** Drives which read-only view mirrors the student's IDE column below. */
  assignmentKind: AssignmentKind
  /**
   * A stable id for the current "editing context" (e.g. `assignment-34` or
   * `sub-abc123`) — namespaces the Monaco model path per assignment/submission
   * so switching between two contexts that happen to share a file name (every
   * multi-file assignment has a `Main.java`) always gets a fresh model instead
   * of Monaco silently reusing — and displaying — another context's stale one.
   */
  editorKey: string
  /** Editor contents: the assignment's starter/snippet, or the selected submission's code/answer. */
  code: string
  /** True once a specific submission is selected — switches from the starter-code
   * preview (matching the student view) to the submitted code + stored result. */
  hasSubmission: boolean
  // Starter-code mode (no submission selected yet) — mirrors the student's file tabs. Code kind only.
  fileTabs?: CodeFileTab[]
  activeFileIndex?: number
  onSelectFile?: (index: number) => void
  // Submission mode
  studentName?: string
  assignmentTitle?: string
  submittedAt?: string
  passed?: boolean | null
  /** Code-kind submissions: the stored execution result. */
  result?: ExecuteResult | null
  /** Predict-kind assignments: the canonical expected output, shown for reference. */
  predictExpectedOutput?: string
  /** Project-kind assignments: the brief shown instead of a code editor (no single file to preview). */
  projectBrief?: string
}
