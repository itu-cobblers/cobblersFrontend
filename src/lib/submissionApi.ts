import type { SourceFile, SubmissionResult, SubmissionHistoryItem, SolutionResult, SubmissionDetails } from '@types'
import { getStudentId } from './identity'

/**
 * Submits a finished assignment attempt to the teacher. The single seam to
 * POST /api/submission.
 *
 * ⚠️ The submission contract is still an OPEN DECISION in the api repo's
 * CONTRACT.md. This is the frontend's working assumption — reconcile the exact
 * shape with the backend member before launch:
 *
 *   request:  { studentId, assignmentId, content }
 *   response: { status, stdout, stderr, accepted, message }
 */
export async function submitAssignment({
  assignmentId,
  content,
  sessionCode,
}: {
  assignmentId: number
  content: string | SourceFile[]
  sessionCode?: string
}): Promise<SubmissionResult> {
  const body: { studentId: string; sessionId?: string; content: string | SourceFile[] } = {
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

export async function fetchSubmissionDetailsById(submissionId: string): Promise<SubmissionDetails | null> {
  const res = await fetch(`/api/submissions/${submissionId}`)
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`API returned ${res.status}`)
  }
  return (await res.json()) as SubmissionDetails
}

/**
 * `GET /api/assignments/{assignmentId}/solution` (CONTRACT.md "Solution") —
 * returns a code/project assignment's reference solution from
 * `SampleSolutionJson`. Reveal gating (submit first) is enforced in the view
 * layer, not here. Degrades to `{ solution: null }` on any failure so the
 * reveal button simply shows nothing instead of breaking the app.
 */
export async function fetchAssignmentSolution(assignmentId: number): Promise<SolutionResult> {
  try {
    const res = await fetch(`/api/assignments/${assignmentId}/solution`)
    if (!res.ok) return { solution: null }
    return (await res.json()) as SolutionResult
  } catch {
    return { solution: null }
  }
}
