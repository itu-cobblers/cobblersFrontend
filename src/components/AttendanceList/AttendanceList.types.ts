import type { ProblemStatus } from '@components/ProblemsList/ProblemsList.types'

export interface AttendanceStudent {
  studentId: string
  displayName: string
  isActive?: boolean
  /** When an assignment is selected in Col 1, this represents the student's status for that assignment */
  assignmentStatus?: ProblemStatus
}

export interface AttendanceListProps {
  students: AttendanceStudent[]
  activeStudentId: string | null
  /** Fires when a student row is clicked. Passing null or clicking the active student toggles/clears selection. */
  onSelectStudent: (studentId: string | null) => void
  /** Is Col 1 (assignment) selected? Used for header contextual title */
  selectedAssignmentTitle?: string | null
}
