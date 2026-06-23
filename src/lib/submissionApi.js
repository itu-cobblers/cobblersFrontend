import { mockSubmit } from './mockApi' // MOCK: remove with the fallback branch below
import { getStudentId } from './identity'

/**
 * Submits a finished task attempt to the teacher. The single seam to
 * POST /api/submission.
 *
 * ⚠️ The submission contract is still an OPEN DECISION in the api repo's
 * CONTRACT.md. This is the frontend's working assumption — reconcile the exact
 * shape with the backend member before launch:
 *
 *   request:  { studentId, taskId, code }
 *   response: { status: 'success' | 'compile_error' | 'runtime_error',
 *               stdout: string,
 *               stderr: string,
 *               accepted: boolean,   // did the submission satisfy the task?
 *               message: string }    // beginner-friendly feedback to show
 *
 * @param {{ taskId: string, code: string }} args
 * @returns {Promise<{ status: string, stdout: string, stderr: string, accepted: boolean, message: string }>}
 */
export async function submitCode({ taskId, code }) {
  try {
    const res = await fetch('/api/submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: getStudentId(), taskId, code }),
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    return await res.json()
  } catch (err) {
    // ─────────────── MOCK FALLBACK — remove when the backend is ready ───────────────
    // Delete this catch block, the `mockSubmit` import above, and mockApi.js.
    console.warn('[submit] backend unavailable, using mock:', err.message)
    return mockSubmit()
    // ──────────────────────────── END MOCK FALLBACK ─────────────────────────────────
  }
}
