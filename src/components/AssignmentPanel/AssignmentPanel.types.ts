import type { LessonBlock, SubmissionHistoryItem } from '@types'
import type { StepperStep } from '@components/AssignmentStepper'
import type { FeedbackBannerProps } from '@components/FeedbackBanner'

export type AssignmentPanelTab = 'description' | 'submissions'

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
}
