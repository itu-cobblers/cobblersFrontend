import { type ChangeEvent } from 'react'
import { Icon } from '@/components'
import { AssignmentFooter } from '@components/AssignmentFooter'
import type { SubmitButtonStatus } from '@components/SubmitButton'
import type { PredictPanelProps } from '@/components'
import {
  PREDICT_PANEL_CLASS,
  PREDICT_HEADER_CLASS,
  PREDICT_STATUS_OK_CLASS,
  PREDICT_BODY_CLASS,
  PREDICT_HINT_CLASS,
  PREDICT_SUCCESS_CLASS,
  PREDICT_TEXTAREA_CLASS,
  PREDICT_REVEAL_LABEL_CLASS,
  PREDICT_REVEAL_CLASS,
  PREDICT_HEADER_LEFT_CLASS,
} from './PredictPanel.constants'

/**
 * The answer area for a predict-the-output quiz, shown in the terminal slot.
 * State (the answer + status) is owned by the view's hook. The reference
 * answer toggles in place of the student's input — hide returns them to a
 * clean answering view.
 */
export default function PredictPanel({
  answer,
  status,
  isSubmitting = false,
  isMarkingDone = false,
  lastAnswerCorrect = null,
  expectedOutput,
  canRevealAnswer,
  isSolutionVisible,
  onToggleSolution,
  canMarkAsDone,
  onMarkAsDone,
  onAnswerChange,
  onSubmit,
}: PredictPanelProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onAnswerChange(event.target.value)
  }

  const isTried = status === 'tried'
  const isCorrect = status === 'correct'
  const isDone = status === 'done'
  const isCompleted = isCorrect || isDone
  // The input stays open until the student completes — revealing the reference
  // answer temporarily replaces it; hiding restores this view.
  const showInput = !isCompleted && !isSolutionVisible

  // The Submit button's own well-done/not-quite flash is driven only by
  // `lastAnswerCorrect` — the *this-exact-submit's* outcome — never by
  // `status`, which is the persisted, de-facto record (used for the header
  // badge, the reveal, …) and stays true across assignment switches.
  const buttonStatus: SubmitButtonStatus = isSubmitting
    ? 'waiting'
    : lastAnswerCorrect === true
      ? 'success'
      : lastAnswerCorrect === false
        ? 'error'
        : 'idle'

  return (
    <div className={PREDICT_PANEL_CLASS}>
      <div className={PREDICT_HEADER_CLASS}>
        <span className={PREDICT_HEADER_LEFT_CLASS}>
          <Icon name="terminal" />
          Terminal
          {isCorrect && <span className={PREDICT_STATUS_OK_CLASS}>Correct</span>}
          {isDone && <span className={PREDICT_STATUS_OK_CLASS}>Completed</span>}
        </span>
      </div>
      <div className={PREDICT_BODY_CLASS}>
        {showInput ? (
          <>
            {isTried && (
              <p className={PREDICT_HINT_CLASS}>Not quite — try again, or show the reference answer below.</p>
            )}
            <textarea
              className={PREDICT_TEXTAREA_CLASS}
              value={answer}
              onChange={handleChange}
              placeholder="Type what you think it prints, line by line."
              spellCheck={false}
            />
          </>
        ) : (
          <>
            {isCorrect && <p className={PREDICT_SUCCESS_CLASS}>✓ Correct — well predicted!</p>}
            {isDone && <p className={PREDICT_SUCCESS_CLASS}>✓ Marked complete.</p>}
            {isSolutionVisible && !isCompleted && (
              <p className={PREDICT_HINT_CLASS}>Not quite — here&rsquo;s what it actually prints:</p>
            )}
            <div className={PREDICT_REVEAL_LABEL_CLASS}>Correct output</div>
            <pre className={PREDICT_REVEAL_CLASS}>{expectedOutput}</pre>
          </>
        )}
      </div>

      <AssignmentFooter
        submitStatus={buttonStatus}
        onSubmit={onSubmit}
        isSubmitDisabled={isCompleted || !answer.trim()}
        canRevealAnswer={canRevealAnswer}
        isSolutionVisible={isSolutionVisible}
        onToggleSolution={onToggleSolution}
        canMarkAsDone={canMarkAsDone}
        isMarkingDone={isMarkingDone}
        onMarkAsDone={onMarkAsDone}
      />
    </div>
  )
}
