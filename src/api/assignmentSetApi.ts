import type {
  Assignment,
  AssignmentSet,
  AssignmentSetSummaryDto,
  ApiAssignmentDto,
  SourceFileDto,
  LessonBlock
} from '@types'

export const SOLO_ASSIGNMENT_SET_ID = 'all-assignments-for-solo-2026'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

/** Flatten the wire assignment (kind-specific payload in `content`) into an `Assignment`. */
function toAssignment(dto: ApiAssignmentDto): Assignment {
  const base = {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    lesson: dto.lesson as LessonBlock[] | undefined,
    hint: dto.hint,
    solution: dto.solution,
  }
  switch (dto.kind) {
    case 'code': {
      const content = dto.content as { starter?: string; stdin?: string; starterFiles?: SourceFileDto[]; entryClass?: string }
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

export async function fetchAssignmentSets(): Promise<AssignmentSetSummaryDto[]> {
  return getJson<AssignmentSetSummaryDto[]>('/api/assignmentsets')
}

export async function fetchAssignmentSet(assignmentSetId: string): Promise<AssignmentSet> {
  const [summaries, apiAssignments] = await Promise.all([
    getJson<AssignmentSetSummaryDto[]>('/api/assignmentsets'),
    getJson<ApiAssignmentDto[]>(`/api/assignmentsets/${encodeURIComponent(assignmentSetId)}/assignments`),
  ])
  return {
    assignmentSetId,
    displayTitle: summaries.find((set) => set.assignmentSetId === assignmentSetId)?.displayTitle ?? assignmentSetId,
    assignments: apiAssignments.map(toAssignment),
  }
}

export async function fetchSoloAssignmentSet(): Promise<AssignmentSet> {
  return fetchAssignmentSet(SOLO_ASSIGNMENT_SET_ID)
}

export async function fetchAssignmentsByIds(ids: number[], includeSolution = true): Promise<Assignment[]> {
  if (ids.length === 0) return []

  const params = new URLSearchParams()
  ids.forEach(id => params.append('ids', id.toString()))
  if (includeSolution) {
    params.append('includeSolution', 'true')
  }

  const dtos = await getJson<ApiAssignmentDto[]>(`/api/assignments?${params.toString()}`)
  return dtos.map(toAssignment)
}