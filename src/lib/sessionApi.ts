/**
 * Teacher session + timer endpoints. The single seam between the teacher view
 * and the backend's session API (proxied via /api). The SignalR hub that will
 * broadcast the timer to a room is planned — see the api repo's CONTRACT.md.
 */
import type { ResumeSuggestion } from '@types'

export interface Session {
  code: string
}

/** GET /api/sessions/:code — how a joining student resolves the room's assignment set. */
export interface SessionInfo {
  code: string
  assignmentSetId: string | null
}

export interface Timer {
  endsAt: string
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

/** POST /api/sessions/:code/timer → start a countdown for the room. */
export async function startTimer(sessionCode: string, durationMinutes: number): Promise<Timer> {
  const res = await fetch(`/api/sessions/${sessionCode}/timer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ durationMinutes }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * `GET /api/students/{studentId}/resume-suggestion` (CONTRACT.md "Resume
 * suggestion (planned)") — the most recently created room this student
 * hasn't already attended, so a returning student can be offered "today's"
 * session instead of asking the teacher for a new code.
 *
 * ⚠️ Not implemented on the backend yet (see STORIES.md S9) — resolves to
 * `null` ("nothing to suggest") on any failure, so the welcome-back banner
 * simply never appears until the endpoint exists, instead of breaking entry.
 */
export async function fetchResumeSuggestion(studentId: string): Promise<ResumeSuggestion | null> {
  try {
    const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/resume-suggestion`)
    if (!res.ok) return null
    const data = (await res.json()) as { suggested: ResumeSuggestion | null }
    return data.suggested
  } catch {
    return null
  }
}
