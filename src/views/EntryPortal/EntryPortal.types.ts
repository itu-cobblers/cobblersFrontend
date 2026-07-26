export type JoinMode = 'join' | 'solo'

/**
 * Shared entry-screen props — used by the student flow today (one-click join
 * of today's session, or solo practice) and designed to be reused by the
 * teacher gate later (same "type your name, pick a path" shape).
 */
export interface EntryPortalProps {
  name: string
  /** True if this browser has a saved display name from a previous visit — flips the headline to "Welcome back". */
  isReturningStudent: boolean
  /**
   * Today's newest still-active room's join code, from `GET
   * /api/sessions/today-latest` — `undefined` while loading, `null` once
   * resolved to "nothing to join today", a code string once found.
   */
  todayLatestSessionCode: string | null | undefined
  /** True while the join request is in flight. */
  isJoining: boolean
  /** True while the solo-practice request is in flight. */
  isStartingSolo: boolean
  onNameChange: (value: string) => void
  onJoinToday: () => void
  onStartSolo: () => void
  /** Re-checks `GET /api/sessions/today-latest` — offered next to the "no session" label. */
  onRefreshTodayLatestSession: () => void
}
