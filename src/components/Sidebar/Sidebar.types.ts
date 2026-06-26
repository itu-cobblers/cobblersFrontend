import type { TaskListEntry } from '@components/TaskList'
import type { TaskDetailProps } from '@components/TaskDetail'

export interface SidebarProgress {
  completed: number
  total: number
}

/** One day's section in the task list. */
export interface SidebarGroup {
  day: number
  label: string
  items: TaskListEntry[]
}

export interface SidebarProps {
  groups: SidebarGroup[]
  detail: TaskDetailProps
  progress: SidebarProgress
  isFolded: boolean
  onSelect: (id: number) => void
}
