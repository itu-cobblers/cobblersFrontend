import type { Assignment } from './assignment'

/**
 * A named collection of assignments bound to a session. The teacher picks one when
 * creating a session; the student receives one on join / solo. Carries its own
 * `assignments` so the stepper, assignment panel, and teacher preview render from
 * the assignment set loaded from the backend.
 */
export interface AssignmentSet {
  assignmentSetId: string
  displayTitle: string
  assignments: Assignment[]
}
