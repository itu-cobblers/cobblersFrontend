/** "Ends 14:30" while a timer runs — 24-hour, matching the submission stamps. */
export function formatTimerEnds(endsAt: string): string {
  const end = new Date(endsAt)
  if (Number.isNaN(end.getTime())) return endsAt
  return `Ends ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}`
}
