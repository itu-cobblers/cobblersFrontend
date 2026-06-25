export interface ToolbarProps {
  /** Theme subtitle next to the logo; empty hides it. */
  subtitle: string
  isRunning: boolean
  isSubmitting: boolean
  onToggleSidebar: () => void
  onRun: () => void
  onSubmit: () => void
}
