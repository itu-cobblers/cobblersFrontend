import type { SourceFileDto, SubmissionRequestDto, SubmissionResponseDto, SubmissionHistoryDto, SolutionResponseDto, SubmissionDetailDto } from '@types'
import { getStudentId } from '@lib/identity.ts'

export async function submitAssignment({
                                         assignmentId,
                                         content,
                                         sessionCode,
                                       }: {
  assignmentId: number
  content: string | SourceFileDto[]
  sessionCode?: string
}): Promise<SubmissionResponseDto> {
  const body: SubmissionRequestDto = {
    studentId: getStudentId(),
    content,
  }
  if (sessionCode) body.sessionId = sessionCode

  const res = await fetch(`/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}

export async function fetchSubmissionHistory(studentId: string): Promise<SubmissionHistoryDto[]> {
  try {
    const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/submissions`)
    if (!res.ok) return []
    return (await res.json()) as SubmissionHistoryDto[]
  } catch {
    return []
  }
}

export async function fetchSubmissionDetailsById(submissionId: string): Promise<SubmissionDetailDto | null> {
  const res = await fetch(`/api/submissions/${submissionId}`)
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`API returned ${res.status}`)
  }
  return (await res.json()) as SubmissionDetailDto
}

export async function fetchAssignmentSolution(assignmentId: number): Promise<SolutionResponseDto> {
  try {
    const res = await fetch(`/api/assignments/${assignmentId}/solution`)
    if (!res.ok) return { solution: null }
    return (await res.json()) as SolutionResponseDto
  } catch {
    return { solution: null }
  }
}