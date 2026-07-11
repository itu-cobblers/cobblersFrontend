/**
 * taskset.ts — shared, framework-agnostic helpers for grouping a task list by
 * day. Used by both the student sidebar and the teacher taskset preview so the
 * day labels and grouping stay identical. This is NOT mock data — the task data
 * itself comes from `@lib/tasksetApi`; this only shapes it.
 */
import type { Task } from '@types'

export const DAY_LABELS: Record<number, string> = {
  1: 'Day 1 · Basics',
  2: 'Day 2 · Loops & Logic',
  3: 'Day 3 · Objects & Projects',
}

export interface TaskGroup {
  day: number
  label: string
  items: Task[]
}

/** Split a task list into Day 1/2/3 groups, dropping any day with no tasks. */
export function groupTasksByDay(tasks: Task[]): TaskGroup[] {
  return [1, 2, 3]
    .map((day) => ({
      day,
      label: DAY_LABELS[day],
      items: tasks.filter((task) => task.day === day),
    }))
    .filter((group) => group.items.length > 0)
}
