/**
 * assignmentSetApi.ts — the assignment-set data seam, backed by the real
 * backend (see the api repo's CONTRACT.md, "Tasks").
 *
 * ⚠️ Naming: the wire contract still says "task"/"taskset" (URLs and the
 * `tasksetId` field) — the backend renamed its internals to Assignment but is
 * keeping the contract naming for now, so this file is the only place that
 * translates. Endpoints:
 *
 *   GET /api/tasksets                → assignment-set picker summaries
 *   GET /api/tasksets/:id/tasks     → the set's assignments, sorted by position
 *
 * The wire shape is { id, kind, title, description, hint?, content } where
 * `content` holds the kind-specific fields — `toAssignment()` flattens it into
 * the frontend's discriminated `Assignment` union. Two deliberate differences
 * from the old hardcoded bundle:
 *
 *   - No `check()` — grading moved server-side (rules live in the DB). Code
 *     assignments won't auto-complete until the submissions endpoint lands;
 *     predict assignments still grade locally from `expectedOutput` / `accept`.
 *   - No `day` — a set IS one day's content; solo uses the all-tasks set.
 */
import type { Harness, Assignment, AssignmentKind, AssignmentSet } from '@types'

/** The assignment set the solo cohort hardcodes (CONTRACT.md, "Tasks"). */
export const SOLO_ASSIGNMENT_SET_ID = 'all-tasks-for-solo-2026'

export interface AssignmentSetSummary {
  /** Contract naming — the wire still calls a set a "taskset". */
  tasksetId: string
  displayTitle: string
}

/** Wire shape of one assignment from GET /api/tasksets/:id/tasks. */
interface ApiAssignment {
  id: number
  kind: AssignmentKind
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

/** Flatten the wire assignment (kind-specific payload in `content`) into an `Assignment`. */
function toAssignment(dto: ApiAssignment): Assignment {
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
export async function fetchAssignmentSets(): Promise<AssignmentSetSummary[]> {
  return getJson<AssignmentSetSummary[]>('/api/tasksets')
}

/**
 * A full assignment set (summary + assignments). The tasks endpoint doesn't
 * return the display title, so it's resolved from the summaries list in parallel.
 */
export async function fetchAssignmentSet(tasksetId: string): Promise<AssignmentSet> {
  const [summaries, apiAssignments] = await Promise.all([
    fetchAssignmentSets(),
    getJson<ApiAssignment[]>(`/api/tasksets/${encodeURIComponent(tasksetId)}/tasks`),
  ])
  return {
    tasksetId,
    displayTitle: summaries.find((set) => set.tasksetId === tasksetId)?.displayTitle ?? tasksetId,
    assignments: apiAssignments.map(toAssignment),
  }
}

/** The solo cohort's assignment set (the room cohort resolves its id via GET /api/sessions/:code). */
export async function fetchStudentAssignmentSet(): Promise<AssignmentSet> {
  return fetchAssignmentSet(SOLO_ASSIGNMENT_SET_ID)
}
