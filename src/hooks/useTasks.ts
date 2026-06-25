import { useState } from 'react'
import type { ExecuteResult, Signals } from '@types'
import { TASKS } from '@lib/tasks'

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
  grade: (code: string, result: ExecuteResult, options?: GradeOptions) => void
}

/**
 * Owns task selection, completion progress, and the theme-agnostic `signals`
 * bag tasks broadcast on success. Grading runs the active task's own check()
 * (src/lib/tasks.ts), so this hook holds no task-specific logic.
 */
export function useTasks(): UseTasks {
  const [activeTask, setActiveTask] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())
  const [signals, setSignals] = useState<Signals>({})

  function grade(code: string, result: ExecuteResult, { forceComplete = false }: GradeOptions = {}) {
    const task = TASKS[activeTask]
    if (!task) return
    // The check() boundary speaks { code, output, stderr, exitCode }; map the
    // contract shape onto it (status → exitCode) so tasks.ts stays untouched.
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
