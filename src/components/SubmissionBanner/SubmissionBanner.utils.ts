import type { SubmissionHistoryItem } from '@types'

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
