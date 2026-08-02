/**
 * `hero`  — the 261px photo band on the entry portal.
 * `bar`   — a 40px strip for the app chrome, matching the rails' row height.
 */
export type AppHeaderVariant = 'hero' | 'bar'

export interface AppHeaderProps {
  variant?: AppHeaderVariant
  /** Trailing section name, shown after a slash — e.g. "ITU BootIT / BootCode". */
  section?: string
  /** Current session status — "Room: XXXX" or "Solo practice". */
  sessionLabel?: string
  /** The student's display name — "Signed in as …". */
  displayName?: string
  /** Leave/Exit action, rendered top-right. Omit both to render no action. */
  onLeaveSession?: () => void
  leaveLabel?: string
}
