import { getStudentId } from './identity'

/**
 * Ensures the anonymous student exists server-side before submissions.
 * Seam to `PUT /api/students/{studentId}` (displayName is a label, not auth).
 */
export async function upsertStudent(displayName: string): Promise<void> {
  const studentId = getStudentId()
  const res = await fetch(`/api/students/${encodeURIComponent(studentId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName }),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
}
