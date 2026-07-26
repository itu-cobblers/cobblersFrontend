export interface WelcomeBackBannerProps {
  displayName: string
  /** The suggested room's join code (e.g. "WXYZ"). */
  code: string
  /** e.g. "BootIT Day 2 — 2026". */
  assignmentSetDisplayTitle: string
  /** True while the one-click join is in flight. */
  isJoining: boolean
  onJoin: () => void
  onDismiss: () => void
}
