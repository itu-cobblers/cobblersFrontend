import type { LessonBlock, ExecuteResult } from '@types'
import type { AssignmentPanelTab } from '@components/AssignmentPanel/AssignmentPanel.types'
import type { ProjectIdentity } from '@lib/projectIdentity'

export interface TeacherSubmissionItem {
  subId: string
  studentId: string
  studentName: string
  assignmentId: number
  assignmentTitle: string
  passed: boolean
  submittedAt: string
  code: string
  result?: ExecuteResult | null
}

export interface TeacherAssignmentPanelProps {
  activeTab: AssignmentPanelTab
  onTabChange: (tab: AssignmentPanelTab) => void
  // Active assignment details
  title: string
  lesson?: LessonBlock[]
  description: string
  body?: string
  /**
   * Present only for `project` assignments — resolved by the view via
   * `getProjectIdentity(title)` (@lib/projectIdentity). Switches the panel
   * from rendering `body` as a flat paragraph to the shared `ProjectBrief`
   * (embedded PDF + setup-guide popup), matching the student view exactly.
   */
  projectIdentity?: ProjectIdentity
  hint?: string
  // Focus CTA — broadcasts the currently selected assignment to the room.
  // The left rail's selection is purely local until this is clicked.
  onFocusClick?: () => void
  isFocused?: boolean
  isBroadcastable?: boolean
  // Selection filter state (student-only — the assignment side can never be
  // empty, so it's shown via the title row above, not a clearable pill)
  selectedStudentName?: string | null
  onClearStudentFilter?: () => void
  // Submissions list
  submissions: TeacherSubmissionItem[]
  activeSubId?: string | null
  onSelectSubmission?: (subId: string) => void
  onSelectStudentFilter?: (studentId: string) => void
}
