import { useState } from 'react'
import type { ExecuteRequest, SourceFile, Assignment, AssignmentSet, SubmissionHistoryItem } from '@types'
import type {
  CodeEditorProps,
  OutputPanelProps,
  PredictPanelProps,
  PredictStatus,
  ProjectPanelProps,
  FeedbackBannerProps,
  StepperStep,
  ProblemListItem,
  ProblemStatus,
  ProblemsListTab,
  AssignmentPanelTab,
  CodeFileTab,
} from '@components'
import { useExecutor } from '@hooks/useExecutor'
import { useAssignments } from '@hooks/useAssignments'
import { useSubmission } from '@hooks/useSubmission'
import { defaultStarter } from '@lib/defaultStarter'
import { submitAssignment } from '@lib/submissionApi'
import { ACTIVE_THEME } from '@themes'

const noop = () => {
  /* read-only editor: changes are ignored */
}

/** The center/right area to render for the active assignment — discriminated by kind. */
export type ActivePanel =
  | { kind: 'code'; editor: CodeEditorProps; output: OutputPanelProps; files: CodeFileTab[]; activeFileIndex: number }
  | { kind: 'predict'; editor: CodeEditorProps; predict: PredictPanelProps }
  | { kind: 'project'; project: ProjectPanelProps }

/** Seed editor content for every code assignment from its starter. */
function initialCode(assignmentList: Assignment[]): Record<number, string> {
  const map: Record<number, string> = {}
  for (const assignment of assignmentList) {
    if (assignment.kind === 'code') map[assignment.id] = assignment.starter ?? defaultStarter
  }
  return map
}

/**
 * The current session's assignments, followed by any catalog assignment not
 * already in it (in catalog order) — de-duplicated by id. Backs both rail
 * tabs from one array: "Session" only ever shows `sessionAssignments`, but
 * selecting a "History" item (possibly from another day/room) still needs a
 * real `Assignment` to open in the editor, so it must exist somewhere in the
 * list this hook grades/tracks against.
 */
function mergeAssignments(sessionAssignments: Assignment[], catalog: Assignment[]): Assignment[] {
  const seen = new Set(sessionAssignments.map((assignment) => assignment.id))
  const extra = catalog.filter((assignment) => !seen.has(assignment.id))
  return [...sessionAssignments, ...extra]
}

/**
 * Assignment ids this student has already passed at least once, restricted
 * to the ids actually present in `assignments` — seeds the stepper's
 * completed state from cross-day history (CONTRACT.md S5) instead of
 * starting blank on every reload.
 */
function passedIds(history: SubmissionHistoryItem[], assignments: Assignment[]): number[] {
  const knownIds = new Set(assignments.map((assignment) => assignment.id))
  const passed = new Set(history.filter((item) => item.passed === true).map((item) => item.assignmentId))
  return [...passed].filter((id) => knownIds.has(id))
}

/**
 * Per-assignment status for the Problems sidebar, derived from the same
 * `completedAssignments` set the stepper uses (covers this-session passes)
 * plus the cross-day submission history (covers "attempted but not yet
 * passed"). No new data source — just a richer view of what's already there.
 */
function problemStatus(
  assignmentId: number,
  completedAssignments: Set<number>,
  history: SubmissionHistoryItem[],
): ProblemStatus {
  if (completedAssignments.has(assignmentId)) return 'passed'
  const attempts = history.filter((item) => item.assignmentId === assignmentId)
  if (attempts.length === 0) return 'untried'
  return attempts.some((item) => item.passed === true) ? 'passed' : 'failed'
}

/**
 * The file tabs for a code assignment's editor: the student's own file
 * first, then any read-only harness/grader files (real filenames from the
 * assignment's `harness`, not invented) — a single-file assignment still
 * gets exactly one tab.
 */
function codeFiles(assignment: Assignment): CodeFileTab[] {
  if (assignment.kind !== 'code') return []
  if (!assignment.harness) return [{ name: assignment.solutionFile ?? 'Main.java' }]
  return [{ name: assignment.solutionFile ?? 'Main.java' }, ...assignment.harness.files.map((file) => ({ name: file.name }))]
}

