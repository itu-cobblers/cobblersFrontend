/**
 * idle     — awaiting / editing an answer
 * correct  — the answer matched (reveal expected output)
 * wrong    — missed; offer Redo or Reveal answer (answer still hidden)
 * done     — completed after revealing the answer
 */
export type PredictStatus = 'idle' | 'correct' | 'wrong' | 'done'

export interface PredictPanelProps {
  answer: string
  status: PredictStatus
  /** Shown after a correct submit, or after the student chooses Reveal answer. */
  expectedOutput: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  /** Redo — go back to editing without revealing the answer. */
  onRedo: () => void
  /** Reveal answer — show expected output and complete the assignment. */
  onReveal: () => void
}
