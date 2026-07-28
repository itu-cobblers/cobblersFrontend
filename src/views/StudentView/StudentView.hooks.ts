import { useRef, useState } from 'react'
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
import { defaultStarter, projectUploadStarter } from '@lib/defaultStarter'
import { submitAssignment, fetchAssignmentSolution } from '@lib/submissionApi'
import { getProjectIdentity } from '@lib/projectIdentity'
import { ACTIVE_THEME } from '@themes'

const noop = () => {
  /* read-only editor: changes are ignored */
}

/**
 * The shared Submit button's transient "well done"/"not quite" flash — tied
 * to the exact submission that produced it (`assignmentId`), never to an
 * assignment's persisted status (which also drives badges/checkmarks and
 * must survive switching away and back unchanged). Consumers only read
 * `passed` when `assignmentId` still matches the active assignment, so a
 * flash from one assignment can never bleed into another's button.
 */
interface SubmitFlash {
  assignmentId: number
  passed: boolean
}

/** The center/right area to render for the active assignment — discriminated by kind. */
export type ActivePanel =
  | { kind: 'code'; editor: CodeEditorProps; output: OutputPanelProps }
  | { kind: 'predict'; editor: CodeEditorProps; predict: PredictPanelProps }
  | { kind: 'project'; editor: CodeEditorProps; project: ProjectPanelProps }

/** Seed editor content for every single-file code assignment from its starter. */
function initialCode(assignmentList: Assignment[]): Record<number, string> {
  const map: Record<number, string> = {}
  for (const assignment of assignmentList) {
    if (assignment.kind === 'code' && !assignment.starterFiles) {
      map[assignment.id] = assignment.starter ?? defaultStarter
    }
  }
  return map
}

/** Seed the editable contents for every multi-file code assignment. */
function initialMultiFiles(assignmentList: Assignment[]): Record<number, SourceFile[]> {
  const map: Record<number, SourceFile[]> = {}
  for (const assignment of assignmentList) {
    if (assignment.kind === 'code' && assignment.starterFiles) {
      map[assignment.id] = assignment.starterFiles
    }
  }
  return map
}

