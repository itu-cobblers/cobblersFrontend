import { type ChangeEvent } from 'react'
import { Icon } from '@/components'
import type { PredictPanelProps } from '@/components'
import {
  PREDICT_PANEL_CLASS,
  PREDICT_HEADER_CLASS,
  PREDICT_STATUS_OK_CLASS,
  PREDICT_BODY_CLASS,
  PREDICT_TEXTAREA_CLASS,
  PREDICT_REVEAL_CLASS,
  PREDICT_HEADER_LEFT_CLASS,
  PREDICT_FEEDBACK_CLASS,
  PREDICT_FEEDBACK_HEADER_CLASS,
  PREDICT_FEEDBACK_LIST_CLASS,
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
  expectedOutput,
  isSolutionVisible,
  onAnswerChange,
  feedback,
}: PredictPanelProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onAnswerChange(event.target.value)
  }

  const hasFeedback = Array.isArray(feedback) && feedback.length > 0

  return (
    <div className={PREDICT_PANEL_CLASS}>
      <div className={PREDICT_HEADER_CLASS}>
        <span className={PREDICT_HEADER_LEFT_CLASS}>
          <Icon name="terminal" />
          {isSolutionVisible ? "Correct Output" : "Terminal"}
          {status === 'correct' && <span className={PREDICT_STATUS_OK_CLASS}>Correct</span>}
        </span>
      </div>
      <div className={PREDICT_BODY_CLASS}>
        {isSolutionVisible ? (
          <>
            <pre className={PREDICT_REVEAL_CLASS}>{expectedOutput}</pre>
          </>
        ) : (
          <>
          <textarea
              className={PREDICT_TEXTAREA_CLASS}
              value={answer}
              onChange={handleChange}
              placeholder="Type what you think it prints, line by line."
              spellCheck={false}
          />
          </>
        )}
        {hasFeedback && !isSolutionVisible && (
          <div className={PREDICT_FEEDBACK_CLASS}>
            <span className={PREDICT_FEEDBACK_HEADER_CLASS}>
              <Icon name="info" />
              What to fix
            </span>
            <ul className={PREDICT_FEEDBACK_LIST_CLASS}>
              {feedback.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
