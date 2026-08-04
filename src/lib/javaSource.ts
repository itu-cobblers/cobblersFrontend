/**
 * Shared lexical scanning for the Java tooling (validator + completions).
 *
 * `sanitizeJava` walks the source once, character by character, and returns a
 * copy where comments and string/char *contents* are blanked out with spaces
 * (delimiters are kept, so every line keeps its exact length and columns).
 * Downstream heuristics can then treat any remaining `{`, `(`, `;` or `//` as
 * real code — which is what fixes "code followed by an inline // comment"
 * being misread, `//` inside string literals, and `{` inside comments.
 *
 * It also reports unterminated string/char literals (Java literals cannot
 * span lines) and the lexer state at the end of the text, which the
 * completion providers use to stay silent inside strings and comments.
 */

export type JavaScanState = 'code' | 'string' | 'char' | 'lineComment' | 'blockComment'

export interface UnterminatedLiteral {
  /** 1-based line number */
  line: number
  /** 1-based column of the opening quote */
  column: number
  kind: 'string' | 'char'
}

export interface SanitizedJava {
  /** Same line count and line lengths as the input */
  lines: string[]
  unterminated: UnterminatedLiteral[]
  /** Lexer state at the very end of the text (e.g. at a cursor position) */
  endState: JavaScanState
}

export function sanitizeJava(code: string): SanitizedJava {
  const lines: string[] = []
  const unterminated: UnterminatedLiteral[] = []
  let current = ''
  let state: JavaScanState = 'code'
  let escaped = false
  let openQuoteColumn = 0

  function endLine(): void {
    if (state === 'string' || state === 'char') {
      unterminated.push({ line: lines.length + 1, column: openQuoteColumn, kind: state })
      state = 'code'
      escaped = false
    }
    if (state === 'lineComment') state = 'code'
    lines.push(current)
    current = ''
  }

  for (let i = 0; i < code.length; i++) {
    const ch = code[i]
    if (ch === '\n') {
      endLine()
      continue
    }

    switch (state) {
      case 'code':
        if (ch === '"') {
          state = 'string'
          openQuoteColumn = current.length + 1
          current += ch
        } else if (ch === '\'') {
          state = 'char'
          openQuoteColumn = current.length + 1
          current += ch
        } else if (ch === '/' && code[i + 1] === '/') {
          state = 'lineComment'
          current += '  '
          i++
        } else if (ch === '/' && code[i + 1] === '*') {
          state = 'blockComment'
          current += '  '
          i++
        } else {
          current += ch
        }
        break

      case 'string':
      case 'char': {
        const quote = state === 'string' ? '"' : '\''
        if (escaped) {
          escaped = false
          current += ' '
        } else if (ch === '\\') {
          escaped = true
          current += ' '
        } else if (ch === quote) {
          state = 'code'
          current += ch
        } else {
          current += ' '
        }
        break
      }

      case 'lineComment':
        current += ' '
        break

      case 'blockComment':
        if (ch === '*' && code[i + 1] === '/') {
          current += '  '
          i++
          state = 'code'
        } else {
          current += ' '
        }
        break
    }
  }

  // State *before* the final line flush is the honest cursor context — the
  // flush below only exists to recover for the next line.
  const endState = state
  endLine()

  return { lines, unterminated, endState }
}
