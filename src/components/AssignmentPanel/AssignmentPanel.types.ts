import type { LessonBlock, SubmissionHistoryItem } from '@types'
import type { StepperStep } from '@components/AssignmentStepper'
import type { FeedbackBannerProps } from '@components/FeedbackBanner'
import type { ProjectIdentity } from '@lib/projectIdentity'

export type AssignmentPanelTab = 'description' | 'submissions'

export interface AssignmentPanelProps {
  /**
   * Reference-answer toggle, shown under the hint. Lives here rather than beside
   * Submit because revealing changes what the *content* panels show — the editor's
   * files for `code`/`project`, the expected output inside PredictPanel for
   * `predict` — and never affects submission itself.
   */
  canRevealAnswer?: boolean
  isSolutionVisible?: boolean
  isLoadingSolution?: boolean
  onToggleSolution?: () => void

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
  /**
   * Present only for `project` assignments — resolved by the view via
   * `getProjectIdentity(title)` (@lib/projectIdentity). Its presence is what
   * switches the panel from rendering `body` as a flat paragraph to
   * embedding the project's original PDF brief, plus the "Set up your Java
   * environment" disclosure.
   */
  projectIdentity?: ProjectIdentity
  hint?: string
  /** Check feedback pinned at the bottom; omitted ⇒ no banner. */
  feedback?: FeedbackBannerProps
}
