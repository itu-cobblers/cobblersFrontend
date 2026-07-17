import type { SubmissionResult } from '@types'
import { mockSubmit } from './mockApi' // MOCK: remove with the fallback branch below
import { getStudentId } from './identity'

/**
 * Submits a finished assignment attempt to the teacher. The single seam to
 * POST /api/submission.
 *
 * ⚠️ The submission contract is still an OPEN DECISION in the api repo's
 * CONTRACT.md. This is the frontend's working assumption — reconcile the exact
 * shape with the backend member before launch. Note the wire field keeps the
 * contract's "task" naming (`taskId`) even though the frontend says assignment:
 *
 *   request:  { studentId, taskId, code }
 *   response: { status, stdout, stderr, accepted, message }
 */
export async function submitCode({
  assignmentId,
  code,
}: {
  assignmentId: number
  code: string
}): Promise<SubmissionResult> {
  try {
    const res = await fetch('/api/submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: getStudentId(), taskId: assignmentId, code }),
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    return await res.json()
  } catch (err) {
    // ─────────────── MOCK FALLBACK — remove when the backend is ready ───────────────
    // Delete this catch block, the `mockSubmit` import above, and mockApi.ts.
    const reason = err instanceof Error ? err.message : String(err)
    console.warn('[submit] backend unavailable, using mock:', reason)
    return mockSubmit()
    // ──────────────────────────── END MOCK FALLBACK ─────────────────────────────────
  }
}
