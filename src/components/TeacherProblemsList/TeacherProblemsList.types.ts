import type { AssignmentKind } from '@types'
import type {ProblemStatus} from "@/components";

export interface TeacherProblemItem {
  id: number
  title: string
  kind: AssignmentKind
  /** That student's status for this assignment when one's selected in Col 2; 'untried' (the same grey default every unattempted row gets) otherwise. */
  status: ProblemStatus
}

export interface TeacherProblemsListProps {
  items: TeacherProblemItem[]
  activeId: number | null
  /** Fires when an assignment row is clicked — always switches selection; the task filter can never be empty. */
  onSelect: (id: number) => void
  /** Assignment id currently broadcast to the room — shows a "live" badge under its passed count. */
  teacherFocusId?: number | null
  isOpen: boolean
  onToggleOpen: () => void
  // Timer controls
  timerMinutes: number
  onTimerMinutesChange: (minutes: number) => void
  onStartTimer: () => void
  isStartingTimer?: boolean
  /** ISO string while a timer is running; null when none is set. */
  timerEndsAt?: string | null
  timerError?: string | null
}
