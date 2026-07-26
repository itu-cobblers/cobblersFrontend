import { useState } from 'react'
import type { ExecuteRequest, SourceFile, Assignment, AssignmentSet } from '@types'
import type {
  CodeEditorProps,
  FileTabsProps,
  OutputPanelProps,
  PredictPanelProps,
  PredictStatus,
  ProjectPanelProps,
  FeedbackBannerProps,
  StepperStep,
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
  | { kind: 'code'; editor: CodeEditorProps; output: OutputPanelProps; tabs?: FileTabsProps }
  | { kind: 'predict'; editor: CodeEditorProps; predict: PredictPanelProps }
  | { kind: 'project'; project: ProjectPanelProps }

/** Seed editor content for every single-file code assignment from its starter. */
function initialCode(assignmentList: Assignment[]): Record<number, string> {
  const map: Record<number, string> = {}
  for (const assignment of assignmentList) {
    if (assignment.kind === 'code' && !assignment.starterFiles) map[assignment.id] = assignment.starter ?? defaultStarter
  }
  return map
}

/** Seed per-file tabs for every multi-file (class-authoring) code assignment from its `starterFiles`. */
function initialFiles(assignmentList: Assignment[]): Record<number, SourceFile[]> {
  const map: Record<number, SourceFile[]> = {}
  for (const assignment of assignmentList) {
    if (assignment.kind === 'code' && assignment.starterFiles) map[assignment.id] = assignment.starterFiles
  }
  return map
}

/** Seed the active tab (first file) for every multi-file code assignment. */
function initialActiveFile(assignmentList: Assignment[]): Record<number, string> {
  const map: Record<number, string> = {}
  for (const assignment of assignmentList) {
    if (assignment.kind === 'code' && assignment.starterFiles?.[0]) map[assignment.id] = assignment.starterFiles[0].name
  }
  return map
}

/**
 * Orchestrates the student workspace for the active assignment set. Holds per-assignment
 * editor/answer/upload state and the run / assignment / submit hooks, and shapes
 * the props each component renders — branching by the active assignment's `kind`.
 */
export function useStudentWorkspace(assignmentSet: AssignmentSet) {
  const { assignments } = assignmentSet
  const [codeByAssignment, setCodeByAssignment] = useState<Record<number, string>>(() => initialCode(assignments))
  const [answerByAssignment, setAnswerByAssignment] = useState<Record<number, string>>({})
  const [statusByAssignment, setStatusByAssignment] = useState<Record<number, PredictStatus>>({})
  const [filesByAssignment, setFilesByAssignment] = useState<Record<number, SourceFile[]>>({})
  // Multi-file class-authoring assignments (person-class, container-class, flight-ticket-class):
  // one entry per assignment id holding every tab's current file content, plus which tab is active.
  const [multiFilesByAssignment, setMultiFilesByAssignment] = useState<Record<number, SourceFile[]>>(() =>
    initialFiles(assignments),
  )
  const [activeFileByAssignment, setActiveFileByAssignment] = useState<Record<number, string>>(() =>
    initialActiveFile(assignments),
  )
  const [feedback, setFeedback] = useState<FeedbackBannerProps | null>(null)

  const executor = useExecutor()
  const assignmentProgress = useAssignments(assignments)
  const active = assignments[assignmentProgress.activeAssignment]

  const activeFiles = active.kind === 'code' ? multiFilesByAssignment[active.id] : undefined
  const isMultiFile = Boolean(activeFiles && activeFiles.length > 0)
  const activeFileName = activeFiles?.length ? activeFileByAssignment[active.id] ?? activeFiles[0].name : undefined

  const submission = useSubmission({
    onResult: (_submittedCode, submissionResult) => {
      if (submissionResult.result) executor.showResult(submissionResult.result)
      if (submissionResult.passed === true) assignmentProgress.complete(active.id)
    },
  })

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleSelectAssignment(id: number) {
    const index = assignments.findIndex((assignment) => assignment.id === id)
    if (index === -1) return
    assignmentProgress.setActiveAssignment(index)
    executor.reset()
    setFeedback(null)
  }

  function handleEditorChange(value: string) {
    if (isMultiFile && activeFileName) {
      setMultiFilesByAssignment((prev) => ({
        ...prev,
        [active.id]: (prev[active.id] ?? []).map((file) =>
          file.name === activeFileName ? { ...file, content: value } : file,
        ),
      }))
      return
    }
    setCodeByAssignment((prev) => ({ ...prev, [active.id]: value }))
  }

  function handleSelectFile(name: string) {
    setActiveFileByAssignment((prev) => ({ ...prev, [active.id]: name }))
  }

  function buildCodeRequest(): ExecuteRequest | null {
    if (active.kind !== 'code') return null
    if (isMultiFile) {
      return { files: activeFiles ?? [], entryClass: active.entryClass, stdin: active.stdin }
    }
    return { code: codeByAssignment[active.id] ?? '', stdin: active.stdin }
  }

  async function handleRunCode() {
    const request = buildCodeRequest()
    if (!request) return
    const data = await executor.run(request)
    if (!data) return
    // check() is only ever attached to single-file assignments — multi-file
    // (starterFiles) assignments are graded server-side on submit.
    const code = isMultiFile ? '' : codeByAssignment[active.id] ?? ''
    const verdict = assignmentProgress.grade(code, data)
    // Feedback stays up while the student edits; it is replaced on the next
    // run and cleared on assignment switch. Submission feedback lives in the modal.
    setFeedback(verdict ? { tone: verdict.passed ? 'success' : 'hint', message: verdict.message } : null)
  }

  function handleOpenSubmit() {
    submission.open()
  }

  function handleConfirmSubmit() {
    const content = isMultiFile ? activeFiles ?? [] : codeByAssignment[active.id] ?? ''
    submission.confirm(content, assignmentProgress.activeAssignmentId)
  }

  function handlePredictAnswerChange(value: string) {
    setAnswerByAssignment((prev) => ({ ...prev, [active.id]: value }))
  }

  async function handlePredictSubmit() {
    if (active.kind !== 'predict') return
    const answer = answerByAssignment[active.id] ?? ''
    try {
      const submissionResult = await submitAssignment({
        assignmentId: active.id,
        content: answer,
      })
      const correct = submissionResult.passed === true
      setStatusByAssignment((prev) => ({ ...prev, [active.id]: correct ? 'correct' : 'wrong' }))
      if (correct) assignmentProgress.complete(active.id)
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setFeedback({
        tone: 'hint',
        message: `Could not submit your answer (${reason}). Please try again.`,
      })
    }
  }

  function handlePredictRedo() {
    setStatusByAssignment((prev) => ({ ...prev, [active.id]: 'idle' }))
  }

  function handlePredictReveal() {
    setStatusByAssignment((prev) => ({ ...prev, [active.id]: 'done' }))
    assignmentProgress.complete(active.id)
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
          expectedOutput: active.expectedOutput,
          onAnswerChange: handlePredictAnswerChange,
          onSubmit: handlePredictSubmit,
          onRedo: handlePredictRedo,
          onReveal: handlePredictReveal,
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
    if (isMultiFile) {
      const activeFile = activeFiles?.find((file) => file.name === activeFileName)
      return {
        kind: 'code',
        editor: { value: activeFile?.content ?? '', onChange: handleEditorChange, path: activeFileName },
        output: { output: executor.output, status: executor.status },
        tabs: { files: activeFiles ?? [], activeFileName: activeFileName ?? '', onSelectFile: handleSelectFile },
      }
    }
    return {
      kind: 'code',
      editor: { value: codeByAssignment[active.id] ?? defaultStarter, onChange: handleEditorChange },
      output: { output: executor.output, status: executor.status },
    }
  }

  const isCodeAssignment = active.kind === 'code'

  return {
    activePanel: buildActivePanel(),
    toolbar: {
      subtitle: ACTIVE_THEME.subtitle,
      isRunning: executor.isRunning,
      isSubmitting: submission.isSubmitting,
      isRunDisabled: !isCodeAssignment,
      isSubmitDisabled: !isCodeAssignment,
      onRun: handleRunCode,
      onSubmit: handleOpenSubmit,
    },
    assignmentPanel: {
      steps,
      onSelectStep: handleSelectAssignment,
      title: active.title,
      lesson: active.lesson,
      description: active.description,
      body: active.kind === 'project' ? active.brief : undefined,
      hint: active.hint,
      feedback: feedback ?? undefined,
    },
    submitModal: {
      isOpen: submission.showSubmit,
      isSubmitting: submission.isSubmitting,
      result: submission.result,
      onConfirm: handleConfirmSubmit,
      onCancel: submission.close,
      onClose: submission.close,
    },
    scene: {
      Scene: ACTIVE_THEME.Scene,
      signals: assignmentProgress.signals,
      completedAssignments: assignmentProgress.completedAssignments,
      activeAssignment: assignmentProgress.activeAssignment,
    },
  }
}
