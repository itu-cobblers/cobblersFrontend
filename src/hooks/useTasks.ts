import { useState } from 'react'
import type { ExecuteResult, Signals, Task } from '@types'

interface GradeOptions {
  /** Mark complete regardless of check() — e.g. the backend accepted a submission. */
  forceComplete?: boolean
}

export interface UseTasks {
  activeTask: number
  setActiveTask: (index: number) => void
  completedTasks: Set<number>
  signals: Signals
  /** Convenience id of the active task. */
  activeTaskId: number | undefined
  /** Grade a code task's run result against its check() and complete it if it passes. */
  grade: (code: string, result: ExecuteResult, options?: GradeOptions) => void
  /** Force-complete a task (predict "I understand now", project run, accepted submission). */
  complete: (taskId: number, signals?: Signals) => void
}

/**
 * Owns task selection, completion progress, and the theme-agnostic `signals`
 * bag. Grades against the `tasks` it's given (the active taskset). Grading for
 * code tasks runs the task's own check() (tasks.ts); predict and project tasks
 * complete via `complete()`.
 */
export function useTasks(tasks: Task[]): UseTasks {
  const [activeTask, setActiveTask] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())
  const [signals, setSignals] = useState<Signals>({})

  function complete(taskId: number, newSignals?: Signals) {
    setCompletedTasks((prev) => new Set(prev).add(taskId))
    if (newSignals) setSignals((prev) => ({ ...prev, ...newSignals }))
  }

  function grade(code: string, result: ExecuteResult, { forceComplete = false }: GradeOptions = {}) {
    const task = tasks[activeTask]
    if (!task) return
    if (task.kind !== 'code') {
      if (forceComplete) complete(task.id)
      return
    }
    // The check() boundary speaks { code, output, stderr, exitCode }; map the
    // contract shape onto it (status → exitCode) so tasks.ts stays untouched.
    const verdict = task.check?.({
      code,
      output: result.stdout ?? '',
      stderr: result.stderr ?? '',
      exitCode: result.status === 'success' ? 0 : 1,
    })
    if (verdict?.passed || forceComplete) complete(task.id, verdict?.signals)
  }

  return {
    activeTask,
    setActiveTask,
    completedTasks,
    signals,
    activeTaskId: tasks[activeTask]?.id,
    grade,
    complete,
  }
}
