import type { TaskItemProps } from '@components/TaskItem'

/** A row's visual state — everything TaskItem needs except the shared onSelect. */
export type TaskListEntry = Omit<TaskItemProps, 'onSelect'>

export interface TaskListProps {
  items: TaskListEntry[]
  onSelect: (id: number) => void
}
