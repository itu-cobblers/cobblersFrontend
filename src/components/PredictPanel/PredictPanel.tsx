import { type ChangeEvent } from 'react'
import { Button } from '@components/Button'
import type { PredictPanelProps } from './PredictPanel.types'
import {
  PREDICT_PANEL_CLASS,
  PREDICT_HEADER_CLASS,
  PREDICT_STATUS_OK_CLASS,
  PREDICT_STATUS_BAD_CLASS,
  PREDICT_BODY_CLASS,
  PREDICT_HINT_CLASS,
  PREDICT_SUCCESS_CLASS,
  PREDICT_TEXTAREA_CLASS,
  PREDICT_REVEAL_LABEL_CLASS,
  PREDICT_REVEAL_CLASS,
  PREDICT_FOOTER_CLASS,
} from './PredictPanel.constants'

/**
 * The answer area for a predict-the-output quiz, shown in the terminal slot.
 * State (the answer + status) is owned by the view's hook.
 */
export default function PredictPanel({
  answer,
  status,
  expectedOutput,
  onAnswerChange,
  onSubmit,
  onUnderstood,
}: PredictPanelProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onAnswerChange(event.target.value)
  }

  const isInput = status === 'idle'
  const isCorrect = status === 'correct'
  const isWrong = status === 'wrong'
  const isDone = status === 'done'

  return (
    <div className={PREDICT_PANEL_CLASS}>
      <div className={PREDICT_HEADER_CLASS}>
        <span>Your prediction</span>
        {isCorrect && <span className={PREDICT_STATUS_OK_CLASS}>Correct</span>}
        {isWrong && <span className={PREDICT_STATUS_BAD_CLASS}>Not quite</span>}
        {isDone && <span className={PREDICT_STATUS_OK_CLASS}>Completed</span>}
      </div>

      <div className={PREDICT_BODY_CLASS}>
        {isInput ? (
          <>
            <p className={PREDICT_HINT_CLASS}>
              Read the code and type what you think it prints, line by line.
            </p>
            <textarea
              className={PREDICT_TEXTAREA_CLASS}
              value={answer}
              onChange={handleChange}
              placeholder="Type the output here…"
              spellCheck={false}
            />
          </>
        ) : (
          <>
            {isCorrect && <p className={PREDICT_SUCCESS_CLASS}>✓ Correct — well predicted!</p>}
            {isDone && <p className={PREDICT_SUCCESS_CLASS}>✓ Marked complete.</p>}
            {isWrong && (
              <p className={PREDICT_HINT_CLASS}>Not quite — here&rsquo;s what it actually prints:</p>
            )}
            <div className={PREDICT_REVEAL_LABEL_CLASS}>Correct output</div>
            <pre className={PREDICT_REVEAL_CLASS}>{expectedOutput}</pre>
          </>
        )}
      </div>

      {isInput && (
        <div className={PREDICT_FOOTER_CLASS}>
          <Button onClick={onSubmit} isDisabled={!answer.trim()}>
            Submit answer
          </Button>
        </div>
      )}
      {isWrong && (
        <div className={PREDICT_FOOTER_CLASS}>
          <Button onClick={onUnderstood}>I understand now</Button>
        </div>
      )}
    </div>
  )
}
