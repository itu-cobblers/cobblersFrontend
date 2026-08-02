/** e.g. "Jul 24, 14:30" — compact enough for a list of attempts. */
export function formatAttemptTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** "Solo" for a practice submission, otherwise the room's join code. */
export function describeSource(sessionId: string | null | undefined): string {
  return sessionId ? `Room ${sessionId}` : 'Solo'
}
