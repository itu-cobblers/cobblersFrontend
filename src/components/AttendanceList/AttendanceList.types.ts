import type {ProblemStatus} from "@/components";

export interface AttendanceStudent {
  studentId: string
  displayName: string
  isActive?: boolean
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
