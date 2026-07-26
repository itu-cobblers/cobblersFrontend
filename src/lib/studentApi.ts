import { getStudentId } from './identity'

/**
 * `PUT /api/students/{studentId}` — upserts the student's display name
 * server-side (CONTRACT.md "Identity"). Must succeed at least once before any
 * `Submission` can be written — the backend's `SubmissionService` rejects a
 * `studentId` it doesn't recognize (see api repo CLAUDE.md).
 *
 * Best-effort by design: a hiccup here shouldn't block a student from
 * reaching the IDE. If it silently fails, the first real submission will
 * surface the problem (a 400 the submit flow already renders as
 * "not submitted"), which is an acceptable degrade for a 3-day workshop.
 */
export async function upsertStudent(displayName: string): Promise<void> {
  try {
    await fetch(`/api/students/${encodeURIComponent(getStudentId())}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName }),
    })
  } catch (err) {
    console.warn('[studentApi] upsert failed:', err instanceof Error ? err.message : String(err))
  }
}
