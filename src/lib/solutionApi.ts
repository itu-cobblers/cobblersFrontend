/**
 * GET /api/assignments/:id/solution — deliberately generic, gate-free seam
 * (see CONTRACT.md's Solution section / SCHEMA.md). The backend only answers
 * "does this assignment have a stored sample solution" — every "when is a
 * student allowed to see it" rule lives on the caller (see
 * StudentView.hooks.ts's per-kind reveal logic). Degrades to "unavailable" on
 * any failure, same style as `fetchSubmissionHistory`/`fetchTodayLatestSession`.
 */
import type { SourceFile } from '@types'

export interface SolutionResult {
  available: boolean
  /** Normalized to a file list regardless of whether the backend stored a single string or multiple files. */
  files: SourceFile[]
}

const UNAVAILABLE: SolutionResult = { available: false, files: [] }

export async function getAssignmentSolution(assignmentId: number): Promise<SolutionResult> {
  try {
    const res = await fetch(`/api/assignments/${assignmentId}/solution`)
    if (!res.ok) return UNAVAILABLE

    const body: unknown = await res.json()
    if (typeof body !== 'object' || body === null || !('available' in body) || body.available !== true) {
      return UNAVAILABLE
    }
    const solution = 'solution' in body ? body.solution : null
    return { available: true, files: normalizeFiles(solution) }
  } catch {
    return UNAVAILABLE
  }
}

function normalizeFiles(solution: unknown): SourceFile[] {
  if (typeof solution === 'string') {
    return [{ name: 'Main.java', content: solution }]
  }
  if (Array.isArray(solution)) {
    return solution.filter(isSourceFile)
  }
  return []
}

function isSourceFile(value: unknown): value is SourceFile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'content' in value &&
    typeof value.name === 'string' &&
    typeof value.content === 'string'
  )
}
