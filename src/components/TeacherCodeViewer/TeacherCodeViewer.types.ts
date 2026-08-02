import type { ExecuteResult, AssignmentKind, SourceFile } from '@types'
import type { ToolbarFile } from '@components/Toolbar'

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
  fileTabs?: ToolbarFile[]
  activeFileIndex?: number
  onSelectFile?: (index: number) => void
  // Submission mode
  studentName?: string
  assignmentTitle?: string
  submittedAt?: string
  passed?: boolean | null
  /** Code-kind submissions: the stored execution result. */
  result?: ExecuteResult | null
  /**
   * Predict-kind assignments: the canonical expected output. Hidden by
   * default (matching the student view never spoiling it upfront) — revealed
   * via `isAnswerVisible`/`onToggleAnswer`, un-gated, in the same shared
   * "Show answer" style as `ProjectPanel`/`PredictPanel`.
   */
  predictExpectedOutput?: string
  /** Whether `predictExpectedOutput` is currently shown. */
  isAnswerVisible?: boolean
  /** Toggles `isAnswerVisible` — always enabled, no submission gate. */
  onToggleAnswer: () => void
  /**
   * Project-kind assignments: the reference solution, once fetched — `null`
   * before reveal or if unavailable. There's no single file to preview (the
   * brief itself now renders in `TeacherAssignmentPanel`, matching the
   * student view), so this area mirrors `ProjectPanel`'s reveal instead.
   */
  solution?: SourceFile[] | null
  /** True while the first `onToggleSolution` fetch is in flight. */
  isLoadingSolution?: boolean
  /** Whether the fetched solution is currently shown. */
  isSolutionVisible?: boolean
  /** Toggles `isSolutionVisible`, fetching only on the first reveal — always enabled, no submission gate. */
  onToggleSolution: () => void
}
