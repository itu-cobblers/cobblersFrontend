import { Button } from '@components/Button'
import { BUTTON_HEIGHT_CLASS } from '@components/Button/Button.constants'
import type { ShowAnswerButtonProps } from './ShowAnswerButton.types'

/**
 * Shared ghost action used by AssignmentFooter for "Show/Hide reference
 * answer" and "Marked as done". Each caller supplies its own label and
 * visibility condition.
 */
export default function ShowAnswerButton({ onClick, isDisabled = false, label = 'Show answer' }: ShowAnswerButtonProps) {
  return (
    <Button variant="ghost" onClick={onClick} isDisabled={isDisabled} className={BUTTON_HEIGHT_CLASS}>
      {label}
    </Button>
  )
}
