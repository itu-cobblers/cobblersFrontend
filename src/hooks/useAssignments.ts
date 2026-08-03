import { useMemo, useState } from 'react'
import type { Assignment } from '@types'


export interface UseAssignments {
  activeAssignment: number
  setActiveAssignment: (index: number) => void
  completedAssignments: Set<number>
  activeAssignmentId: number | undefined
  complete: (assignmentId: number) => void
}

/**
 * Owns assignment selection, completion progress, and the theme-agnostic `signals`
 * bag. Grades against the `assignments` it's given (the active assignment set). Grading for
 * code assignments may run an optional client-side check(); predict and project assignments
 * complete via `complete()`.
 *
 * `initiallyCompleted` (e.g. from `GET /api/students/{studentId}/submissions`)
 * seeds "already passed" assignments — a reload or a return visit the next
 * day still shows yesterday's passes as done. It's merged in via `useMemo`,
 * not copied into state on mount, because it's fetched async and may resolve
 * *after* this hook's first render — a one-time seed would miss it.
 *
 * `initialActiveIndex` seeds which assignment starts selected (e.g. restoring
 * a persisted selection after a refresh) — read once via `useState`'s lazy
 * initializer, same as any other mount-time seed.
 */
export function useAssignments(assignments: Assignment[], initiallyCompleted: number[] = [], initialActiveIndex = 0): UseAssignments {
  const [activeAssignment, setActiveAssignment] = useState(initialActiveIndex)
  const [locallyCompleted, setLocallyCompleted] = useState<Set<number>>(new Set())

  const completedAssignments = useMemo(() => {
    if (initiallyCompleted.length === 0) return locallyCompleted
    return new Set([...locallyCompleted, ...initiallyCompleted])
  }, [locallyCompleted, initiallyCompleted])

  function complete(assignmentId: number) {
    setLocallyCompleted((prev) => new Set(prev).add(assignmentId))
  }

  return {
    activeAssignment,
    setActiveAssignment,
    completedAssignments,
    activeAssignmentId: assignments[activeAssignment]?.id,
    complete,
  }
}
