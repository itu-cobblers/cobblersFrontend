/**
 * assignmentSet.ts — shared, framework-agnostic helper for shaping an assignment set's assignment
 * list into sidebar/preview groups. Used by both the student sidebar and the
 * teacher assignment set preview so the grouping stays identical.
 *
 * Assignments no longer carry a `day` field (an assignment set IS one day's content — see
 * the api repo's SCHEMA.md), so an assignment set renders as a single labelled group.
 */
import type { Assignment } from '@types'

export interface AssignmentGroup {
  label: string
  items: Assignment[]
}

/** Wrap an assignmentSet's assignments in one labelled group (empty list ⇒ no groups). */
export function groupAssignments(assignments: Assignment[], label: string): AssignmentGroup[] {
  return assignments.length > 0 ? [{ label, items: assignments }] : []
}
