/**
 * assignmentSetApi.ts — the assignment-set data seam, backed by the real
 * backend (see the api repo's CONTRACT.md, "Assignments"). The contract is
 * unified on Assignment naming end to end — keep these URLs and field names
 * in lockstep with CONTRACT.md:
 *
 *   GET /api/assignmentsets                     → assignment-set picker summaries
 *   GET /api/assignmentsets/:id/assignments    → the set's assignments, sorted by position
 *
 * The wire shape is { id, kind, title, description, hint?, content } where
 * `content` holds the kind-specific fields — `toAssignment()` flattens it into
 * the frontend's discriminated `Assignment` union. Two deliberate differences
 * from the old hardcoded bundle:
 *
 *   - No `check()` — grading moved server-side (rules live in the DB). Code
 *     assignments won't auto-complete until the submissions endpoint lands;
 *     predict assignments still grade locally from `expectedOutput` / `accept`.
 *   - No `day` — a set IS one day's content; solo uses the all-assignments set.
 */
import type { Harness, Assignment, AssignmentKind, AssignmentSet } from '@types'

/** The assignment set the solo cohort hardcodes (CONTRACT.md, "Assignments"). */
export const SOLO_ASSIGNMENT_SET_ID = 'all-assignments-for-solo-2026'

export interface AssignmentSetSummary {
  assignmentSetId: string
  displayTitle: string
}

/** Wire shape of one assignment from GET /api/assignmentsets/:id/assignments. */
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

/** `GET /api/assignmentsets` — the teacher's session-creation picker. */
export async function fetchAssignmentSets(): Promise<AssignmentSetSummary[]> {
  return getJson<AssignmentSetSummary[]>('/api/assignmentsets')
}

/**
 * A full assignment set (summary + assignments). The assignments endpoint
 * doesn't return the display title, so it's resolved from the summaries list
 * in parallel.
 */
export async function fetchAssignmentSet(assignmentSetId: string): Promise<AssignmentSet> {
  const [summaries, apiAssignments] = await Promise.all([
    fetchAssignmentSets(),
    getJson<ApiAssignment[]>(`/api/assignmentsets/${encodeURIComponent(assignmentSetId)}/assignments`),
  ])
  return {
    assignmentSetId,
    displayTitle: summaries.find((set) => set.assignmentSetId === assignmentSetId)?.displayTitle ?? assignmentSetId,
    assignments: apiAssignments.map(toAssignment),
  }
}

/** The solo cohort's assignment set (the room cohort resolves its id via GET /api/sessions/:code). */
export async function fetchStudentAssignmentSet(): Promise<AssignmentSet> {
  return fetchAssignmentSet(SOLO_ASSIGNMENT_SET_ID)
}
