/**
 * taskset.ts — shared, framework-agnostic helper for shaping a taskset's task
 * list into sidebar/preview groups. Used by both the student sidebar and the
 * teacher taskset preview so the grouping stays identical.
 *
 * Tasks no longer carry a `day` field (a taskset IS one day's content — see
 * the api repo's SCHEMA.md), so a taskset renders as a single labelled group.
 */
import type { Task } from '@types'

export interface TaskGroup {
  label: string
  items: Task[]
}

/** Wrap a taskset's tasks in one labelled group (empty list ⇒ no groups). */
export function groupTasks(tasks: Task[], label: string): TaskGroup[] {
  return tasks.length > 0 ? [{ label, items: tasks }] : []
}
