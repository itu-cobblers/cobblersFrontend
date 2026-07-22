/**
 * grade.ts — shared, framework-agnostic helpers for grading stdout and for
 * inspecting the structure of the student's Java source.
 *
 * Used by assignment `check()` functions in assignments.ts and by predict-quiz grading
 * (predict.ts). Output comparison is lenient about surrounding whitespace
 * (beginners shouldn't fail on a trailing space) but otherwise faithful.
 *
 * Code inspection is deliberately heuristic (regex over stripped source, not an
 * AST — same philosophy as javaValidator.ts). Structural checks must run on
 * `stripCode(code)` so comments and string literals can't fake a match;
 * checks that need to see printed literals use `stripComments(code)` instead.
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

// ─────────────────────────── code inspection ───────────────────────────

/**
 * Remove line comments and block comments, leaving string and char literals
 * intact (a `//` inside "a string" is not a comment). Comment bytes are
 * replaced with spaces so line/column positions survive.
 */
export function stripComments(code: string): string {
  let out = ''
  let i = 0
  let mode: 'code' | 'string' | 'char' | 'line' | 'block' = 'code'
  while (i < code.length) {
    const ch = code[i]
    const next = code[i + 1]
    if (mode === 'code') {
      if (ch === '/' && next === '/') { mode = 'line'; out += '  '; i += 2; continue }
      if (ch === '/' && next === '*') { mode = 'block'; out += '  '; i += 2; continue }
      if (ch === '"') mode = 'string'
      if (ch === "'") mode = 'char'
      out += ch
    } else if (mode === 'string' || mode === 'char') {
      if (ch === '\\') { out += ch + (next ?? ''); i += 2; continue }
      if (mode === 'string' && ch === '"') mode = 'code'
      if (mode === 'char' && ch === "'") mode = 'code'
      out += ch
    } else if (mode === 'line') {
      if (ch === '\n') { mode = 'code'; out += ch } else out += ' '
    } else {
      if (ch === '*' && next === '/') { mode = 'code'; out += '  '; i += 2; continue }
      out += ch === '\n' ? ch : ' '
    }
    i++
  }
  return out
}

/** Empty every string/char literal (`"so this"` → `""`), honoring `\"` escapes. */
export function stripStrings(code: string): string {
  let out = ''
  let i = 0
  let mode: 'code' | 'string' | 'char' = 'code'
  while (i < code.length) {
    const ch = code[i]
    if (mode === 'code') {
      if (ch === '"') mode = 'string'
      if (ch === "'") mode = 'char'
      out += ch
    } else {
      if (ch === '\\') { i += 2; continue }
      if (mode === 'string' && ch === '"') { mode = 'code'; out += ch }
      else if (mode === 'char' && ch === "'") { mode = 'code'; out += ch }
    }
    i++
  }
  return out
}

/**
 * Comments and string-literal contents removed — the input every structural
 * regex check should run on, so `// c2f(` or `"while"` can't fake a match.
 */
export function stripCode(code: string): string {
  return stripStrings(stripComments(code))
}

/** Collect the argument text of every match of `open` (a regex ending on `(`). */
function collectCallArgs(source: string, open: RegExp): string[] {
  const args: string[] = []
  let match = open.exec(source)
  while (match) {
    let depth = 1
    let i = open.lastIndex
    let mode: 'code' | 'string' | 'char' = 'code'
    while (i < source.length && depth > 0) {
      const ch = source[i]
      if (mode === 'code') {
        if (ch === '(') depth++
        else if (ch === ')') depth--
        else if (ch === '"') mode = 'string'
        else if (ch === "'") mode = 'char'
      } else if (ch === '\\') {
        i++
      } else if (mode === 'string' && ch === '"') mode = 'code'
      else if (mode === 'char' && ch === "'") mode = 'code'
      i++
    }
    if (depth === 0) args.push(source.slice(open.lastIndex, i - 1).trim())
    open.lastIndex = i
    match = open.exec(source)
  }
  return args
}

/**
 * The raw argument text of every `System.out.print`/`println` call, in source
 * order. Runs on comment-stripped code so a printed-out example in a comment
 * doesn't count; string literals are kept so checks can inspect them.
 */
export function printlnArgs(code: string): string[] {
  return collectCallArgs(stripComments(code), /System\s*\.\s*out\s*\.\s*print(?:ln)?\s*\(/g)
}

/**
 * The argument text of every CALL to the function `name` (declarations —
 * argument lists containing parameter types — are filtered out). Runs on
 * comment-stripped code with string literals kept, so two calls that differ
 * only in their String argument still count as different.
 */
export function callArgs(code: string, name: string): string[] {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return collectCallArgs(stripComments(code), new RegExp(`\\b${escaped}\\s*\\(`, 'g'))
    .filter((argText) => !/\b(?:String|int|double|boolean)\s+\w+/.test(argText))
}
