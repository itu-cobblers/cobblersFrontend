import classNames from 'classnames'
import { SubmitButton } from '@components/SubmitButton'
import { ShowAnswerButton } from '@components/ShowAnswerButton'
import type { AssignmentFooterProps } from './AssignmentFooter.types'
import {
  ASSIGNMENT_FOOTER_CLASS,
  ASSIGNMENT_FOOTER_RIGHT_CLASS,
  ASSIGNMENT_FOOTER_REVEAL_LABEL,
} from './AssignmentFooter.constants'

/**
 * Shared terminal/upload footer: Submit on the right with an optional
 * reference-answer toggle. While a graded answer is showing, Submit performs
 * the mark-as-done action and keeps its usual waiting/result animation.
 */
export default function AssignmentFooter({
                                           submitStatus,
                                           onSubmit,
                                           isSubmitDisabled = false,
                                           canRevealAnswer = false,
                                           isSolutionVisible = false,
                                           isLoadingSolution = false,
                                           onToggleSolution,
                                           canMarkAsDone = false,
                                           isMarkingDone = false,
                                           onMarkAsDone,
                                         }: AssignmentFooterProps) {
  const revealLabel = isLoadingSolution
      ? ASSIGNMENT_FOOTER_REVEAL_LABEL.loading
      : isSolutionVisible
          ? ASSIGNMENT_FOOTER_REVEAL_LABEL.hide
          : ASSIGNMENT_FOOTER_REVEAL_LABEL.show

  const isMarkDoneAction = canMarkAsDone && Boolean(onMarkAsDone)
  const buttonStatus = isMarkDoneAction && isMarkingDone ? 'waiting' : submitStatus
  const buttonLabel = isMarkDoneAction ? 'Mark As Done' : undefined
  const handleButtonClick = isMarkDoneAction ? (onMarkAsDone ?? onSubmit) : onSubmit
  const isButtonDisabled = isMarkDoneAction ? isMarkingDone : isSubmitDisabled

  return (
      <div className={classNames(ASSIGNMENT_FOOTER_CLASS, 'justify-end')}>
        <div className={ASSIGNMENT_FOOTER_RIGHT_CLASS}>
          {canRevealAnswer && onToggleSolution && (
              <ShowAnswerButton
                  onClick={onToggleSolution}
                  isDisabled={isLoadingSolution}
                  label={revealLabel}
              />
          )}
          <SubmitButton status={buttonStatus} onClick={handleButtonClick} isDisabled={isButtonDisabled} label={buttonLabel} />
        </div>
      </div>
  )
}
