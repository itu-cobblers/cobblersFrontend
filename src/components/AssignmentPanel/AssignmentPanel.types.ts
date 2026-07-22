import type { LessonBlock } from '@types'
import type { StepperStep } from '@components/AssignmentStepper'
import type { FeedbackBannerProps } from '@components/FeedbackBanner'

export interface AssignmentPanelProps {
  steps: StepperStep[]
  onSelectStep: (id: number) => void
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
