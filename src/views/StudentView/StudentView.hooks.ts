import { useState } from 'react'
import type { ExecuteRequest, SourceFile } from '@types'
import type {
  CodeEditorProps,
  OutputPanelProps,
  PredictPanelProps,
  PredictStatus,
  ProjectPanelProps,
  SidebarGroup,
  TaskListEntry,
} from '@components'
import { useExecutor } from '@hooks/useExecutor'
import { useTasks } from '@hooks/useTasks'
import { useSubmission } from '@hooks/useSubmission'
import { TASKS, defaultStarter } from '@lib/tasks'
import { checkPrediction } from '@lib/quizApi'
import { ACTIVE_THEME } from '@themes'

const DAY_LABELS: Record<number, string> = {
  1: 'Day 1 · Basics',
  2: 'Day 2 · Loops & Logic',
  3: 'Day 3 · Objects & Projects',
}

const noop = () => {
  /* read-only editor: changes are ignored */
}

/** The center/right area to render for the active task — discriminated by kind. */
export type ActivePanel =
  | { kind: 'code'; editor: CodeEditorProps; output: OutputPanelProps }
  | { kind: 'predict'; editor: CodeEditorProps; predict: PredictPanelProps }
  | { kind: 'project'; project: ProjectPanelProps }

/** Seed editor content for every code task from its starter. */
function initialCode(): Record<number, string> {
  const map: Record<number, string> = {}
  for (const task of TASKS) {
    if (task.kind === 'code') map[task.id] = task.starter ?? defaultStarter
  }
  return map
}

/**
 * Orchestrates the student workspace. Holds per-task editor/answer/upload state
 * and the run / task / submit hooks, and shapes the props each component
 * renders — branching by the active task's `kind`.
 */
export function useStudentWorkspace() {
  const [codeByTask, setCodeByTask] = useState<Record<number, string>>(initialCode)
  const [answerByTask, setAnswerByTask] = useState<Record<number, string>>({})
  const [statusByTask, setStatusByTask] = useState<Record<number, PredictStatus>>({})
  const [filesByTask, setFilesByTask] = useState<Record<number, SourceFile[]>>({})
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const executor = useExecutor()
  const tasks = useTasks()
  const active = TASKS[tasks.activeTask]

  const submission = useSubmission({
    onResult: (submittedCode, result) => {
      executor.showResult(result)
      if (result.accepted) tasks.grade(submittedCode, result, { forceComplete: true })
    },
  })

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleSelectTask(id: number) {
    tasks.setActiveTask(id)
    executor.reset()
  }

  function handleToggleSidebar() {
    setIsSidebarFolded((folded) => !folded)
  }

  function handleEditorChange(value: string) {
    setCodeByTask((prev) => ({ ...prev, [active.id]: value }))
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
    const code = codeByTask[active.id] ?? ''
    const request = buildCodeRequest(code)
    if (!request) return
    const data = await executor.run(request)
    if (data) tasks.grade(code, data)
  }

  function handleOpenSubmit() {
    submission.open()
  }

  function handleConfirmSubmit() {
    submission.confirm(codeByTask[active.id] ?? '', tasks.activeTaskId)
  }

  function handlePredictAnswerChange(value: string) {
    setAnswerByTask((prev) => ({ ...prev, [active.id]: value }))
  }

  async function handlePredictSubmit() {
    if (active.kind !== 'predict') return
    const answer = answerByTask[active.id] ?? ''
    const { correct } = await checkPrediction({
      taskId: active.id,
      answer,
      expectedOutput: active.expectedOutput,
      accept: active.accept,
    })
    setStatusByTask((prev) => ({ ...prev, [active.id]: correct ? 'correct' : 'wrong' }))
    if (correct) tasks.complete(active.id)
  }

  function handlePredictUnderstood() {
    setStatusByTask((prev) => ({ ...prev, [active.id]: 'done' }))
    tasks.complete(active.id)
  }

  function handleProjectFilesChange(files: SourceFile[]) {
    setFilesByTask((prev) => ({ ...prev, [active.id]: files }))
  }

  async function handleProjectRun() {
    if (active.kind !== 'project') return
    const files = filesByTask[active.id] ?? []
    if (files.length === 0) return
    const data = await executor.run({ files, entryClass: active.entryClass ?? 'Main' })
    if (data?.status === 'success') tasks.complete(active.id)
  }

  // ── display-ready props ─────────────────────────────────────────────────────
  const toEntry = (id: number, title: string, difficulty: TaskListEntry['difficulty']): TaskListEntry => ({
    id,
    title,
    difficulty,
    isActive: id === tasks.activeTaskId,
    isDone: tasks.completedTasks.has(id),
  })

  const groups: SidebarGroup[] = [1, 2, 3].map((day) => ({
    day,
    label: DAY_LABELS[day],
    items: TASKS.filter((task) => task.day === day).map((task) =>
      toEntry(task.id, task.title, task.difficulty),
    ),
  }))

  function buildActivePanel(): ActivePanel {
    if (active.kind === 'predict') {
      return {
        kind: 'predict',
        editor: { value: active.snippet, onChange: noop, isReadOnly: true },
        predict: {
          answer: answerByTask[active.id] ?? '',
          status: statusByTask[active.id] ?? 'idle',
          expectedOutput: active.expectedOutput,
          hint: active.hint,
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
          brief: active.brief,
          files: filesByTask[active.id] ?? [],
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
      editor: { value: codeByTask[active.id] ?? defaultStarter, onChange: handleEditorChange },
      output: { output: executor.output, status: executor.status },
    }
  }

  const isCodeTask = active.kind === 'code'

  return {
    activePanel: buildActivePanel(),
    toolbar: {
      subtitle: ACTIVE_THEME.subtitle,
      isRunning: executor.isRunning,
      isSubmitting: submission.isSubmitting,
      isRunDisabled: !isCodeTask,
      isSubmitDisabled: !isCodeTask,
      onToggleSidebar: handleToggleSidebar,
      onRun: handleRunCode,
      onSubmit: handleOpenSubmit,
    },
    sidebar: {
      groups,
      detail: { title: active.title, description: active.description, hint: active.hint },
      progress: { completed: tasks.completedTasks.size, total: TASKS.length },
      isFolded: isSidebarFolded,
      onSelect: handleSelectTask,
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
      signals: tasks.signals,
      completedTasks: tasks.completedTasks,
      activeTask: tasks.activeTask,
    },
  }
}
