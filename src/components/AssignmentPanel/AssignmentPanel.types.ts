import type { LessonBlock, SourceFile, SubmissionHistoryItem } from '@types'
import type { StepperStep } from '@components/AssignmentStepper'
import type { FeedbackBannerProps } from '@components/FeedbackBanner'

export type AssignmentPanelTab = 'description' | 'submissions'

/** The active assignment's per-assignment room countdown — only present while it's running. */
export interface CountdownBadgeProps {
  /** Pre-formatted "mm:ss" remaining. */
  remainingLabel: string
  /** True once ≤3 minutes remain — purely cosmetic, no longer tied to answer reveal (submission-based now, see CONTRACT.md's Solution section). */
  isUrgent: boolean
}

/**
 * The revealed-answer *content* for `code`/`project` assignments — `predict`
 * uses its own PredictPanel mechanism instead. The "Show answer" trigger
 * button lives next to Submit/Run now (OutputPanel/ProjectPanel), not here —
 * this only renders the reference solution once it's been revealed.
 */
export interface AnswerRevealProps {
  /** Whether the student has already clicked "Show answer" and the solution loaded. */
  isRevealed: boolean
  /** The revealed solution's files (populated once `isRevealed`). */
  files: SourceFile[]
}

export interface AssignmentPanelProps {
  steps: StepperStep[]
  onSelectStep: (id: number) => void
  /** Hide the compact stepper strip visually (kept in the DOM/a11y tree) when a richer nav — e.g. ProblemsList — already shows it. Defaults to visible. */
  isStepperVisible?: boolean
  /** Which tab is showing — Description (the task) or Submissions (this assignment's attempt history). */
  activeTab: AssignmentPanelTab
  onTabChange: (tab: AssignmentPanelTab) => void
  /** This assignment's attempts only (newest first) — shown under the Submissions tab. */
  submissions: SubmissionHistoryItem[]
  title: string
  /** Teaching content (concept + example code) shown above the task. */
  lesson?: LessonBlock[]
  /** The actual task to solve. */
  description: string
  /** Extra long-form text under the task (a project's brief). */
  body?: string
  hint?: string
  /** Check feedback pinned at the bottom; omitted ⇒ no banner. */
  feedback?: FeedbackBannerProps
  /** This assignment's room countdown, when the active timer is scoped to it. */
  countdown?: CountdownBadgeProps
  /** The "Show answer" flow for `code`/`project`; omitted for `predict` (its own panel handles reveal). */
  answer?: AnswerRevealProps
}