export interface UseStudentWorkspaceOptions {
  assignmentSet: AssignmentSet
  /** The room's join code, when in one — tags submissions; omitted for solo. */
  sessionCode?: string
  /** This student's full submission history, across all days/rooms — seeds "already passed". */
  submissionHistory?: SubmissionHistoryItem[]
  /** The assignment id the teacher is currently focused on; `null` outside a room. */
  teacherFocusedAssignmentId?: number | null
  /** The full cross-day catalog — backs the rail's History tab; may include assignments outside this session. */
  catalog?: Assignment[]
  /** True while `submissionHistory`/`catalog` are (re)loading. */
  isHistoryLoading?: boolean
  /** Called after every submit attempt (pass or fail) so the caller can refresh `submissionHistory`. */
  onSubmissionMade?: () => void
}

/**
 * Orchestrates the student workspace for the active assignment set. Holds per-assignment
 * editor/answer/upload state and the run / assignment / submit hooks, and shapes
 * the props each component renders — branching by the active assignment's `kind`.
 *
 * `sessionCode` tags submissions so they show up correctly in the teacher's
 * per-session view later — but only while the active assignment was reached
 * via the rail's Session tab. Selecting an assignment from the History tab
 * (this student's full cross-day record) always submits without a session
 * id, even mid-room: reviewing history is practice, not room participation.
 * `teacherFocusedAssignmentId` drives the Problems-list glow and the "Teacher
 * moved to…" follow banner (both derived, no separate tracking of their own).
 */
