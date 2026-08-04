/**
 * Heuristic Java validator.
 *
 * `collectJavaIssues` is pure (unit-tested, no Monaco) and works on the
 * comment/string-blanked source from `sanitizeJava`, so inline `// comments`,
 * `//` inside string literals and `{` inside comments can never confuse it.
 *
 * Catches, conservatively (zero false positives beats completeness):
 *  - Missing semicolons at end of statements
 *  - Unmatched braces  { }
 *  - Unclosed parentheses at end of file
 *  - Unterminated string / char literals
 *
 * `attachValidator` wires it to the editor with a two-stage cadence:
 * other lines are re-checked ~300ms after you stop typing, while the line
 * you are typing on holds its markers back until you pause for ~1.2s or
 * move the caret off the line — no more "errors only show after leaving
 * the line", but also no red squiggle flashing mid-word.
 */
import type { editor as MonacoEditor } from 'monaco-editor'
import { sanitizeJava } from './javaSource'

type Monaco = typeof import('monaco-editor')

export interface JavaIssue {
  message: string
  /** 1-based */
  line: number
  /** 1-based */
  startColumn: number
  endColumn: number
}

// ── missing-semicolon heuristics (all run on sanitized, trimmed lines) ───────

// Lines that legitimately end without a semicolon.
const NO_SEMICOLON_PATTERNS: RegExp[] = [
  /^@/,                                                             // annotation
  /\b(class|interface|enum|record)\s/,                              // type declaration
  /^(if|else\s+if|else|for|while|do|switch|try|catch|finally)\b/,   // control flow
]

// Note: import/package are NOT exempt — they do need a semicolon.

// A line ending in one of these continues or closes a block, no ';' expected.
const TRAILING_OK = new Set(['{', '}', ',', '('])

// The statement visibly continues onto the next line.
const CONTINUES_BELOW = /[-+*/%=&|^<>?:.]$/

// The NEXT line starts mid-statement (method chaining, split conditions…),
// so the current line isn't a statement end either.
const CONTINUATION_START = /^[.+\-*/%=?:&|<>)]/

// Simplified check: does this line look like a method/constructor declaration
// whose `{` sits on the next line? Starts with optional modifiers + a type +
// an identifier + `(`, and has no `=` or `new`.
function isDeclarationLine(trimmed: string): boolean {
  if (trimmed.includes('=') || trimmed.includes(' new ')) return false
  if (!trimmed.endsWith(')')) return false
  return /^(public|private|protected|static|abstract|final|synchronized|native|default|\s)*[\w<>[\].,]+\s+\w+\s*\(/.test(trimmed)
}

function lineNeedsSemicolon(trimmed: string): boolean {
  if (!trimmed) return false
  if (trimmed.endsWith(';')) return false

  // `i++` / `x--` at end of line is a finished statement, not a continuation.
  if (/(\+\+|--)$/.test(trimmed)) return true

  const last = trimmed[trimmed.length - 1]
  if (TRAILING_OK.has(last)) return false
  if (CONTINUES_BELOW.test(trimmed)) return false

  for (const pattern of NO_SEMICOLON_PATTERNS) {
    if (pattern.test(trimmed)) return false
  }
  if (isDeclarationLine(trimmed)) return false

  return true
}

function nextLineContinues(lines: string[], index: number): boolean {
  for (let j = index + 1; j < lines.length; j++) {
    const next = lines[j].trim()
    if (!next) continue
    return CONTINUATION_START.test(next)
  }
  return false
}

// ── issue collection (pure) ──────────────────────────────────────────────────

interface BracketPos {
  line: number
  col: number
}

export function collectJavaIssues(code: string): JavaIssue[] {
  const { lines, unterminated } = sanitizeJava(code)
  const issues: JavaIssue[] = []

  const unterminatedLines = new Set<number>()
  for (const literal of unterminated) {
    unterminatedLines.add(literal.line)
    issues.push({
      message: literal.kind === 'string'
        ? 'String is missing its closing double quote (")'
        : "Character is missing its closing single quote (')",
      line: literal.line,
      startColumn: literal.column,
      endColumn: lines[literal.line - 1].length + 1,
    })
  }

  const braceStack: BracketPos[] = []
  const parenStack: BracketPos[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1
    const trimmed = line.trim()
    if (!trimmed) continue

    // ── brace / paren balance ──
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      if (ch === '{') {
        braceStack.push({ line: lineNum, col: c + 1 })
      } else if (ch === '}') {
        if (braceStack.length === 0) {
          issues.push({
            message: "Unexpected '}' — it has no matching '{'",
            line: lineNum,
            startColumn: c + 1,
            endColumn: c + 2,
          })
        } else {
          braceStack.pop()
        }
      } else if (ch === '(') {
        parenStack.push({ line: lineNum, col: c + 1 })
      } else if (ch === ')' && parenStack.length > 0) {
        parenStack.pop()
        // A stray ')' stays unflagged: false positives too common mid-edit.
      }
    }

    // ── missing semicolon ──
    if (unterminatedLines.has(lineNum)) continue  // line is already broken
    if (parenStack.length > 0) continue           // inside an open (...) — args continue
    if (nextLineContinues(lines, i)) continue     // next line chains onto this one
    if (lineNeedsSemicolon(trimmed)) {
      issues.push({
        message: "Missing ';' — Java statements end with a semicolon",
        line: lineNum,
        startColumn: line.length - line.trimStart().length + 1,
        endColumn: line.trimEnd().length + 1,
      })
    }
  }

  for (const pos of braceStack) {
    issues.push({
      message: "Unclosed '{' — add a matching '}'",
      line: pos.line,
      startColumn: pos.col,
      endColumn: pos.col + 1,
    })
  }
  for (const pos of parenStack) {
    issues.push({
      message: "Unclosed '(' — add a matching ')'",
      line: pos.line,
      startColumn: pos.col,
      endColumn: pos.col + 1,
    })
  }

  return issues.sort((a, b) => a.line - b.line || a.startColumn - b.startColumn)
}

