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
  /** True while the submitted answer is being graded — drives the Submit button's waiting animation. */
  isSubmitting?: boolean
  /**
   * Whether *this exact* submit attempt was correct, once known — drives only
   * the shared Submit button's "well done"/"not quite" flash. `null`/omitted
   * while no fresh outcome is available (idle, mid-submission, or simply
   * revisiting an assignment without resubmitting) — deliberately separate
   * from `status`, which is the persisted record and must never itself
   * replay/hold the button's animation on revisit.
   */
  lastAnswerCorrect?: boolean | null
  /** The canonical expected output — shown in the answer area while the reference answer is open. */
  expectedOutput: string

  /** True once the student has submitted at least once and has not yet completed. */
  canRevealAnswer: boolean
  isSolutionVisible: boolean
  onToggleSolution: () => void
  /** True while the reference answer is open and the assignment is not yet completed. */
  canMarkAsDone: boolean
  isMarkingDone?: boolean
  onMarkAsDone: () => void

  onAnswerChange: (value: string) => void
  onSubmit: () => void
}
