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
}: PredictPanelProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onAnswerChange(event.target.value)
  }

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
              placeholder="Read the code and type what you think it prints, line by line."
              spellCheck={false}
          />
          </>
        )}
      </div>
    </div>
  )
}
