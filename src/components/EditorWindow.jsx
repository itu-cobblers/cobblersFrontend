import Editor from '@monaco-editor/react'
import { registerJavaCompletions } from '../lib/javaCompletions'
import { attachValidator } from '../lib/javaValidator'

/**
 * Monaco editor pane. Controlled component: `code` + `onChange` are owned by
 * App (the single source of truth). The mount handlers are stateless editor
 * setup, so they live here with the editor they configure.
 */
export default function EditorWindow({ code, onChange }) {
  function handleBeforeMount(monaco) {
    registerJavaCompletions(monaco)
  }

  function handleMount(editor, monaco) {
    attachValidator(editor, monaco)
  }

  return (
    <div className="editor-area">
      <Editor
        height="100%"
        language="java"
        value={code}
        onChange={(val) => onChange(val ?? '')}
        theme="vs-dark"
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          tabSize: 4,
          automaticLayout: true,
          wordWrap: 'on',
          padding: { top: 12 },
          // Completions — tuned to feel like VSCode's Java experience
          suggestOnTriggerCharacters: true,
          quickSuggestions: { other: true, comments: false, strings: false },
          wordBasedSuggestions: 'off',   // disable noisy word-frequency suggestions
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          suggestSelection: 'first',     // preselect the best match, like VSCode
          snippetSuggestions: 'inline',  // rank snippets by score, not pinned to top
          suggest: {
            showMethods: true,
            showFields: true,
            showClasses: true,
            showKeywords: true,
            showSnippets: true,
            filterGraceful: true,
            localityBonus: true,
          },
        }}
      />
    </div>
  )
}
