/**
 * predict.ts — grading for "predict the output" quizzes (Day 2 loops).
 *
 * Compares the student's typed prediction to the assignment's expectedOutput after
 * normalizing whitespace. `accept` holds alternative phrasings (e.g. for the
 * infinite-loop quizzes) and is matched case-insensitively as a substring.
 */
import { normalizeOutput } from './grade'

export function isPredictionCorrect(
  answer: string,
  expectedOutput: string,
  accept: string[] = [],
): boolean {
  const normalized = normalizeOutput(answer)
  if (normalized === normalizeOutput(expectedOutput)) return true
  const lower = normalized.toLowerCase()
  return accept.some((phrase) => lower.includes(phrase.trim().toLowerCase()))
}
