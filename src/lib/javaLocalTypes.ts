/**
 * Highlights references to a student's own classes in multi-file `code`
 * assignments (e.g. `Main.java` using `FlightTicket`). The built-in Monaco
 * Java tokenizer treats every identifier the same — it has no idea
 * `FlightTicket` is a type — so this fills the gap with a decoration instead
 * of a real tokenizer/semantic-highlighting integration.
 *
 * Local class names come from the assignment's `starterFiles` filenames
 * (`FlightTicket.java` → `FlightTicket`), not from parsing `class` — the
 * write gate in `useWorkspaceMode` already guarantees a file's declared class
 * always matches its filename, so the filename is the cheaper, always-correct
 * source of truth.
 *
 * `findLocalTypeRanges` is pure and unit-tested; `attachLocalTypeHighlighting`
 * wires it to a live editor, recomputing on every content change.
 */
import type { editor as MonacoEditor } from 'monaco-editor'
import { sanitizeJava } from './javaSource'

type Monaco = typeof import('monaco-editor')

export interface LocalTypeRange {
  /** 1-based */
  line: number
  /** 1-based */
  startColumn: number
  endColumn: number
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function findLocalTypeRanges(code: string, localClassNames: string[]): LocalTypeRange[] {
  const names = localClassNames.filter(Boolean)
  if (names.length === 0) return []

  const pattern = new RegExp(`\\b(?:${names.map(escapeRegExp).join('|')})\\b`, 'g')
  const { lines } = sanitizeJava(code)
  const ranges: LocalTypeRange[] = []

  lines.forEach((line, index) => {
    for (const match of line.matchAll(pattern)) {
      if (match.index === undefined) continue
      ranges.push({
        line: index + 1,
        startColumn: match.index + 1,
        endColumn: match.index + 1 + match[0].length,
      })
    }
  })

  return ranges
}

const DECORATION_CLASS = 'java-local-type'

/** Wire the highlighter to a Monaco editor instance (call from onMount). */
export function attachLocalTypeHighlighting(
  editor: MonacoEditor.IStandaloneCodeEditor,
  monaco: Monaco,
  localClassNames: string[],
): void {
  if (localClassNames.length === 0) return

  const decorations = editor.createDecorationsCollection()

  function recompute(): void {
    const model = editor.getModel()
    if (!model || model.isDisposed()) return
    const ranges = findLocalTypeRanges(model.getValue(), localClassNames)
    decorations.set(ranges.map((range) => ({
      range: new monaco.Range(range.line, range.startColumn, range.line, range.endColumn),
      options: { inlineClassName: DECORATION_CLASS },
    })))
  }

  recompute()
  const subscription = editor.onDidChangeModelContent(recompute)
  editor.onDidDispose(() => subscription.dispose())
}
