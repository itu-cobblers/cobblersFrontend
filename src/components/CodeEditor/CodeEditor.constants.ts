import type { editor } from 'monaco-editor'

export const CODE_EDITOR_CONTAINER_CLASS = 'min-h-0 flex-1 overflow-hidden bg-terminal'

/** The editor sits on this, so dimming fades the code and not the surface behind it. */
export const CODE_EDITOR_SURFACE_CLASS = 'h-full w-full transition-opacity duration-200'

/**
 * Read-only view (reference solution, past submission): the code washes toward
 * the background so the pane reads as inert on sight, instead of needing a
 * badge to say so.
 */
export const CODE_EDITOR_DIMMED_CLASS = 'opacity-45'

export const EDITOR_THEME = 'vs'

/** Monaco options tuned to feel like VSCode's Java experience. tabSize 4 is the Java the students write. */
export const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  lineNumbers: 'on',
  tabSize: 4,
  automaticLayout: true,
  wordWrap: 'on',
  padding: { top: 12 },
  domReadOnly: false,
  contextmenu: true,
  matchBrackets: 'always',
  selectionHighlight: true,
  renderLineHighlight: 'line',
  suggestOnTriggerCharacters: true,
  quickSuggestions: { other: true, comments: false, strings: false },
  wordBasedSuggestions: 'off',
  acceptSuggestionOnEnter: 'on',
  tabCompletion: 'on',
  suggestSelection: 'first',
  snippetSuggestions: 'inline',
  suggest: {
    showMethods: true,
    showFields: true,
    showClasses: true,
    showKeywords: true,
    showSnippets: true,
    filterGraceful: true,
    localityBonus: true,
  },
}

/**
 * Layered over EDITOR_OPTIONS when the pane is showing something the student
 * can't edit. `readOnly` alone still leaves a caret, a context menu and live
 * suggestions, which all read as "you can type here" — these switch the rest off.
 *
 * Scrolling and selection are deliberately left working: reference solutions
 * and past submissions can run past the viewport, and they'd be unreadable
 * otherwise.
 */
export const EDITOR_READ_ONLY_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  domReadOnly: true,
  contextmenu: false,
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  matchBrackets: 'never',
  selectionHighlight: false,
  renderLineHighlight: 'none',
}
