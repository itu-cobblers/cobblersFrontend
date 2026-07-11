import type { Task } from './task'

/**
 * A named collection of tasks bound to a session. The teacher picks one when
 * creating a session; the student receives one on join / solo. Carries its own
 * `tasks` so the sidebar and preview render from the taskset — not the global
 * `TASKS` array.
 */
export interface Taskset {
  tasksetId: string
  displayTitle: string
  tasks: Task[]
}
