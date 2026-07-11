/**
 * tasksetApi.ts — the taskset data seam, backed by the real backend
 * (see the api repo's CONTRACT.md, "Tasks"):
 *
 *   GET /api/tasksets                    → taskset picker summaries
 *   GET /api/tasksets/:id/tasks         → the set's tasks, sorted by position
 *
 * The wire task shape is { id, kind, title, description, hint?, content }
 * where `content` holds the kind-specific fields — `toTask()` flattens it into
 * the frontend's discriminated `Task` union. Two deliberate differences from
 * the old hardcoded bundle:
 *
 *   - No `check()` — grading moved server-side (rules live in the DB). Code
 *     tasks won't auto-complete until the submissions endpoint lands; predict
 *     tasks still grade locally from `expectedOutput` / `accept`.
 *   - No `day` — a taskset IS one day's content; solo uses the all-tasks set.
 */
import type { Harness, Task, TaskKind, Taskset } from '@types'

/** The taskset the solo cohort hardcodes (CONTRACT.md, "Tasks"). */
export const SOLO_TASKSET_ID = 'all-tasks-for-solo-2026'

export interface TaskSetSummary {
  tasksetId: string
  displayTitle: string
}

/** Wire shape of one task from GET /api/tasksets/:id/tasks. */
interface ApiTask {
  id: number
  kind: TaskKind
  title: string
  description: string
  hint?: string
  content: Record<string, unknown>
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

/** Flatten the wire task (kind-specific payload in `content`) into a `Task`. */
function toTask(dto: ApiTask): Task {
  const base = {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    hint: dto.hint,
  }
  switch (dto.kind) {
    case 'code': {
      const content = dto.content as {
        starter?: string
        stdin?: string
        harness?: Harness
        solutionFile?: string
      }
      return { ...base, kind: 'code', ...content }
    }
    case 'predict': {
      const content = dto.content as { snippet: string; expectedOutput: string; accept?: string[] }
      return { ...base, kind: 'predict', ...content }
    }
    case 'project': {
      const content = dto.content as { brief: string; requiredClasses?: string[]; entryClass?: string }
      return { ...base, kind: 'project', ...content }
    }
  }
}

/** `GET /api/tasksets` — the teacher's session-creation picker. */
export async function fetchTasksets(): Promise<TaskSetSummary[]> {
  return getJson<TaskSetSummary[]>('/api/tasksets')
}

/**
 * A full taskset (summary + tasks). The tasks endpoint doesn't return the
 * display title, so it's resolved from the summaries list in parallel.
 */
export async function fetchTaskset(tasksetId: string): Promise<Taskset> {
  const [summaries, apiTasks] = await Promise.all([
    fetchTasksets(),
    getJson<ApiTask[]>(`/api/tasksets/${encodeURIComponent(tasksetId)}/tasks`),
  ])
  return {
    tasksetId,
    displayTitle: summaries.find((set) => set.tasksetId === tasksetId)?.displayTitle ?? tasksetId,
    tasks: apiTasks.map(toTask),
  }
}

/** The solo cohort's taskset (the room cohort resolves its id via GET /api/sessions/:code). */
export async function fetchStudentTaskset(): Promise<Taskset> {
  return fetchTaskset(SOLO_TASKSET_ID)
}
