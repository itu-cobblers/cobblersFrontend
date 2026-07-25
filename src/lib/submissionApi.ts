import type { SourceFile, SubmissionResult } from '@types'
import { getStudentId } from './identity'

/**
 * Submits a finished assignment attempt. The single seam to
 * POST /api/assignments/{assignmentId}/submissions (see CONTRACT.md).
 *
 *   request:  { studentId, content } (+ optional sessionId when in a room)
 *   response: { subId, passed, result, submittedAt }
 *
 * `content` is the student's Java source for single-file `code` assignments,
 * their typed prediction for `predict`, or a `{ name, content }[]` file list
 * for multi-file `code` assignments (Day-3 class-authoring — `person-class`,
 * `container-class`, `flight-ticket-class` — one entry per tab). Server-side
 * GradingJson decides `passed` — including predict's
 * `{ "predict": { compare, expectedOutput } }`.
 */
export async function submitAssignment({
  assignmentId,
  content,
}: {
  assignmentId: number
  content: string | SourceFile[]
}): Promise<SubmissionResult> {
  const res = await fetch(`/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: getStudentId(), content }),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}
