import { useMemo, useState } from 'react'
import type { ExecuteResult, Signals, Assignment, Verdict } from '@types'

interface GradeOptions {
  /** Mark complete regardless of check() — e.g. the backend accepted a submission. */
  forceComplete?: boolean
}

export interface UseAssignments {
  activeAssignment: number
  setActiveAssignment: (index: number) => void
  completedAssignments: Set<number>
  signals: Signals
  /** Convenience id of the active assignment. */
  activeAssignmentId: number | undefined
  /**
   * Grade a code assignment's run result against its check() and complete it if
   * it passes. Returns the verdict so the caller can surface its `message`
   * (null for non-code assignments or when there is no check).
   */
  grade: (code: string, result: ExecuteResult, options?: GradeOptions) => Verdict | null
  /** Force-complete an assignment (predict "I understand now", project run, accepted submission). */
  complete: (assignmentId: number, signals?: Signals) => void
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
 */
export function useAssignments(assignments: Assignment[], initiallyCompleted: number[] = []): UseAssignments {
  const [activeAssignment, setActiveAssignment] = useState(0)
  const [locallyCompleted, setLocallyCompleted] = useState<Set<number>>(new Set())
  const [signals, setSignals] = useState<Signals>({})

  const completedAssignments = useMemo(() => {
    if (initiallyCompleted.length === 0) return locallyCompleted
    return new Set([...locallyCompleted, ...initiallyCompleted])
  }, [locallyCompleted, initiallyCompleted])

  function complete(assignmentId: number, newSignals?: Signals) {
    setLocallyCompleted((prev) => new Set(prev).add(assignmentId))
    if (newSignals) setSignals((prev) => ({ ...prev, ...newSignals }))
  }

  function grade(code: string, result: ExecuteResult, { forceComplete = false }: GradeOptions = {}): Verdict | null {
    const assignment = assignments[activeAssignment]
    if (!assignment) return null
    if (assignment.kind !== 'code') {
      if (forceComplete) complete(assignment.id)
      return null
    }
    // The check() boundary speaks { code, output, stderr, exitCode }; map the
    // contract shape onto it (status → exitCode).
    const verdict = assignment.check?.({
      code,
      output: result.stdout ?? '',
      stderr: result.stderr ?? '',
      exitCode: result.status === 'success' ? 0 : 1,
    })
    if (verdict?.passed || forceComplete) complete(assignment.id, verdict?.signals)
    return verdict ?? null
  }

  return {
    activeAssignment,
    setActiveAssignment,
    completedAssignments,
    signals,
    activeAssignmentId: assignments[activeAssignment]?.id,
    grade,
    complete,
  }
}
