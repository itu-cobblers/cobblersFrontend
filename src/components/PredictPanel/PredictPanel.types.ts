/**
 * idle    — awaiting an answer
 * correct — the answer matched
 * wrong   — the answer missed (reveal + "I understand now")
 * done    — completed via "I understand now" after a wrong answer
 */
export type PredictStatus = 'idle' | 'correct' | 'wrong' | 'done'

export interface PredictPanelProps {
  answer: string
  status: PredictStatus
  /** Revealed once the answer is submitted (wrong, correct, or done). */
  expectedOutput: string
  hint?: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  /** "I understand now" — completes the task after a wrong answer. */
  onUnderstood: () => void
}