/** Seed each multi-file assignment with its first source file selected. */
function initialActiveFiles(assignmentList: Assignment[]): Record<number, string> {
  const map: Record<number, string> = {}
  for (const assignment of assignmentList) {
    if (assignment.kind === 'code' && assignment.starterFiles?.[0]) {
      map[assignment.id] = assignment.starterFiles[0].name
    }
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
 * assignment's `starterFiles`; a single-file assignment still gets one tab.
 */
function codeFiles(assignment: Assignment): CodeFileTab[] {
  if (assignment.kind !== 'code') return []
  return assignment.starterFiles?.map((file) => ({ name: file.name })) ?? [{ name: 'Main.java' }]
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
  const [submitFlash, setSubmitFlash] = useState<SubmitFlash | null>(null)
  // Bumped on every assignment switch so an in-flight submit's response,
  // arriving after the student has already moved on, is recognized as stale
  // and never flashes the (now different) active assignment's Submit button.
  const submitGenerationRef = useRef(0)
  const [filesByAssignment, setFilesByAssignment] = useState<Record<number, SourceFile[]>>({})
  // Local record of "submitted this project at least once this session" —
  // ORed with `submissionHistory` in `hasSubmittedProject` below so a reload
  // (once GET /api/students/{id}/submissions is live) picks it up too.
  const [projectSubmittedByAssignment, setProjectSubmittedByAssignment] = useState<Record<number, boolean>>({})
  const [solutionByAssignment, setSolutionByAssignment] = useState<Record<number, SourceFile[]>>({})
  // Which assignment's solution fetch is in flight, if any — not a plain
  // boolean, so switching away mid-fetch doesn't show a spinner on whatever
  // assignment the student is looking at now.
  const [loadingSolutionAssignmentId, setLoadingSolutionAssignmentId] = useState<number | null>(null)
  const [multiFilesByAssignment, setMultiFilesByAssignment] = useState<Record<number, SourceFile[]>>(() =>
    initialMultiFiles(allAssignments),
  )
  const [activeFileByAssignment, setActiveFileByAssignment] = useState<Record<number, string>>(() =>
    initialActiveFiles(allAssignments),
  )
  const [feedback, setFeedback] = useState<FeedbackBannerProps | null>(null)
  const [isRailOpen, setIsRailOpen] = useState(true)
  const [railTab, setRailTab] = useState<ProblemsListTab>('session')
  // Which tab the *active* assignment was selected from — decides whether a
  // later Submit tags `sessionCode`. Independent of `railTab`, which can be
  // flipped back and forth without changing what's actually open.
  const [selectionSource, setSelectionSource] = useState<ProblemsListTab>('session')
  const [panelTab, setPanelTab] = useState<AssignmentPanelTab>('description')

  const executor = useExecutor()
  const assignmentProgress = useAssignments(allAssignments, passedIds(submissionHistory, allAssignments))
  const active = allAssignments[assignmentProgress.activeAssignment]
  // Reviewing history never tags the room, even mid-session.
  const effectiveSessionCode = selectionSource === 'history' ? undefined : sessionCode

  const submission = useSubmission({
    // Only fires for `code` assignments (Submit is disabled otherwise), so
    // `result.result` is always the executor's result when this runs.
    onResult: (content, result) => {
      if (!result.result) return
      executor.showResult(result.result)
      if (result.passed === true && typeof content === 'string') {
        assignmentProgress.grade(content, result.result, { forceComplete: true })
      }
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
    submitGenerationRef.current += 1
    assignmentProgress.setActiveAssignment(index)
    executor.reset()
    submission.reset()
    setSubmitFlash(null)
    setFeedback(null)
    setPanelTab('description')
    setSelectionSource(source)
  }

  function handleSelectFromRail(id: number) {
    handleSelectAssignment(id, railTab)
  }

  function handleEditorChange(value: string) {
    if (active.kind === 'project') {
      const files = filesByAssignment[active.id]
      const activeFileName = activeFileByAssignment[active.id]
      // No-op before any files are uploaded — the editor is just showing the
      // read-only "upload your files" placeholder then.
      if (!files || !activeFileName) return
      setFilesByAssignment((previous) => ({
        ...previous,
        [active.id]: (previous[active.id] ?? files).map((file) =>
          file.name === activeFileName ? { ...file, content: value } : file,
        ),
      }))
      return
    }
    const activeFiles = active.kind === 'code' ? multiFilesByAssignment[active.id] : undefined
    const activeFileName = active.kind === 'code' ? activeFileByAssignment[active.id] : undefined
    if (activeFiles && activeFileName) {
      setMultiFilesByAssignment((previous) => ({
        ...previous,
        [active.id]: (previous[active.id] ?? activeFiles).map((file) =>
          file.name === activeFileName ? { ...file, content: value } : file,
        ),
      }))
      return
    }
    setCodeByAssignment((prev) => ({ ...prev, [active.id]: value }))
  }

  function handleSelectFile(index: number) {
    if (active.kind === 'project') {
      const file = filesByAssignment[active.id]?.[index]
      if (!file) return
      setActiveFileByAssignment((previous) => ({ ...previous, [active.id]: file.name }))
      return
    }
    if (active.kind !== 'code') return
    const file = multiFilesByAssignment[active.id]?.[index]
    if (!file) return
    setActiveFileByAssignment((previous) => ({ ...previous, [active.id]: file.name }))
  }

  function buildCodeRequest(): ExecuteRequest | null {
    if (active.kind !== 'code') return null
    const activeFiles = multiFilesByAssignment[active.id]
    if (activeFiles) {
      return {
        files: activeFiles,
        entryClass: active.entryClass,
        stdin: active.stdin,
      }
    }
    return { code: codeByAssignment[active.id] ?? '', stdin: active.stdin }
  }

  async function handleRunCode() {
    const request = buildCodeRequest()
    if (!request) return
    const data = await executor.run(request)
    if (!data) return
    const code = multiFilesByAssignment[active.id] ? '' : codeByAssignment[active.id] ?? ''
    const verdict = assignmentProgress.grade(code, data)
    // Feedback stays up while the student edits; it is replaced on the next
    // run and cleared on assignment switch. Submission feedback drives the
    // shared SubmitButton's success/error hold instead.
    setFeedback(verdict ? { tone: verdict.passed ? 'success' : 'hint', message: verdict.message } : null)
  }

  async function handleSubmitCode() {
    const assignmentId = assignmentProgress.activeAssignmentId
    if (assignmentId === undefined) return
    const generation = submitGenerationRef.current
    const content = multiFilesByAssignment[active.id] ?? codeByAssignment[active.id] ?? ''
    const result = await submission.confirm(content, assignmentId, effectiveSessionCode)
    // Only flash the Submit button if the student is still looking at the
    // assignment this result belongs to — a response that lands after they've
    // already moved on must not animate whatever button they're on now.
    // (`confirm` only resolves `null` once `assignmentId` is already known to
    // be defined — i.e. a request genuinely failed — which still flashes "not quite".)
    if (submitGenerationRef.current === generation) setSubmitFlash({ assignmentId, passed: result?.passed === true })
  }

  function handlePredictAnswerChange(value: string) {
    setAnswerByAssignment((prev) => ({ ...prev, [active.id]: value }))
  }

  async function handlePredictSubmit() {
    if (active.kind !== 'predict') return
    const assignmentId = active.id
    const answer = answerByAssignment[assignmentId] ?? ''
    const generation = submitGenerationRef.current
    setIsSubmittingPredict(true)
    try {
      // Predict shares the same submission endpoint as `code` (CONTRACT.md
      // "Submission") — this is what makes a predict attempt show up in
      // GET /api/students/{id}/submissions and the My Progress panel too.
      const result = await submitAssignment({ assignmentId, content: answer, sessionCode: effectiveSessionCode })
      const correct = result.passed === true
      // A wrong answer goes to "tried" rather than staying an opaque failure —
      // the input reopens for another attempt, with "Show answer" alongside
      // Submit, until the student either gets it or reveals the answer.
      setStatusByAssignment((prev) => ({ ...prev, [assignmentId]: correct ? 'correct' : 'tried' }))
      if (correct) assignmentProgress.complete(assignmentId)
      // Only flash the Submit button if the student is still looking at the
      // assignment this result belongs to — see `handleSubmitCode`.
      if (submitGenerationRef.current === generation) setSubmitFlash({ assignmentId, passed: correct })
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
    // Revealing isn't a fresh submit outcome — don't let a leftover flash
    // from the earlier wrong attempt bleed into this new view.
    setSubmitFlash(null)
  }

  async function handlePredictMarkAsDone() {
    if (active.kind !== 'predict') return
    const assignmentId = active.id
    setIsMarkingPredictDone(true)
    try {
      // Records a completing submission with the correct answer so this
      // assignment shows up as passed in submission history going forward,
      // even though the student never typed it themselves.
      await submitAssignment({ assignmentId, content: active.expectedOutput, sessionCode: effectiveSessionCode })
      setStatusByAssignment((prev) => ({ ...prev, [assignmentId]: 'done' }))
      assignmentProgress.complete(assignmentId)
      onSubmissionMade?.()
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setFeedback({ tone: 'hint', message: `Could not save your progress (${reason}). Please try again.` })
    } finally {
      setIsMarkingPredictDone(false)
    }
  }

  function handleProjectFilesChange(files: SourceFile[]) {
    // Every drop/pick overwrites the cache wholesale (not an append) and
    // selects the first uploaded file's tab.
    setFilesByAssignment((prev) => ({ ...prev, [active.id]: files }))
    setActiveFileByAssignment((prev) => ({ ...prev, [active.id]: files[0]?.name ?? '' }))
  }

  function hasSubmittedProject(assignmentId: number): boolean {
    return Boolean(projectSubmittedByAssignment[assignmentId]) || submissionHistory.some((item) => item.assignmentId === assignmentId)
  }

  async function handleProjectSubmit() {
    if (active.kind !== 'project') return
    const assignmentId = active.id
    const files = filesByAssignment[assignmentId] ?? []
    if (files.length === 0) return
    const generation = submitGenerationRef.current
    // Projects aren't auto-graded yet (CONTRACT.md) — `result` is always null
    // here, so `useSubmission`'s shared `onResult` (built for `code`) bails
    // out early and never calls `onSubmissionMade`; do both ourselves.
    const result = await submission.confirm(files, assignmentId, effectiveSessionCode)
    if (submitGenerationRef.current === generation) setSubmitFlash({ assignmentId, passed: result?.passed === true })
    if (result) {
      setProjectSubmittedByAssignment((prev) => ({ ...prev, [assignmentId]: true }))
      // Projects aren't auto-graded (there's no Run step anymore) — a
      // successful Submit is what marks the stepper/rail checkmark done.
      assignmentProgress.complete(assignmentId)
      onSubmissionMade?.()
    }
  }

  async function handleRevealSolution() {
    if (active.kind !== 'project') return
    const assignmentId = active.id
    setLoadingSolutionAssignmentId(assignmentId)
    try {
      const result = await fetchAssignmentSolution(assignmentId)
      if (Array.isArray(result.solution)) {
        setSolutionByAssignment((prev) => ({ ...prev, [assignmentId]: result.solution as SourceFile[] }))
      }
    } finally {
      setLoadingSolutionAssignmentId((current) => (current === assignmentId ? null : current))
    }
  }

  // ── display-ready props ─────────────────────────────────────────────────────
  const steps: StepperStep[] = assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    isActive: assignment.id === assignmentProgress.activeAssignmentId,
    isDone: assignmentProgress.completedAssignments.has(assignment.id),
  }))

  function activeCodeFileIndex(assignmentId: number): number {
    const files = multiFilesByAssignment[assignmentId]
    const activeFileName = activeFileByAssignment[assignmentId]
    const index = files?.findIndex((file) => file.name === activeFileName) ?? 0
    return index === -1 ? 0 : index
  }

  /** The file tabs for a project assignment's editor — a single placeholder "Main.java" tab before anything is uploaded. */
  function projectFileTabs(assignmentId: number): CodeFileTab[] {
    const files = filesByAssignment[assignmentId]
    return files && files.length > 0 ? files.map((file) => ({ name: file.name })) : [{ name: 'Main.java' }]
  }

  function activeProjectFileIndex(assignmentId: number): number {
    const files = filesByAssignment[assignmentId]
    if (!files || files.length === 0) return 0
    const activeFileName = activeFileByAssignment[assignmentId]
    const index = files.findIndex((file) => file.name === activeFileName)
    return index === -1 ? 0 : index
  }

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
          lastAnswerCorrect: submitFlash && submitFlash.assignmentId === active.id ? submitFlash.passed : null,
          expectedOutput: active.expectedOutput,
          onAnswerChange: handlePredictAnswerChange,
          // `handlePredictSubmit` only reads `submitGenerationRef.current` from
          // inside its own async body, after the click that invokes it — never
          // during render — but the lint rule can't see through the closure and
          // flags it as if passing the ref itself. Known false positive, same
          // shape as the `react-hooks/set-state-in-effect` one further down.
          // eslint-disable-next-line react-hooks/refs
          onSubmit: handlePredictSubmit,
          onShowAnswer: handlePredictShowAnswer,
          onMarkAsDone: handlePredictMarkAsDone,
        },
      }
    }
    if (active.kind === 'project') {
      const files = filesByAssignment[active.id] ?? []
      const activeFileName = activeFileByAssignment[active.id] ?? files[0]?.name
      const activeFile = files.find((file) => file.name === activeFileName)
      return {
        kind: 'project',
        editor:
          files.length > 0
            ? { value: activeFile?.content ?? '', onChange: handleEditorChange, path: activeFileName }
            : { value: projectUploadStarter, onChange: noop, isReadOnly: true },
        project: {
          files,
          onFilesChange: handleProjectFilesChange,
          hasSubmitted: hasSubmittedProject(active.id),
          isSubmitting: submission.isSubmitting,
          lastSubmitPassed: submitFlash && submitFlash.assignmentId === active.id ? submitFlash.passed : null,
          // Same known false positive as `handlePredictSubmit` above — the ref
          // is only ever read inside the async body, after the click.
          // eslint-disable-next-line react-hooks/refs
          onSubmit: handleProjectSubmit,
          isLoadingSolution: loadingSolutionAssignmentId === active.id,
          solution: solutionByAssignment[active.id] ?? null,
          onRevealSolution: handleRevealSolution,
        },
      }
    }
    const activeFiles = multiFilesByAssignment[active.id]
    const activeFileName = activeFileByAssignment[active.id] ?? activeFiles?.[0]?.name
    const activeFile = activeFiles?.find((file) => file.name === activeFileName)
    return {
      kind: 'code',
      editor: activeFiles
        ? { value: activeFile?.content ?? '', onChange: handleEditorChange, path: activeFileName }
        : { value: codeByAssignment[active.id] ?? defaultStarter, onChange: handleEditorChange },
      output: {
        output: executor.output,
        status: executor.status,
        submit: {
          isSubmitting: submission.isSubmitting,
          // Same known false positive as `handlePredictSubmit` above — the ref
          // is only ever read inside the async body, after the click.
          // eslint-disable-next-line react-hooks/refs
          onSubmit: handleSubmitCode,
          lastResultPassed: submitFlash && submitFlash.assignmentId === active.id ? submitFlash.passed : null,
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
  // every day/room. `project` now Submits too (see `handleProjectSubmit`),
  // so it's no longer excluded here.
  const historyProblems: ProblemListItem[] = allAssignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    kind: assignment.kind,
    status: problemStatus(assignment.id, assignmentProgress.completedAssignments, submissionHistory),
  }))

  const teacherFocusedAssignment =
    teacherFocusedAssignmentId != null ? assignments.find((assignment) => assignment.id === teacherFocusedAssignmentId) : undefined

  const followBanner =
    teacherFocusedAssignment && teacherFocusedAssignment.id !== active.id
      ? {
          assignmentId: teacherFocusedAssignment.id,
          assignmentTitle: teacherFocusedAssignment.title,
          onFollow: () => handleSelectAssignment(teacherFocusedAssignment.id),
        }
      : undefined

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
    followBanner,
    codeFileTabs:
      active.kind === 'code'
        ? {
            files: codeFiles(active),
            activeIndex: activeCodeFileIndex(active.id),
            onSelectFile: handleSelectFile,
            isRunning: executor.isRunning,
            onRun: handleRunCode,
          }
        : active.kind === 'project'
          ? {
              files: projectFileTabs(active.id),
              activeIndex: activeProjectFileIndex(active.id),
              onSelectFile: handleSelectFile,
              isRunning: false,
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
      projectIdentity: active.kind === 'project' ? getProjectIdentity(active.title) : undefined,
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
