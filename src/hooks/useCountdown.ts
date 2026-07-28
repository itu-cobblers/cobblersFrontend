import { useEffect, useReducer } from 'react'

/**
 * Ticks once a second against an absolute `endsAt` (ISO string), for the
 * per-assignment room timer (see @lib/sessionHub's `Timer`). `null` means "no
 * countdown to show" — callers pass `null` when the active timer doesn't
 * belong to the assignment currently on screen.
 *
 * The remaining time is derived fresh from `endsAt`/`Date.now()` on every
 * render rather than mirrored into its own state (which would need a
 * synchronous effect-body `setState` to stay in sync with prop changes) — the
 * effect only forces a re-render once a second so that derivation re-runs.
 */
export function useCountdown(endsAt: string | null): number | null {
  const [, forceTick] = useReducer((tick: number) => tick + 1, 0)

  useEffect(() => {
    if (endsAt === null) return
    const interval = setInterval(forceTick, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  return computeRemaining(endsAt)
}

function computeRemaining(endsAt: string | null): number | null {
  if (endsAt === null) return null
  return Math.max(0, Math.round((new Date(endsAt).getTime() - Date.now()) / 1000))
}

/** "mm:ss", e.g. 47 → "0:47", 185 → "3:05" — shared by the student and teacher countdown badges. */
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
