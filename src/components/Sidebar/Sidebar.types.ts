import type { TaskListEntry } from '@components/TaskList'
import type { TaskDetailProps } from '@components/TaskDetail'

export interface SidebarProgress {
  completed: number
  total: number
}

export interface SidebarProps {
  items: TaskListEntry[]
  detail: TaskDetailProps
  progress: SidebarProgress
  isFolded: boolean
  onSelect: (id: number) => void
}
