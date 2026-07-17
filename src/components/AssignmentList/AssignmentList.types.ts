import type { AssignmentItemProps } from '@components/AssignmentItem'

/** A row's visual state — everything AssignmentItem needs except the shared onSelect. */
export type AssignmentListEntry = Omit<AssignmentItemProps, 'onSelect'>

export interface AssignmentListProps {
  items: AssignmentListEntry[]
  onSelect: (id: number) => void
}
