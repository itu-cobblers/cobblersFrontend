/**
 * idle     — awaiting a first answer
 * tried    — at least one wrong answer submitted; the input stays open for
 *            another attempt and "Show reference answer" appears alongside Submit
 * correct  — an answer matched — completed (reveal button hidden)
 * done     — "Marked as done" was pressed after revealing — completed
 */
export type PredictStatus = 'idle' | 'tried' | 'correct' | 'done'

export interface PredictPanelProps {
  answer: string
  status: PredictStatus
  /** The canonical expected output — shown in the answer area while the reference answer is open. */
  expectedOutput: string

  isSolutionVisible: boolean

  onAnswerChange: (value: string) => void
}
