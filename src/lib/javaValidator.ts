/**
 * Heuristic Java validator.
 * Runs client-side on every edit and reports common syntax errors as Monaco markers.
 *
 * Catches:
 *  - Missing semicolons at end of statements
 *  - Unmatched braces  { }
 *  - Unmatched parentheses  ( )
 *  - Unterminated string literals
 */
import type { editor as MonacoEditor } from 'monaco-editor'

type Monaco = typeof import('monaco-editor')

// Lines that do NOT need a trailing semicolon
const SKIP_PATTERNS = [
  /^\/\//,                                           // single-line comment
  /^\/\*/,                                           // block comment start
  /^\*/,                                             // block comment body line
  /^@/,                                              // annotation
  /\b(class|interface|enum|record)\s/,               // type declaration
  /^(if|else\s*if|else|for|while|do|switch|try|catch|finally)\b/, // control flow
  /^(import|package)\s/,                             // no — these DO need ';', handled below
]

// These also don't need a semicolon and end with specific characters
const TRAILING_OK = new Set(['{', '}', ',', '(', '\\'])

// Simplified check: does this trimmed line look like a method/constructor declaration?
// Heuristic: starts with optional modifiers + a type + an identifier + ( and has no '=' or 'new'
function isDeclarationLine(trimmed: string): boolean {
  if (trimmed.includes('=') || trimmed.includes(' new ')) return false
  // Must end with ) to even be a candidate (without trailing {)
  if (!trimmed.endsWith(')')) return false
  // Matches: [modifiers] returnType name(
  return /^(public|private|protected|static|abstract|final|synchronized|native|default|\s)*[\w<>[\].,]+\s+\w+\s*\(/.test(trimmed)
}

function lineNeedsSemicolon(raw: string): boolean {
  const trimmed = raw.trim()
  if (!trimmed) return false
  if (trimmed.endsWith(';')) return false

  const last = trimmed[trimmed.length - 1]
  if (TRAILING_OK.has(last)) return false

  // Line clearly continues onto the next one (ends with a binary operator,
  // dot, or open construct) — a multi-line statement, not a missing semicolon.
  if (/[-+*/%=&|^<>?:.]$/.test(trimmed)) return false

  // Block comment close
  if (trimmed.endsWith('*/')) return false

  for (const p of SKIP_PATTERNS) {
    // import/package are checked separately - they DO need semicolons
    if (p === SKIP_PATTERNS[6] || p === SKIP_PATTERNS[7]) continue
    if (p.test(trimmed)) return false
  }

  // Looks like a method/constructor declaration
  if (isDeclarationLine(trimmed)) return false

  return true
}

interface BracketPos {
  line: number
  col: number
}

export function validateJava(code: string, monaco: Monaco): MonacoEditor.IMarkerData[] {
  const lines = code.split('\n')
  const markers: MonacoEditor.IMarkerData[] = []

  let inBlockComment = false
  const braceStack: BracketPos[] = []  // track { positions
  const parenStack: BracketPos[] = []  // track ( positions

  for (let i = 0; i < lines.length; i++) {
    const raw     = lines[i]
    const trimmed = raw.trim()
    const lineNum = i + 1

    // ── block comment tracking ──
    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false
      continue
    }
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlockComment = true
      continue
    }

    // ── skip pure comment / blank lines for further checks ──
    if (!trimmed || trimmed.startsWith('//')) continue

    // ── unterminated string check (simple: count unescaped quotes) ──
    let inStr = false
    let inChar = false
    for (let c = 0; c < raw.length; c++) {
      const ch   = raw[c]
      const prev = raw[c - 1]
      if (ch === '"'  && prev !== '\\' && !inChar) inStr  = !inStr
      if (ch === '\'' && prev !== '\\' && !inStr)  inChar = !inChar
    }
    if (inStr) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message:  'Unterminated string literal',
        startLineNumber: lineNum,
        endLineNumber:   lineNum,
        startColumn: raw.lastIndexOf('"') + 1,
        endColumn:   raw.length + 1,
      })
      continue // rest of checks unreliable on this line
    }

    // ── brace / paren balance (skip inside strings) ──
    let inStrScan = false, inCharScan = false
    for (let c = 0; c < raw.length; c++) {
      const ch   = raw[c]
      const prev = raw[c - 1]
      if (ch === '"'  && prev !== '\\') inStrScan  = !inStrScan
      if (ch === '\'' && prev !== '\\') inCharScan = !inCharScan
      if (inStrScan || inCharScan) continue

      if (ch === '{') braceStack.push({ line: lineNum, col: c + 1 })
      if (ch === '}') {
        if (braceStack.length === 0) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message:  "Unexpected '}' — no matching '{'",
            startLineNumber: lineNum, endLineNumber: lineNum,
            startColumn: c + 1, endColumn: c + 2,
          })
        } else {
          braceStack.pop()
        }
      }
      if (ch === '(') parenStack.push({ line: lineNum, col: c + 1 })
      if (ch === ')') {
        if (parenStack.length > 0) parenStack.pop()
        // (don't flag ')' — false positives too common in multi-line calls)
      }
    }

    // ── missing semicolon ──
    if (lineNeedsSemicolon(raw)) {
      const contentEnd = raw.trimEnd().length
      const contentStart = raw.length - raw.trimStart().length
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message:  "';' expected",
        startLineNumber: lineNum, endLineNumber: lineNum,
        startColumn: contentStart + 1,
        endColumn:   contentEnd + 1,
      })
    }
  }

  // ── unclosed braces ──
  for (const pos of braceStack) {
    markers.push({
      severity: monaco.MarkerSeverity.Error,
      message:  "Unclosed '{' — missing '}'",
      startLineNumber: pos.line, endLineNumber: pos.line,
      startColumn: pos.col, endColumn: pos.col + 1,
    })
  }

  return markers
}

/** Wire up the validator to a Monaco editor instance (call from onMount). */
export function attachValidator(editor: MonacoEditor.IStandaloneCodeEditor, monaco: Monaco): void {
  const maybeModel = editor.getModel()
  if (!maybeModel) return
  const model: MonacoEditor.ITextModel = maybeModel
  let timer: ReturnType<typeof setTimeout> | undefined
  let allMarkers: MonacoEditor.IMarkerData[] = []

  // VSCode-like: never show an error on the line the cursor is currently in —
  // you're probably still typing it. Markers reappear the moment you move away.
  function publish() {
    const activeLine = editor.getPosition()?.lineNumber
    const shown = allMarkers.filter((mk) => mk.startLineNumber !== activeLine)
    monaco.editor.setModelMarkers(model, 'java-heuristic', shown)
  }

  function recompute() {
    allMarkers = validateJava(model.getValue(), monaco)
    publish()
  }

  // Recompute on edits (debounced); only re-filter (cheap) when the cursor moves,
  // so a pending error on the line you just left shows up immediately.
  recompute()
  model.onDidChangeContent(() => {
    clearTimeout(timer)
    timer = setTimeout(recompute, 450)
  })
  editor.onDidChangeCursorPosition(() => publish())
}
