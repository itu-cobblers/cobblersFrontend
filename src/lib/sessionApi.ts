/**
 * Teacher session + timer endpoints. The single seam between the teacher view
 * and the backend's session API (proxied via /api). The SignalR hub that will
 * broadcast the timer to a room is planned — see the api repo's CONTRACT.md.
 */

export interface Session {
  code: string
}

/** GET /api/sessions/:code — how a joining student resolves the room's assignment set. */
export interface SessionInfo {
  code: string
  assignmentSetId: string | null
}

/** A countdown scoped to one assignment — see CONTRACT.md's Timer section. */
export interface Timer {
  endsAt: string
  assignmentId: number
}

/** POST /api/sessions → create a new room bound to an assignment set, return its join code. */
export async function createSession(assignmentSetId: string): Promise<Session> {
  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignmentSetId }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** GET /api/sessions/:code → resolve a room's assignment set (404 ⇒ no such room). */
export async function getSession(code: string): Promise<SessionInfo> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(code)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * POST /api/sessions/:code/timer → start a countdown scoped to one
 * assignment. Purely a pacing display for the room — see CONTRACT.md's
 * Timer section; it has no effect on answer reveal (submission-based end to
 * end, see the Solution section).
 */
export async function startTimer(sessionCode: string, assignmentId: number, durationMinutes: number): Promise<Timer> {
  const res = await fetch(`/api/sessions/${sessionCode}/timer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ durationMinutes, assignmentId }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * `POST /api/sessions/:code/end` — the teacher's manual "End session" action.
 * Marks the room ended server-side and fans out a `SessionEnded` broadcast
 * (see `@lib/sessionHub`) so any still-connected students bounce back to the
 * entry screen instead of being left in a dead room.
 */
export async function endSession(code: string): Promise<void> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(code)}/end`, { method: 'POST' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

/**
 * `GET /api/sessions/today-latest` — today's newest still-active room, so
 * the entry screen can offer a one-click "Join session (CODE)" instead of
 * making the student ask the teacher for, and type, a code. `null` when
 * there's no such room (nothing created today, or it's already ended) —
 * the entry screen shows a disabled "no current active session" button.
 */
export async function fetchTodayLatestSession(): Promise<SessionInfo | null> {
  try {
    const res = await fetch('/api/sessions/today-latest')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
