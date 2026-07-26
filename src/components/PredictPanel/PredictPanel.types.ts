/**
 * idle     — awaiting a first answer
 * tried    — at least one wrong answer submitted; the input stays open for
 *            another attempt and "Show answer" appears alongside Submit
 * revealed — "Show answer" was pressed; the correct output is shown and the
 *            same button now reads "Marked as done"
 * correct  — an answer matched — completed
 * done     — "Marked as done" was pressed (and recorded) after revealing — completed
 */
export type PredictStatus = 'idle' | 'tried' | 'revealed' | 'correct' | 'done'

export interface PredictPanelProps {
  answer: string
  status: PredictStatus
  /** True while the submitted answer is being graded — drives the Submit button's waiting animation. */
  isSubmitting?: boolean
  /** True while "Marked as done" is recording the completing submission. */
  isMarkingDone?: boolean
  /**
   * Whether *this exact* submit attempt was correct, once known — drives only
   * the shared Submit button's "well done"/"not quite" flash. `null`/omitted
   * while no fresh outcome is available (idle, mid-submission, or simply
   * revisiting an assignment without resubmitting) — deliberately separate
   * from `status`, which is the persisted record and must never itself
   * replay/hold the button's animation on revisit.
   */
  lastAnswerCorrect?: boolean | null
  /** Revealed once the answer is submitted (tried, revealed, correct, or done). */
  expectedOutput: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  /** "Show answer" — reveals the correct output after a tried (wrong) attempt. */
  onShowAnswer: () => void
  /** "Marked as done" — records a completing submission with the correct answer. */
  onMarkAsDone: () => void
}
