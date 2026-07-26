import { Button } from '@components/Button'
import type { ShowAnswerButtonProps } from './ShowAnswerButton.types'

/**
 * Shared "Show answer" action for PredictPanel and OutputPanel. Replaces the
 * old "I understand now" copy — same completing action, reframed as revealing
 * the answer. Each panel decides its own visibility condition (see callers).
 *
 * PredictPanel reuses this same button, relabelled "Marked as done", once
 * the answer has been revealed — pressing it records a completing submission.
 */
export default function ShowAnswerButton({ onClick, isDisabled = false, label = 'Show answer' }: ShowAnswerButtonProps) {
  return (
    <Button variant="ghost" onClick={onClick} isDisabled={isDisabled}>
      {label}
    </Button>
  )
}
