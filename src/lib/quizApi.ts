import { getStudentId } from './identity'

/**
 * Predict-quiz answer check. The single seam to `POST /api/quiz/check`.
 */
export interface QuizCheckArgs {
  assignmentId: number
  answer: string
}

export interface QuizCheckResult {
  correct: boolean
}

export async function checkPrediction({
  assignmentId,
  answer,
}: QuizCheckArgs): Promise<QuizCheckResult> {
  const res = await fetch('/api/quiz/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: getStudentId(), assignmentId, answer }),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}
