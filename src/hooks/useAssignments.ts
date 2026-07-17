import { useState } from 'react'
import type { ExecuteResult, Signals, Assignment } from '@types'

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
  /** Grade a code assignment's run result against its check() and complete it if it passes. */
  grade: (code: string, result: ExecuteResult, options?: GradeOptions) => void
  /** Force-complete an assignment (predict "I understand now", project run, accepted submission). */
  complete: (assignmentId: number, signals?: Signals) => void
}

/**
 * Owns assignment selection, completion progress, and the theme-agnostic `signals`
 * bag. Grades against the `assignments` it's given (the active assignment set). Grading for
 * code assignments runs the assignment's own check() (assignments.ts); predict and project assignments
 * complete via `complete()`.
 */
export function useAssignments(assignments: Assignment[]): UseAssignments {
  const [activeAssignment, setActiveAssignment] = useState(0)
  const [completedAssignments, setCompletedAssignments] = useState<Set<number>>(new Set())
  const [signals, setSignals] = useState<Signals>({})

  function complete(assignmentId: number, newSignals?: Signals) {
    setCompletedAssignments((prev) => new Set(prev).add(assignmentId))
    if (newSignals) setSignals((prev) => ({ ...prev, ...newSignals }))
  }

  function grade(code: string, result: ExecuteResult, { forceComplete = false }: GradeOptions = {}) {
    const assignment = assignments[activeAssignment]
    if (!assignment) return
    if (assignment.kind !== 'code') {
      if (forceComplete) complete(assignment.id)
      return
    }
    // The check() boundary speaks { code, output, stderr, exitCode }; map the
    // contract shape onto it (status → exitCode) so assignments.ts stays untouched.
    const verdict = assignment.check?.({
      code,
      output: result.stdout ?? '',
      stderr: result.stderr ?? '',
      exitCode: result.status === 'success' ? 0 : 1,
    })
    if (verdict?.passed || forceComplete) complete(assignment.id, verdict?.signals)
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
