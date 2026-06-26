export interface ToolbarProps {
  /** Theme subtitle next to the logo; empty hides it. */
  subtitle: string
  isRunning: boolean
  isSubmitting: boolean
  /** Disable Run regardless of busy state (e.g. predict / project tasks). */
  isRunDisabled?: boolean
  /** Disable Submit regardless of busy state (e.g. predict / project tasks). */
  isSubmitDisabled?: boolean
  onToggleSidebar: () => void
  onRun: () => void
  onSubmit: () => void
}
