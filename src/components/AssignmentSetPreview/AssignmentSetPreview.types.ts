import type { AssignmentKind } from '@types'

export interface AssignmentSetPreviewEntry {
  id: number
  title: string
  kind: AssignmentKind
  description: string
  hint?: string
}

export interface AssignmentSetPreviewGroup {
  label: string
  items: AssignmentSetPreviewEntry[]
}

export interface AssignmentSetPreviewProps {
  /** Optional heading shown above the groups (e.g. the assignmentSet title). */
  title?: string
  groups: AssignmentSetPreviewGroup[]
  /** Broadcasts "teacher moved to this assignment" over the hub; omit to hide the Focus button (read-only browse). */
  onFocusAssignment?: (id: number) => void
  /** The assignment id currently broadcast to the room, if any — highlighted in the list. */
  focusedAssignmentId?: number | null
}
