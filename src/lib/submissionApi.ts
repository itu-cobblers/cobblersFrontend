import type { SubmissionResult } from '@types'
import { getStudentId } from './identity'

/**
 * Submits a finished assignment attempt to the teacher. The single seam to
 * POST /api/submission.
 *
 * ⚠️ The submission contract is still an OPEN DECISION in the api repo's
 * CONTRACT.md. This is the frontend's working assumption — reconcile the exact
 * shape with the backend member before launch:
 *
 *   request:  { studentId, assignmentId, code }
 *   response: { status, stdout, stderr, accepted, message }
 */
export async function submitCode({
  assignmentId,
  code,
}: {
  assignmentId: number
  code: string
}): Promise<SubmissionResult> {
  const res = await fetch('/api/submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: getStudentId(), assignmentId, code }),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}
