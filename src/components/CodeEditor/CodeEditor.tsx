import Editor from '@monaco-editor/react'
import type { CodeEditorProps } from './CodeEditor.types'
import { CODE_EDITOR_CONTAINER_CLASS, EDITOR_OPTIONS, EDITOR_THEME } from './CodeEditor.constants'
import { useCodeEditorSetup } from './CodeEditor.hooks'

/**
 * Monaco editor pane. Controlled: `value` + `onChange` are owned by the caller.
 * Editor setup lives in useCodeEditorSetup.
 */
export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  const { handleBeforeMount, handleMount } = useCodeEditorSetup()

  function handleChange(next: string | undefined) {
    onChange(next ?? '')
  }

  return (
    <div className={CODE_EDITOR_CONTAINER_CLASS}>
      <Editor
        height="100%"
        language="java"
        value={value}
        onChange={handleChange}
        theme={EDITOR_THEME}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        options={EDITOR_OPTIONS}
      />
    </div>
  )
}
