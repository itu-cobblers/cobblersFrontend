export interface TaskItemProps {
  id: number
  title: string
  isActive: boolean
  isDone: boolean
  onSelect: (id: number) => void
}
