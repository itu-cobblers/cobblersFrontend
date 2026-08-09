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
 *  - Redeclaring the same variable name in the same scope
 *  - Assigning a literal of the obviously wrong kind (a quoted string to an
 *    `int`, a number to a `boolean`, …) to an already-declared variable
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

// ── redeclared-variable heuristics ───────────────────────────────────────────

const PRIMITIVE_TYPES = new Set(['int', 'long', 'short', 'byte', 'float', 'double', 'boolean', 'char', 'var'])

// Strips array brackets and a trailing single-level generic, e.g.
// `ArrayList<Integer>` → `ArrayList`, `int[]` → `int`.
function baseType(type: string): string {
  return type.replace(/(\[\])+$/, '').replace(/<[^<>]*>$/, '')
}

// Only treat a leading identifier pair as a declaration (not a plain
// assignment like `x = 5;`) when the first identifier looks like a real
// type: a known primitive, or capitalised by Java class-naming convention.
function isTypeToken(type: string): boolean {
  const base = baseType(type)
  return PRIMITIVE_TYPES.has(base) || /^[A-Z]/.test(base)
}

// `for (int i = 0; …)` / `catch (Exception e)` introduce a variable scoped
// to the block that follows, not the block the `for`/`catch` line sits in —
// tracked separately so two sibling for-loops reusing `i` aren't flagged.
const FOR_LOOP_DECL = /^for\s*\(\s*(?:final\s+)?([A-Za-z_$][\w$]*(?:<[^<>]*>)?(?:\[\])*)\s+([A-Za-z_$][\w$]*)\s*=/
const CATCH_DECL = /^\}?\s*catch\s*\(\s*([\w$.<>[\],|\s]+?)\s+([A-Za-z_$][\w$]*)\s*\)/

// ── for/while loop header syntax ─────────────────────────────────────────────

