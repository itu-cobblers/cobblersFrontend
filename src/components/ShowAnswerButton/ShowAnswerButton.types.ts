export interface ShowAnswerButtonProps {
  onClick: () => void
  isDisabled?: boolean
  /** Overrides the default "Show answer" copy — e.g. "Marked as done" once the answer has been revealed. */
  label?: string
}
