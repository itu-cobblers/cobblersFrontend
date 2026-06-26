/**
 * grade.ts — shared, framework-agnostic helpers for grading stdout.
 *
 * Used by task `check()` functions in tasks.ts and by predict-quiz grading
 * (predict.ts). Output comparison is lenient about surrounding whitespace
 * (beginners shouldn't fail on a trailing space) but otherwise faithful.
 */

/** Trim trailing whitespace per line and drop leading/trailing blank lines. */
export function normalizeOutput(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map((line) => line.replace(/\s+$/, ''))
  while (lines.length && lines[0].trim() === '') lines.shift()
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()
  return lines.join('\n')
}

export function outputLines(text: string): string[] {
  const normalized = normalizeOutput(text)
  return normalized === '' ? [] : normalized.split('\n')
}

/** True if some output line equals `line` (both trimmed). */
export function includesLine(output: string, line: string): boolean {
  const target = line.trim()
  return outputLines(output).some((l) => l.trim() === target)
}

/** True if every token appears somewhere in the normalized output. */
export function includesAll(output: string, tokens: string[]): boolean {
  const normalized = normalizeOutput(output)
  return tokens.every((token) => normalized.includes(token))
}

/** True if the (raw) output matches the pattern. */
export function matches(output: string, pattern: RegExp): boolean {
  return pattern.test(output)
}
