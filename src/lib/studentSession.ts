/**
 * Persists which session a student is currently in (joined room code, or solo
 * practice) so a page refresh resumes the same view instead of dropping back
 * to the entry screen. Only the join-state pointer is persisted — assignment
 * content is always re-fetched live (see useStudentSession's rehydrate effect).
 */
const KEY = 'bootit.studentSession'

export type PersistedStudentSession = { mode: 'join'; code: string } | { mode: 'solo' }

export function getPersistedStudentSession(): PersistedStudentSession | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || !('mode' in parsed)) return null
    if (parsed.mode === 'solo') return { mode: 'solo' }
    if (parsed.mode === 'join' && 'code' in parsed && typeof parsed.code === 'string') {
      return { mode: 'join', code: parsed.code }
    }
    return null
  } catch {
    return null
  }
}

export function setPersistedStudentSession(session: PersistedStudentSession): void {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function clearPersistedStudentSession(): void {
  localStorage.removeItem(KEY)
}
