import { useState } from 'react'
import type { ExecuteRequest, SourceFile, Assignment, AssignmentSet } from '@types'
import type {
  CodeEditorProps,
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
import { defaultStarter } from '@lib/assignments'
import { checkPrediction } from '@lib/quizApi'
import { ACTIVE_THEME } from '@themes'

const noop = () => {
  /* read-only editor: changes are ignored */
}

/** The center/right area to render for the active assignment — discriminated by kind. */
export type ActivePanel =
  | { kind: 'code'; editor: CodeEditorProps; output: OutputPanelProps }
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
  const [feedback, setFeedback] = useState<FeedbackBannerProps | null>(null)

  const executor = useExecutor()
  const assignmentProgress = useAssignments(assignments)
  const active = assignments[assignmentProgress.activeAssignment]

  const submission = useSubmission({
    onResult: (submittedCode, result) => {
      executor.showResult(result)
      if (result.accepted) assignmentProgress.grade(submittedCode, result, { forceComplete: true })
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
    // run and cleared on assignment switch. Submission feedback lives in the modal.
    setFeedback(verdict ? { tone: verdict.passed ? 'success' : 'hint', message: verdict.message } : null)
  }

  function handleOpenSubmit() {
    submission.open()
  }

  function handleConfirmSubmit() {
    submission.confirm(codeByAssignment[active.id] ?? '', assignmentProgress.activeAssignmentId)
  }

  function handlePredictAnswerChange(value: string) {
    setAnswerByAssignment((prev) => ({ ...prev, [active.id]: value }))
  }

  async function handlePredictSubmit() {
    if (active.kind !== 'predict') return
    const answer = answerByAssignment[active.id] ?? ''
    const { correct } = await checkPrediction({
      assignmentId: active.id,
      answer,
      expectedOutput: active.expectedOutput,
      accept: active.accept,
    })
    setStatusByAssignment((prev) => ({ ...prev, [active.id]: correct ? 'correct' : 'wrong' }))
    if (correct) assignmentProgress.complete(active.id)
  }

  function handlePredictUnderstood() {
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
          onUnderstood: handlePredictUnderstood,
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
