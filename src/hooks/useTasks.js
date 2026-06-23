import { useState } from 'react'
import { TASKS } from '../lib/tasks'

/**
 * Owns task selection, completion progress, and the theme-agnostic `signals`
 * bag tasks broadcast on success.
 *
 * Returns:
 *  - activeTask, setActiveTask, completedTasks, signals — UI state
 *  - activeTaskId — convenience id of the active task
 *  - grade(code, result, { forceComplete }) → grades a run/submit result
 *    against the active task's own check() (src/lib/tasks.js). Marks the task
 *    complete when it passes — or when forceComplete is set (e.g. the backend
 *    accepted a submission) — and merges any signals the task emits.
 */
export function useTasks() {
  const [activeTask, setActiveTask] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [signals, setSignals] = useState({})

  function grade(code, result, { forceComplete = false } = {}) {
    const task = TASKS[activeTask]
    if (!task) return
    // The check() boundary speaks { code, output, stderr, exitCode }; map the
    // contract shape onto it (status → exitCode) so tasks.js stays untouched.
    const verdict = task.check?.({
      code,
      output: result.stdout ?? '',
      stderr: result.stderr ?? '',
      exitCode: result.status === 'success' ? 0 : 1,
    })
    if (verdict?.passed || forceComplete) {
      setCompletedTasks((prev) => new Set(prev).add(task.id))
      if (verdict?.signals) setSignals((prev) => ({ ...prev, ...verdict.signals }))
    }
  }

  return {
    activeTask,
    setActiveTask,
    completedTasks,
    signals,
    activeTaskId: TASKS[activeTask]?.id,
    grade,
  }
}
