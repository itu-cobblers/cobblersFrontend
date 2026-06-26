import { getStudentId } from './identity'
import { isPredictionCorrect } from './predict'

/**
 * Predict-quiz answer check. The single seam to the (future) answer-collection
 * endpoint `POST /api/quiz/check`. Until the backend implements it, this falls
 * back to grading locally with predict.ts — so when the endpoint lands, no
 * frontend change is needed (same pattern as executeApi).
 */
export interface QuizCheckArgs {
  taskId: number
  answer: string
  expectedOutput: string
  accept?: string[]
}

export interface QuizCheckResult {
  correct: boolean
}

export async function checkPrediction({
  taskId,
  answer,
  expectedOutput,
  accept = [],
}: QuizCheckArgs): Promise<QuizCheckResult> {
  try {
    const res = await fetch('/api/quiz/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: getStudentId(), taskId, answer }),
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    return await res.json()
  } catch (err) {
    // ─────────────── LOCAL FALLBACK — remove when /api/quiz/check is live ───────────────
    const reason = err instanceof Error ? err.message : String(err)
    console.warn('[quiz] backend unavailable, grading locally:', reason)
    return { correct: isPredictionCorrect(answer, expectedOutput, accept) }
    // ──────────────────────────── END LOCAL FALLBACK ─────────────────────────────────
  }
}
