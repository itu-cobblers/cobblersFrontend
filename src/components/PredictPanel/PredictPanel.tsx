import { type ChangeEvent } from 'react'
import {Icon} from "@/components";
import { SubmitButton, type SubmitButtonStatus } from '@components/SubmitButton'
import { ShowAnswerButton } from '@components/ShowAnswerButton'
import type { PredictPanelProps } from './PredictPanel.types'
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
  PREDICT_FOOTER_CLASS, PREDICT_HEADER_LEFT_CLASS,
} from './PredictPanel.constants'

/**
 * The answer area for a predict-the-output quiz, shown in the terminal slot.
 * State (the answer + status) is owned by the view's hook.
 */
export default function PredictPanel({
  answer,
  status,
  isSubmitting = false,
  isMarkingDone = false,
  expectedOutput,
  onAnswerChange,
  onSubmit,
  onShowAnswer,
  onMarkAsDone,
}: PredictPanelProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onAnswerChange(event.target.value)
  }

  const isTried = status === 'tried'
  const isRevealed = status === 'revealed'
  const isCorrect = status === 'correct'
  const isDone = status === 'done'
  // The input stays open for another attempt until the student reveals the
  // answer — only "revealed"/"correct"/"done" replace it with the result view.
  const isInput = status === 'idle' || isTried

  // The button itself never leaves the DOM on submit — it holds its final
  // frame (well done / not quite) once the answer is graded, so the shared
  // component in both panels always reads as the source of truth for outcome.
  const buttonStatus: SubmitButtonStatus = isSubmitting
    ? 'waiting'
    : isCorrect
      ? 'success'
      : isTried || isRevealed || isDone
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
        {isInput ? (
          <>
            {isTried && (
              <p className={PREDICT_HINT_CLASS}>Not quite — try again, or show the answer below.</p>
            )}
            <textarea
              className={PREDICT_TEXTAREA_CLASS}
              value={answer}
              onChange={handleChange}
              placeholder="Read the code and type what you think it prints, line by line."
              spellCheck={false}
            />
          </>
        ) : (
          <>
            {isCorrect && <p className={PREDICT_SUCCESS_CLASS}>✓ Correct — well predicted!</p>}
            {isDone && <p className={PREDICT_SUCCESS_CLASS}>✓ Marked complete.</p>}
            {isRevealed && (
              <p className={PREDICT_HINT_CLASS}>Not quite — here&rsquo;s what it actually prints:</p>
            )}
            <div className={PREDICT_REVEAL_LABEL_CLASS}>Correct output</div>
            <pre className={PREDICT_REVEAL_CLASS}>{expectedOutput}</pre>
          </>
        )}
      </div>

      {isInput && (
        <div className={PREDICT_FOOTER_CLASS}>
          {isTried && <ShowAnswerButton onClick={onShowAnswer} label="Show answer" />}
          <SubmitButton status={buttonStatus} onClick={onSubmit} isDisabled={!answer.trim()} />
        </div>
      )}
      {!isInput && (
        <div className={PREDICT_FOOTER_CLASS}>
          {isRevealed && (
            <ShowAnswerButton onClick={onMarkAsDone} label="Marked as done" isDisabled={isMarkingDone} />
          )}
          <SubmitButton status={buttonStatus} onClick={onSubmit} isDisabled />
        </div>
      )}
    </div>
  )
}
