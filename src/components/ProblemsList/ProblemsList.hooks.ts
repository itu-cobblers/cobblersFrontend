import { useEffect, useState } from 'react'

/**
 * True, once `endsAt` has passed — ticks every second while a timer is set so
 * the student/teacher timer badge disappears right when time's up, instead of
 * showing a stale "Ends 14:30" forever. Shared by `ProblemsList` and
 * `TeacherProblemsList`.
 */
export function useIsTimerExpired(endsAt: string | null | undefined): boolean {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!endsAt) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  return endsAt != null && now >= new Date(endsAt).getTime()
}
