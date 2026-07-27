import type { LessonBlock, ExecuteResult } from '@types'
import type { AssignmentPanelTab } from '@components/AssignmentPanel/AssignmentPanel.types'

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