export function useStudentWorkspace({
  assignmentSet,
  sessionCode,
  submissionHistory = [],
  teacherFocusedAssignmentId = null,
  catalog = [],
  isHistoryLoading = false,
  onSubmissionMade,
}: UseStudentWorkspaceOptions) {
  const { assignments } = assignmentSet
  const allAssignments = mergeAssignments(assignments, catalog)
  const [codeByAssignment, setCodeByAssignment] = useState<Record<number, string>>(() => initialCode(allAssignments))
  const [answerByAssignment, setAnswerByAssignment] = useState<Record<number, string>>({})
  const [statusByAssignment, setStatusByAssignment] = useState<Record<number, PredictStatus>>({})
  const [isSubmittingPredict, setIsSubmittingPredict] = useState(false)
  const [isMarkingPredictDone, setIsMarkingPredictDone] = useState(false)
  const [filesByAssignment, setFilesByAssignment] = useState<Record<number, SourceFile[]>>({})
  const [feedback, setFeedback] = useState<FeedbackBannerProps | null>(null)
  const [isRailOpen, setIsRailOpen] = useState(true)
  const [railTab, setRailTab] = useState<ProblemsListTab>('session')
  // Which tab the *active* assignment was selected from — decides whether a
  // later Submit tags `sessionCode`. Independent of `railTab`, which can be
  // flipped back and forth without changing what's actually open.
  const [selectionSource, setSelectionSource] = useState<ProblemsListTab>('session')
  const [panelTab, setPanelTab] = useState<AssignmentPanelTab>('description')
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const executor = useExecutor()
  const assignmentProgress = useAssignments(allAssignments, passedIds(submissionHistory, allAssignments))
  const active = allAssignments[assignmentProgress.activeAssignment]
  // Reviewing history never tags the room, even mid-session.
  const effectiveSessionCode = selectionSource === 'history' ? undefined : sessionCode

  const submission = useSubmission({
    // Only fires for `code` assignments (Submit is disabled otherwise), so
    // `result.result` is always the executor's result when this runs.
    onResult: (submittedCode, result) => {
      if (!result.result) return
      executor.showResult(result.result)
      if (result.passed === true) assignmentProgress.grade(submittedCode, result.result, { forceComplete: true })
      onSubmissionMade?.()
    },
  })

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleToggleRail() {
    setIsRailOpen((prev) => !prev)
  }

  function handleRailTabChange(tab: ProblemsListTab) {
    setRailTab(tab)
  }

  function handleSelectAssignment(id: number, source: ProblemsListTab = 'session') {
    const index = allAssignments.findIndex((assignment) => assignment.id === id)
    if (index === -1) return
    assignmentProgress.setActiveAssignment(index)
    executor.reset()
    submission.reset()
    setFeedback(null)
    setPanelTab('description')
    setActiveFileIndex(0)
    setSelectionSource(source)
  }

  function handleSelectFromRail(id: number) {
    handleSelectAssignment(id, railTab)
  }

  function handleEditorChange(value: string) {
    setCodeByAssignment((prev) => ({ ...prev, [active.id]: value }))
  }

  function buildCodeRequest(code: string): ExecuteRequest | null {
    if (active.kind !== 'code') return null
    if (active.harness) {
      return {
        files: [{ name: active.solutionFile ?? 'Main.java', content: code }, ...active.harness.files],
        entryClass: active.harness.entryClass,
        stdin: active.stdin,
      }
    }
    return { code, stdin: active.stdin }
  }

  async function handleRunCode() {
    const code = codeByAssignment[active.id] ?? ''
    const request = buildCodeRequest(code)
    if (!request) return
    const data = await executor.run(request)
    if (!data) return
    const verdict = assignmentProgress.grade(code, data)
    // Feedback stays up while the student edits; it is replaced on the next
    // run and cleared on assignment switch. Submission feedback drives the
    // shared SubmitButton's success/error hold instead.
    setFeedback(verdict ? { tone: verdict.passed ? 'success' : 'hint', message: verdict.message } : null)
  }

  function handleSubmitCode() {
    submission.confirm(codeByAssignment[active.id] ?? '', assignmentProgress.activeAssignmentId, effectiveSessionCode)
  }

  function handlePredictAnswerChange(value: string) {
    setAnswerByAssignment((prev) => ({ ...prev, [active.id]: value }))
  }

  async function handlePredictSubmit() {
    if (active.kind !== 'predict') return
    const answer = answerByAssignment[active.id] ?? ''
    setIsSubmittingPredict(true)
    try {
      // Predict shares the same submission endpoint as `code` (CONTRACT.md
      // "Submission") — this is what makes a predict attempt show up in
      // GET /api/students/{id}/submissions and the My Progress panel too.
      const result = await submitAssignment({ assignmentId: active.id, content: answer, sessionCode: effectiveSessionCode })
      const correct = result.passed === true
      // A wrong answer goes to "tried" rather than staying an opaque failure —
      // the input reopens for another attempt, with "Show answer" alongside
      // Submit, until the student either gets it or reveals the answer.
      setStatusByAssignment((prev) => ({ ...prev, [active.id]: correct ? 'correct' : 'tried' }))
      if (correct) assignmentProgress.complete(active.id)
      onSubmissionMade?.()
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setFeedback({ tone: 'hint', message: `Could not submit your answer (${reason}). Please try again.` })
    } finally {
      setIsSubmittingPredict(false)
    }
  }

  function handlePredictShowAnswer() {
    setStatusByAssignment((prev) => ({ ...prev, [active.id]: 'revealed' }))
  }

  async function handlePredictMarkAsDone() {
    if (active.kind !== 'predict') return
    setIsMarkingPredictDone(true)
    try {
      // Records a completing submission with the correct answer so this
      // assignment shows up as passed in submission history going forward,
      // even though the student never typed it themselves.
      await submitAssignment({ assignmentId: active.id, content: active.expectedOutput, sessionCode: effectiveSessionCode })
      setStatusByAssignment((prev) => ({ ...prev, [active.id]: 'done' }))
      assignmentProgress.complete(active.id)
      onSubmissionMade?.()
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setFeedback({ tone: 'hint', message: `Could not save your progress (${reason}). Please try again.` })
    } finally {
      setIsMarkingPredictDone(false)
    }
  }

  function handleProjectFilesChange(files: SourceFile[]) {
    setFilesByAssignment((prev) => ({ ...prev, [active.id]: files }))
  }

  async function handleProjectRun() {
    if (active.kind !== 'project') return
    const files = filesByAssignment[active.id] ?? []
    if (files.length === 0) return
    const data = await executor.run({ files, entryClass: active.entryClass ?? 'Main' })
    if (data?.status === 'success') assignmentProgress.complete(active.id)
  }

  // ── display-ready props ─────────────────────────────────────────────────────
  const steps: StepperStep[] = assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    isActive: assignment.id === assignmentProgress.activeAssignmentId,
    isDone: assignmentProgress.completedAssignments.has(assignment.id),
  }))

  function buildActivePanel(): ActivePanel {
    if (active.kind === 'predict') {
      return {
        kind: 'predict',
        editor: { value: active.snippet, onChange: noop, isReadOnly: true },
        predict: {
          answer: answerByAssignment[active.id] ?? '',
          status: statusByAssignment[active.id] ?? 'idle',
          isSubmitting: isSubmittingPredict,
          isMarkingDone: isMarkingPredictDone,
          expectedOutput: active.expectedOutput,
          onAnswerChange: handlePredictAnswerChange,
          onSubmit: handlePredictSubmit,
          onShowAnswer: handlePredictShowAnswer,
          onMarkAsDone: handlePredictMarkAsDone,
        },
      }
    }
    if (active.kind === 'project') {
      return {
        kind: 'project',
        project: {
          files: filesByAssignment[active.id] ?? [],
          output: executor.output,
          status: executor.status,
          isRunning: executor.isRunning,
          onFilesChange: handleProjectFilesChange,
          onRun: handleProjectRun,
        },
      }
    }
    const files = codeFiles(active)
    const isOwnFile = activeFileIndex === 0
    const harnessFile = active.harness?.files[activeFileIndex - 1]
    return {
      kind: 'code',
      files,
      activeFileIndex,
      // Tab 0 is always the student's own file (editable); any further tabs
      // are the harness's real grader files, shown read-only.
      editor: isOwnFile
        ? { value: codeByAssignment[active.id] ?? defaultStarter, onChange: handleEditorChange }
        : { value: harnessFile?.content ?? '', onChange: noop, isReadOnly: true },
      output: {
        output: executor.output,
        status: executor.status,
        submit: {
          isSubmitting: submission.isSubmitting,
          onSubmit: handleSubmitCode,
          lastResultPassed: submission.result?.passed ?? null,
        },
        // TODO: wire this once the teacher's reveal-answer signal is added to
        // sessionHub.ts (CONTRACT.md) — code assignments should only offer
        // "Show answer" after that broadcast, unlike Predict.
      },
    }
  }

  // The Session tab — this session's own assignments, in order.
  const sessionProblems: ProblemListItem[] = assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    kind: assignment.kind,
    status: problemStatus(assignment.id, assignmentProgress.completedAssignments, submissionHistory),
  }))

  // The History tab — every assignment this student has ever seen, across
  // every day/room. `project` assignments are excluded: they never produce a
  // `Submission` (VS-Code-only), so there's no history to show for them.
  const historyProblems: ProblemListItem[] = allAssignments
    .filter((assignment) => assignment.kind !== 'project')
    .map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      kind: assignment.kind,
      status: problemStatus(assignment.id, assignmentProgress.completedAssignments, submissionHistory),
    }))

  const teacherFocusedAssignment =
    teacherFocusedAssignmentId != null ? assignments.find((assignment) => assignment.id === teacherFocusedAssignmentId) : undefined

  return {
    activePanel: buildActivePanel(),
    problemsList: {
      activeTab: railTab,
      onTabChange: handleRailTabChange,
      sessionItems: sessionProblems,
      historyItems: historyProblems,
      isHistoryLoading,
      activeId: active.id,
      onSelect: handleSelectFromRail,
      teacherFocusId: teacherFocusedAssignmentId,
      isOpen: isRailOpen,
      onToggleOpen: handleToggleRail,
    },
    followBanner:
      teacherFocusedAssignment && teacherFocusedAssignment.id !== active.id
        ? {
            assignmentId: teacherFocusedAssignment.id,
            assignmentTitle: teacherFocusedAssignment.title,
            onFollow: () => handleSelectAssignment(teacherFocusedAssignment.id),
          }
        : null,
    toolbar: {
      isFollowingTeacher: teacherFocusedAssignmentId != null && teacherFocusedAssignmentId === active.id,
    },
    codeFileTabs:
      active.kind === 'code'
        ? {
            files: codeFiles(active),
            activeIndex: activeFileIndex,
            onSelectFile: setActiveFileIndex,
            isRunning: executor.isRunning,
            onRun: handleRunCode,
          }
        : null,
    assignmentPanel: {
      steps,
      onSelectStep: handleSelectAssignment,
      isStepperVisible: false,
      activeTab: panelTab,
      onTabChange: setPanelTab,
      submissions: submissionHistory
        .filter((item) => item.assignmentId === active.id)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
      title: active.title,
      lesson: active.lesson,
      description: active.description,
      body: active.kind === 'project' ? active.brief : undefined,
      hint: active.hint,
      feedback: feedback ?? undefined,
    },
    scene: {
      Scene: ACTIVE_THEME.Scene,
      signals: assignmentProgress.signals,
      completedAssignments: assignmentProgress.completedAssignments,
      activeAssignment: assignmentProgress.activeAssignment,
    },
  }
}
