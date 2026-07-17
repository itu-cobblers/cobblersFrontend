export interface AssignmentItemProps {
  id: number
  title: string
  isActive: boolean
  isDone: boolean
  onSelect: (id: number) => void
}
