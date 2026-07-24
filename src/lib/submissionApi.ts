import type { SubmissionResult } from '@types'
import { getStudentId } from './identity'

/**
 * Submits a finished assignment attempt. The single seam to
 * POST /api/assignments/{assignmentId}/submissions (see CONTRACT.md).
 *
 *   request:  { studentId, content } (+ optional sessionId when in a room)
 *   response: { subId, passed, result, submittedAt }
 *
 * `content` is the student's Java source for `code`, their typed prediction for
 * `predict`, or (later) a file list for `project`. Server-side GradingJson
 * decides `passed` — including predict's `{ "predict": { compare, expectedOutput } }`.
 */
export async function submitAssignment({
  assignmentId,
  content,
}: {
  assignmentId: number
  content: string
}): Promise<SubmissionResult> {
  const res = await fetch(`/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: getStudentId(), content }),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}
