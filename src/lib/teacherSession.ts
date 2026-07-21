/**
 * Persists the teacher's active room code (and last-known timer end time) so
 * a page refresh resumes the same active-session view instead of dropping
 * back to the Browse screen. Roster and assignment-set content are always
 * re-fetched live on rehydrate (see useTeacherSession's rehydrate effect).
 */
const KEY = 'bootit.teacherSession'

export interface PersistedTeacherSession {
  code: string
  timerEndsAt: string | null
}

export function getPersistedTeacherSession(): PersistedTeacherSession | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || !('code' in parsed) || typeof parsed.code !== 'string') {
      return null
    }
    const timerEndsAt = 'timerEndsAt' in parsed && typeof parsed.timerEndsAt === 'string' ? parsed.timerEndsAt : null
    return { code: parsed.code, timerEndsAt }
  } catch {
    return null
  }
}

export function setPersistedTeacherSession(session: PersistedTeacherSession): void {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function clearPersistedTeacherSession(): void {
  localStorage.removeItem(KEY)
}
