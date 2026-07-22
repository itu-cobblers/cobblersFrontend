import type { editor } from 'monaco-editor'

export const CODE_EDITOR_CONTAINER_CLASS = 'min-h-0 flex-1 overflow-hidden bg-terminal'

export const EDITOR_THEME = 'vs-dark'

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
