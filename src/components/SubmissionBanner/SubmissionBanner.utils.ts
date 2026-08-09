import type { ExecuteResult, SubmissionHistoryItem } from '@types'
import type { ProblemStatus } from '@components/StatusBadge'

/**
 * Which attempt this is, counting from the student's first. History arrives
 * newest-first, so this sorts ascending rather than trusting the given order.
 * Returns 0 when the submission isn't in the list.
 */
export function getSubmissionNumber(
  history: SubmissionHistoryItem[],
  assignmentId: number,
  subId: string,
): number {
  const forAssignment = history
    .filter((item) => item.assignmentId === assignmentId)
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
  return forAssignment.findIndex((item) => item.subId === subId) + 1
}

/**
 * Mirrors the backend's `SubmissionService.DeriveStatus`: a compile/runtime
 * error wins regardless of `passed` (the code never ran correctly either
 * way); otherwise `passed !== false` — an ungraded submission (null) reads
 * as passed, same convention as `SubmissionRow`.
 */
export function deriveSubmissionStatus(passed: boolean | null, result: ExecuteResult | null): ProblemStatus {
  if (result?.status === 'compile_error' || result?.status === 'runtime_error') {
    return 'error'
  }
  return passed !== false ? 'passed' : 'tried'
}
