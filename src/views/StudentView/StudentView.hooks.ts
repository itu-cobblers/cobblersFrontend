import { useState } from 'react'
import type { TaskListEntry } from '@components'
import { useExecutor } from '@hooks/useExecutor'
import { useTasks } from '@hooks/useTasks'
import { useSubmission } from '@hooks/useSubmission'
import { TASKS, defaultStarter } from '@lib/tasks'
import { ACTIVE_THEME } from '@themes'

const STARTER = TASKS[0]?.starter ?? defaultStarter

/**
 * Orchestrates the student workspace: code + sidebar UI state and the run / task
 * / submit hooks. Also shapes the data each component renders, so StudentView's
 * JSX stays declarative.
 */
export function useStudentWorkspace() {
  const [code, setCode] = useState(STARTER)
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const executor = useExecutor()
  const tasks = useTasks()
  const submission = useSubmission({
    // On a submission result: mirror it in the terminal, and complete the
    // active task if the backend accepted it.
    onResult: (submittedCode, result) => {
      executor.showResult(result)
      if (result.accepted) tasks.grade(submittedCode, result, { forceComplete: true })
    },
  })

  async function handleRun() {
    const data = await executor.run(code)
    if (data) tasks.grade(code, data)
  }

  function handleToggleSidebar() {
    setIsSidebarFolded((folded) => !folded)
  }

  function handleSelectTask(id: number) {
    tasks.setActiveTask(id)
  }

  function handleOpenSubmit() {
    submission.open()
  }

  function handleConfirmSubmit() {
    submission.confirm(code, tasks.activeTaskId)
  }

  const items: TaskListEntry[] = TASKS.map((task) => ({
    id: task.id,
    title: task.title,
    difficulty: task.difficulty,
    isActive: task.id === tasks.activeTaskId,
    isDone: tasks.completedTasks.has(task.id),
  }))

  const current = TASKS[tasks.activeTask]
  const detail = {
    title: current.title,
    description: current.description,
    hint: current.hint,
  }

  return {
    editor: { value: code, onChange: setCode },
    output: { output: executor.output, status: executor.status },
    toolbar: {
      subtitle: ACTIVE_THEME.subtitle,
      isRunning: executor.isRunning,
      isSubmitting: submission.isSubmitting,
      onToggleSidebar: handleToggleSidebar,
      onRun: handleRun,
      onSubmit: handleOpenSubmit,
    },
    sidebar: {
      items,
      detail,
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
