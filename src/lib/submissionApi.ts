import type { SourceFile, SubmissionResult, SubmissionHistoryItem } from '@types'
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
export async function submitAssignment({
  assignmentId,
  content,
  sessionCode,
}: {
  assignmentId: number
  code: string | SourceFile[]
    sessionCode?: string
}): Promise<SubmissionResult> {
    const body: { studentId: string; sessionId?: string; content: string } = {
        studentId: getStudentId(),
        content,
    }
    if (sessionCode) body.sessionId = sessionCode

  const res = await fetch(`/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}

/**
 * `GET /api/students/{studentId}/submissions` (CONTRACT.md "Submission
 * history") — every submission this student has ever made, across all 3 days
 * and both solo/room modes. Drives the "My Progress" review panel and the
 * cross-reload/cross-day completed-assignment state.
 *
 * ⚠️ Not implemented on the backend yet (see STORIES.md S5) — this resolves
 * to `[]` on any failure (network error, 404, ...) so the rest of the app
 * behaves exactly as if the student had no history yet, instead of breaking.
 * Remove this fallback once the endpoint is live and 404 no longer means
 * "not built" vs. "genuinely no submissions".
 */
export async function fetchSubmissionHistory(studentId: string): Promise<SubmissionHistoryItem[]> {
  try {
    const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/submissions`)
    if (!res.ok) return []
    return (await res.json()) as SubmissionHistoryItem[]
  } catch {
    return []
  }
}