export function validateJava(code: string, monaco: Monaco): MonacoEditor.IMarkerData[] {
  return collectJavaIssues(code).map((issue) => ({
    severity: monaco.MarkerSeverity.Error,
    message: issue.message,
    startLineNumber: issue.line,
    endLineNumber: issue.line,
    startColumn: issue.startColumn,
    endColumn: issue.endColumn,
  }))
}

// ── editor wiring ────────────────────────────────────────────────────────────

/** Re-check this soon after the last keystroke (all lines except the held one). */
const VALIDATE_DEBOUNCE_MS = 300
/** A pause this long means "done with this line" — reveal its markers too. */
const ACTIVE_LINE_REVEAL_MS = 1200

const MARKER_OWNER = 'java-heuristic'

/** Wire up the validator to a Monaco editor instance (call from onMount). */
export function attachValidator(editor: MonacoEditor.IStandaloneCodeEditor, monaco: Monaco): void {
  let validateTimer: ReturnType<typeof setTimeout> | undefined
  let revealTimer: ReturnType<typeof setTimeout> | undefined
  let markers: MonacoEditor.IMarkerData[] = []
  // The line currently being typed on; its markers are held back briefly.
  let heldLine: number | null = null

  function publish(): void {
    const model = editor.getModel()
    if (!model || model.isDisposed()) return
    const shown = heldLine === null
      ? markers
      : markers.filter((marker) => marker.startLineNumber !== heldLine)
    monaco.editor.setModelMarkers(model, MARKER_OWNER, shown)
  }

  function recompute(): void {
    const model = editor.getModel()
    if (!model || model.isDisposed()) return
    markers = validateJava(model.getValue(), monaco)
    publish()
  }

  function revealHeldLine(): void {
    heldLine = null
    publish()
  }

  function handleContentChange(event: MonacoEditor.IModelContentChangedEvent): void {
    // Hold markers back only for ordinary same-line typing. Enter, paste and
    // other multi-line edits are a natural "done with this line" signal.
    const isSameLineTyping = event.changes.length > 0 && event.changes.every(
      (change) => change.range.startLineNumber === change.range.endLineNumber && !change.text.includes('\n'),
    )
    heldLine = isSameLineTyping ? event.changes[0].range.startLineNumber : null
    clearTimeout(validateTimer)
    clearTimeout(revealTimer)
    validateTimer = setTimeout(recompute, VALIDATE_DEBOUNCE_MS)
    if (heldLine !== null) revealTimer = setTimeout(revealHeldLine, ACTIVE_LINE_REVEAL_MS)
  }

  function handleCursorChange(event: MonacoEditor.ICursorPositionChangedEvent): void {
    // Leaving the line you were typing on reveals its errors immediately.
    if (heldLine === null || event.position.lineNumber === heldLine) return
    clearTimeout(validateTimer)
    clearTimeout(revealTimer)
    heldLine = null
    recompute()
  }

  function handleDispose(): void {
    clearTimeout(validateTimer)
    clearTimeout(revealTimer)
  }

  recompute()
  editor.onDidChangeModelContent(handleContentChange)
  editor.onDidChangeCursorPosition(handleCursorChange)
  editor.onDidDispose(handleDispose)
}
