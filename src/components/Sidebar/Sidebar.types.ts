import type { AssignmentListEntry } from '@components/AssignmentList'
import type { AssignmentDetailProps } from '@components/AssignmentDetail'

export interface SidebarProgress {
  completed: number
  total: number
}

/** One labelled section in the assignment list (an assignmentSet renders as one group). */
export interface SidebarGroup {
  label: string
  items: AssignmentListEntry[]
}

export interface SidebarProps {
  groups: SidebarGroup[]
  detail: AssignmentDetailProps
  progress: SidebarProgress
  isFolded: boolean
  onSelect: (id: number) => void
}
