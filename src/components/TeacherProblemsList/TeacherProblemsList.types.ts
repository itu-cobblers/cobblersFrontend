import type { AssignmentKind } from '@types'
import type { ProblemStatus } from '@components/ProblemsList/ProblemsList.types'

export interface TeacherProblemItem {
  id: number
  title: string
  kind: AssignmentKind
  /** Calculated passed count among active students for this assignment */
  passedNum?: number
  /** Total active student count */
  totalNum?: number
  /** When a student is selected in Col 2, this item shows that student's specific status for this assignment */
  studentStatus?: ProblemStatus
}

export interface TeacherProblemsListProps {
  sessionCode: string
  items: TeacherProblemItem[]
  activeId: number | null
  /** Fires when an assignment row is clicked — always switches selection; the task filter can never be empty. */
  onSelect: (id: number) => void
  /** Assignment id currently broadcast to the room — shows a "live" badge under its passed count. */
  teacherFocusId?: number | null
  isOpen: boolean
  onToggleOpen: () => void
  // Timer controls — a pure pacing countdown, scoped to whichever assignment
  // is selected (`activeId`). Same minutes+Start control for every `kind` —
  // it no longer gates answer reveal (see CONTRACT.md's Solution section).
  minutes: number
  isStartingTimer: boolean
  timerEndsAt: string | null
  /** The assignment the active/last-started timer is scoped to; `null` alongside a `null` `timerEndsAt`. */
  timerAssignmentId: number | null
  timerError: string | null
  onMinutesChange: (minutes: number) => void
  onStartTimer: () => void
  // Session end
  onEndSession: () => void
  isEndingSession?: boolean
}
