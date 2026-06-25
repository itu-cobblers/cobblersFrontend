/** Localized clock time for a timer's ISO end timestamp. */
export function formatTimerEnds(endsAt: string): string {
  return new Date(endsAt).toLocaleTimeString()
}
