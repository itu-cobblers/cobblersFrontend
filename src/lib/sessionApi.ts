/**
 * Teacher session + timer endpoints. The single seam between the teacher view
 * and the backend's session API (proxied via /api). The SignalR hub that will
 * broadcast the timer to a room is planned — see the api repo's CONTRACT.md.
 */

export interface Session {
  code: string
}

export interface Timer {
  endsAt: string
}

/** POST /api/sessions → create a new room and return its join code. */
export async function createSession(): Promise<Session> {
  const res = await fetch('/api/sessions', { method: 'POST' })
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
