import type { Assignment } from './assignment'

/**
 * A named collection of assignments bound to a session. The teacher picks one when
 * creating a session; the student receives one on join / solo. Carries its own
 * `assignments` so the sidebar and preview render from the assignment set — not the global
 * `ASSIGNMENTS` array.
 */
export interface AssignmentSet {
  assignmentSetId: string
  displayTitle: string
  assignments: Assignment[]
}
