import type { ProblemListItem } from './ProblemsList.types'

/** "3/40" — how many assignments are passed, out of the whole set. */
export function formatPassedRatio(items: ProblemListItem[]): string {
  const passed = items.filter((item) => item.status === 'passed').length
  return `${passed}/${items.length}`
}

/**
 * e.g. "Jul 24, 2026 at 14:30" — for a submission list, where the reader is
 * placing an attempt in time rather than scanning. Renders in the reader's own
 * locale and timezone, so it never shows a raw UTC stamp.
 */
export function formatSubmittedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${day} at ${time}`
}

/** e.g. "Jul 24, 14:30" — compact enough for a list of attempts. */
export function formatAttemptTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/** "Solo" for a practice submission, otherwise the room's join code. */
export function describeSource(sessionId: string | null | undefined): string {
  return sessionId ? `Room ${sessionId}` : 'Solo'
}

/** "Ends 14:30" while a timer runs — 24-hour, matching the submission stamps. Used by the teacher rail. */
export function formatTimerEnds(endsAt: string): string {
  const end = new Date(endsAt)
  if (Number.isNaN(end.getTime())) return endsAt
  return `Ends ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}`
}

/** "Move to next at 14:30" — the student rail's footer prompt while a timer runs; a session-wide nudge, not tied to any one assignment. */
export function formatMoveToNext(endsAt: string): string {
  const end = new Date(endsAt)
  if (Number.isNaN(end.getTime())) return endsAt
  return `Move to next at ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}`
}
