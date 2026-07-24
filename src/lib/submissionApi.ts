import type { SubmissionResult } from '@types'
import { getStudentId } from './identity'

/**
 * Submits a finished assignment attempt to the teacher. The single seam to
 * POST /api/assignments/{assignmentId}/submissions (see CONTRACT.md).
 *
 *   request:  { studentId, content } (+ optional sessionId when in a room)
 *   response: { subId, passed, result, submittedAt }
 */
export async function submitCode({
  assignmentId,
  code,
}: {
  assignmentId: number
  code: string
}): Promise<SubmissionResult> {
  const res = await fetch(`/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: getStudentId(), content: code }),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}
