import type { LessonBlock, SubmissionHistoryItem } from '@types'
import type { ProjectIdentity } from '@lib/projectIdentity'

export type AssignmentPanelTab = 'description' | 'submissions'

export interface AssignmentPanelProps {
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
  onViewSubmission?: (item: SubmissionHistoryItem) => void;
  viewingSubmissionId?: string;
}
