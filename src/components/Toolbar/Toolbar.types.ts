export interface ToolbarProps {
  /** Theme subtitle next to the logo; empty hides it. */
  subtitle: string
  isRunning: boolean
  isSubmitting: boolean
  /** Disable Run regardless of busy state (e.g. predict / project assignments). */
  isRunDisabled?: boolean
  /** Disable Submit regardless of busy state (e.g. predict / project assignments). */
  isSubmitDisabled?: boolean
  onToggleSidebar: () => void
  onRun: () => void
  onSubmit: () => void
  /** Current session status ("Room: XXXX" or "Solo practice"); omit to hide the status/leave cluster. */
  sessionLabel?: string
  /** Action button text next to sessionLabel ("Leave" or "Exit"). */
  sessionActionLabel?: string
  onLeaveSession?: () => void
}