// `for (Type item : collection)` — the for-each form has no semicolons at all,
// so it's excluded from the semicolon-count check below.
const FOR_EACH_HEADER = /^for\s*\(\s*(?:final\s+)?[\w$.]+(?:<[^()]*>)?(?:\[\])*\s+[A-Za-z_$][\w$]*\s*:/

function findMatchingParen(text: string, openIndex: number): number {
  let depth = 0
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === '(') depth++
    else if (text[i] === ')') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

// A `for (name = …; …)` init clause with no type is only valid if `name` was
// declared earlier — as a local, or as a field this validator's scope
// tracking doesn't see (it only registers `Type name …` lines, so a
// modifier-prefixed field like `private int i;` is invisible to it).
// Deliberately over-matches — `return i;` looks like a declaration too — so
// we skip flagging rather than risk a false "never declared" on code this
// heuristic can't fully see.
function isDeclaredLoosely(name: string, lines: string[]): boolean {
  const pattern = new RegExp(`[A-Za-z_$][\\w$]*(?:<[^<>]*>)?(?:\\[\\])*\\s+${name}\\s*(=(?!=)|;|,|:)`)
  return lines.some((l) => pattern.test(l))
}

const VAR_DECL = /^(?:final\s+)?([A-Za-z_$][\w$]*(?:<[^<>]*>)?(?:\[\])*)\s+([A-Za-z_$][\w$]*)\s*(=|;|,)/
// Group 2 (the initializer, if any) is deliberately not parenthesis-aware —
// a method-call initializer like `Math.max(1, 2)` never matches
// `classifyLiteral` anyway, so misreading its inner comma as the list
// separator can't produce a false mismatch, only a missed one.
const VAR_DECL_CONTINUATION = /^\s*,\s*([A-Za-z_$][\w$]*)\s*(?:=([^,;]*))?(,|;)/

// ── obviously-wrong-literal heuristics ───────────────────────────────────────

type DeclaredKind = 'numeric' | 'boolean' | 'char' | 'string' | 'other'
type LiteralKind = 'string' | 'char' | 'boolean' | 'number'

const NUMERIC_TYPES = new Set(['int', 'long', 'short', 'byte', 'float', 'double'])

function declaredKind(type: string): DeclaredKind {
  const base = baseType(type)
  if (NUMERIC_TYPES.has(base)) return 'numeric'
  if (base === 'boolean') return 'boolean'
  if (base === 'char') return 'char'
  if (base === 'String') return 'string'
  return 'other'
}

// Only classifies unambiguous literals — a bare reference, method call or
// expression (`b`, `foo()`, `x + 1`) yields `null` and is left unchecked.
function classifyLiteral(expr: string): LiteralKind | null {
  if (/^"[^"]*"$/.test(expr)) return 'string'
  if (/^'[^']*'$/.test(expr)) return 'char'
  if (/^(true|false)$/.test(expr)) return 'boolean'
  if (/^[+-]?\d+(\.\d+)?[fFdDlL]?$/.test(expr)) return 'number'
  return null
}

// char accepts a numeric literal (a code point, e.g. `char c = 65;`); every
// other cross-kind pairing is a genuine Java compile error.
function isLiteralMismatch(kind: DeclaredKind, literal: LiteralKind): boolean {
  switch (kind) {
    case 'numeric': return literal !== 'number'
    case 'boolean': return literal !== 'boolean'
    case 'char': return literal !== 'char' && literal !== 'number'
    case 'string': return literal !== 'string'
    case 'other': return false
  }
}

const KIND_LABEL: Record<DeclaredKind | LiteralKind, string> = {
  numeric: 'a number',
  number: 'a number',
  boolean: 'true or false',
  char: 'a single character in single quotes',
  string: 'text in double quotes',
  other: '',
}

// A plain reassignment `name = value;` — declarations (`Type name = value;`)
// never match since they have a second identifier between `name` and `=`.
const ASSIGN_PREFIX = /^([A-Za-z_$][\w$]*)\s*=(?!=)\s*/

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

  interface VarInfo {
    line: number
    type: string
  }

  const braceStack: BracketPos[] = []
  const parenStack: BracketPos[] = []
  // One Map per open brace depth: declared-name → where/what it was declared
  // as. Vars declared by an upcoming `for`/`catch` header are held in
  // pendingScopeVars until the block they actually belong to opens.
  const scopeStack: Map<string, VarInfo>[] = []
  let pendingScopeVars: { name: string; type: string }[] = []

  function lookupType(name: string): string | undefined {
    for (let s = scopeStack.length - 1; s >= 0; s--) {
      const found = scopeStack[s].get(name)
      if (found) return found.type
    }
    return undefined
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1
    const trimmed = line.trim()
    if (!trimmed) continue

    const forMatch = FOR_LOOP_DECL.exec(trimmed)
    if (forMatch) pendingScopeVars.push({ name: forMatch[2], type: forMatch[1] })
    const catchMatch = CATCH_DECL.exec(trimmed)
    if (catchMatch) pendingScopeVars.push({ name: catchMatch[2], type: catchMatch[1] })

    // ── brace / paren balance ──
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      if (ch === '{') {
        braceStack.push({ line: lineNum, col: c + 1 })
        scopeStack.push(new Map(pendingScopeVars.map((v) => [v.name, { line: lineNum, type: v.type }])))
        pendingScopeVars = []
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
          scopeStack.pop()
        }
      } else if (ch === '(') {
        parenStack.push({ line: lineNum, col: c + 1 })
      } else if (ch === ')' && parenStack.length > 0) {
        parenStack.pop()
        // A stray ')' stays unflagged: false positives too common mid-edit.
      }
    }

    // ── for/while loop header syntax ──
    const indentForLoopHeader = line.length - line.trimStart().length
    if (/^for\b/.test(trimmed)) {
      if (!/^for\s*\(/.test(trimmed)) {
        issues.push({
          message: "Missing '(' — for needs its header in parentheses: for (init; condition; update)",
          line: lineNum,
          startColumn: indentForLoopHeader + 1,
          endColumn: line.trimEnd().length + 1,
        })
      } else {
        const openIdx = trimmed.indexOf('(')
        const closeIdx = findMatchingParen(trimmed, openIdx)
        if (closeIdx !== -1 && !FOR_EACH_HEADER.test(trimmed)) {
          const inner = trimmed.slice(openIdx + 1, closeIdx)
          const semiOffsets: number[] = []
          for (let k = 0; k < inner.length; k++) {
            if (inner[k] === ';') semiOffsets.push(k)
          }
          if (semiOffsets.length > 2) {
            const lastOffset = semiOffsets[semiOffsets.length - 1]
            const trailingEmpty = inner.slice(lastOffset + 1).trim() === ''
            const anchor = trailingEmpty ? lastOffset : semiOffsets[2]
            const absIndex = openIdx + 1 + anchor
            const startColumn = indentForLoopHeader + absIndex + 1
            issues.push({
              message: trailingEmpty && semiOffsets.length === 3
                ? "Unexpected ';' — a for-loop header only has two: for (init; condition; update)"
                : "Too many ';' in the for-loop header — expected exactly two: for (init; condition; update)",
              line: lineNum,
              startColumn,
              endColumn: startColumn + 1,
            })
          } else if (semiOffsets.length < 2) {
            const startColumn = indentForLoopHeader + closeIdx + 1
            issues.push({
              message: `Missing ';' — for (init; condition; update) needs two semicolons, found ${semiOffsets.length}`,
              line: lineNum,
              startColumn,
              endColumn: startColumn + 1,
            })
          } else if (!forMatch) {
            // Well-formed two-semicolon header, but the init clause is a bare
            // `name = …` rather than `Type name = …` — check the name was
            // ever declared before flagging "never declared".
            const initRaw = inner.slice(0, semiOffsets[0])
            const bareAssign = /^(\s*)([A-Za-z_$][\w$]*)\s*=(?!=)/.exec(initRaw)
            if (bareAssign) {
              const varName = bareAssign[2]
              if (!lookupType(varName) && !isDeclaredLoosely(varName, lines)) {
                const absIndex = openIdx + 1 + bareAssign[1].length
                const startColumn = indentForLoopHeader + absIndex + 1
                issues.push({
                  message: `'${varName}' is used here but was never declared — write 'for (int ${varName} = …; …)' the first time you introduce it`,
                  line: lineNum,
                  startColumn,
                  endColumn: startColumn + varName.length,
                })
              }
            }
          }
        }
      }
    }
    if (/^\}?\s*while\b/.test(trimmed) && !/^\}?\s*while\s*\(/.test(trimmed)) {
      issues.push({
        message: "Missing '(' — while needs a condition in parentheses: while (condition)",
        line: lineNum,
        startColumn: indentForLoopHeader + 1,
        endColumn: line.trimEnd().length + 1,
      })
    }

    // ── redeclared variable ──
    const currentScope = scopeStack[scopeStack.length - 1]
    const isControlFlowOrDecl = NO_SEMICOLON_PATTERNS.some((pattern) => pattern.test(trimmed)) || isDeclarationLine(trimmed)
    if (currentScope && !unterminatedLines.has(lineNum) && !isControlFlowOrDecl) {
      const declMatch = VAR_DECL.exec(trimmed)
      if (declMatch && isTypeToken(declMatch[1])) {
        const indent = line.length - line.trimStart().length
        const type = declMatch[1]

        const registerName = (name: string, offsetInTrimmed: number): void => {
          const existing = currentScope.get(name)
          const startColumn = indent + offsetInTrimmed + 1
          if (existing) {
            issues.push({
              message: `Variable '${name}' is already declared in this scope (see line ${existing.line})`,
              line: lineNum,
              startColumn,
              endColumn: startColumn + name.length,
            })
          } else {
            currentScope.set(name, { line: lineNum, type })
          }
        }

        // Checks an initializer literal against the declared type, e.g.
        // `String a = 1;` — same rules as the reassignment check below.
        const reportIfMismatch = (name: string, rawValue: string, offsetInTrimmed: number): void => {
          const value = rawValue.trim()
          const literal = classifyLiteral(value)
          if (!literal) return
          const kind = declaredKind(type)
          if (!isLiteralMismatch(kind, literal)) return
          const leadingSpace = rawValue.length - rawValue.trimStart().length
          const startColumn = indent + offsetInTrimmed + leadingSpace + 1
          issues.push({
            message: `'${name}' expects ${KIND_LABEL[kind]}, but this is ${KIND_LABEL[literal]}`,
            line: lineNum,
            startColumn,
            endColumn: startColumn + value.length,
          })
        }

        registerName(declMatch[2], trimmed.indexOf(declMatch[2]))

        // `int a = 1, b = "oops";` — after checking `a`'s own initializer,
        // fall through into the same comma-list walk used when the first
        // declarator has no initializer at all (`int a, b = "oops";`).
        let consumed = declMatch[0].length
        let sep: string | undefined = declMatch[3]

        if (sep === '=') {
          const afterOp = trimmed.slice(consumed)
          const endIndex = afterOp.search(/[,;]/)
          if (endIndex === -1) sep = undefined
          else {
            reportIfMismatch(declMatch[2], afterOp.slice(0, endIndex), consumed)
            sep = afterOp[endIndex]
            consumed += endIndex
          }
        } else if (sep === ',') {
          // The comma was already consumed as declMatch's own trailing
          // char (e.g. `int f,`) — back off one so VAR_DECL_CONTINUATION's
          // own leading `,` still has something to match.
          consumed -= 1
        }

        if (sep === ',') {
          let rest = trimmed.slice(consumed)
          let contMatch = VAR_DECL_CONTINUATION.exec(rest)
          while (contMatch) {
            registerName(contMatch[1], consumed + rest.indexOf(contMatch[1]))
            if (contMatch[2] !== undefined) {
              reportIfMismatch(contMatch[1], contMatch[2], consumed + contMatch[0].indexOf('=') + 1)
            }
            consumed += contMatch[0].length
            if (contMatch[3] !== ',') break
            rest = trimmed.slice(consumed)
            contMatch = VAR_DECL_CONTINUATION.exec(rest)
          }
        }
      } else if (!declMatch) {
        // ── obviously-wrong-literal assignment ──
        const assignMatch = ASSIGN_PREFIX.exec(trimmed)
        if (assignMatch) {
          const name = assignMatch[1]
          const rhsStart = assignMatch[0].length
          const rhsRaw = trimmed.slice(rhsStart)
          const semiIndex = rhsRaw.indexOf(';')
          if (semiIndex !== -1) {
            const rhs = rhsRaw.slice(0, semiIndex).trimEnd()
            const type = lookupType(name)
            const literal = classifyLiteral(rhs)
            if (type && literal) {
              const kind = declaredKind(type)
              if (isLiteralMismatch(kind, literal)) {
                const indent = line.length - line.trimStart().length
                const startColumn = indent + rhsStart + 1
                issues.push({
                  message: `'${name}' expects ${KIND_LABEL[kind]}, but this is ${KIND_LABEL[literal]}`,
                  line: lineNum,
                  startColumn,
                  endColumn: startColumn + rhs.length,
                })
              }
            }
          }
        }
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
