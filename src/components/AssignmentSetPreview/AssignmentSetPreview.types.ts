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
}
