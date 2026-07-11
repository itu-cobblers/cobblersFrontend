import type { TaskListEntry } from '@components/TaskList'
import type { TaskDetailProps } from '@components/TaskDetail'

export interface SidebarProgress {
  completed: number
  total: number
}

/** One labelled section in the task list (a taskset renders as one group). */
export interface SidebarGroup {
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
