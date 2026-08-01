/**
 * predict.ts — grading for "predict the output" quizzes (Day 2 loops).
 *
 * Compares the student's typed prediction to the assignment's expectedOutput after
 * normalizing whitespace. `accept` holds alternative phrasings (e.g. for the
 * infinite-loop quizzes) and is matched case-insensitively as a substring.
 */
export function normalizeOutput(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map((line) => line.replace(/\s+$/, ''))
  while (lines.length && lines[0].trim() === '') lines.shift()
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()
  return lines.join('\n')
}

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
