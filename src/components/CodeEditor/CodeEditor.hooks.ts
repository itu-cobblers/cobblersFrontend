import type { BeforeMount, OnMount } from '@monaco-editor/react'
import { registerJavaCompletions } from '@lib/javaCompletions'
import { attachValidator } from '@lib/javaValidator'
import { attachLocalTypeHighlighting } from '@lib/javaLocalTypes'

/**
 * Stateless Monaco setup: register Java completions before mount, attach the
 * heuristic validator and local-type highlighter on mount. Editor
 * configuration, not business logic.
 */
export function useCodeEditorSetup(localClassNames: string[] = []): { handleBeforeMount: BeforeMount; handleMount: OnMount } {
  const handleBeforeMount: BeforeMount = (monaco) => {
    registerJavaCompletions(monaco)
  }

  const handleMount: OnMount = (editor, monaco) => {
    attachValidator(editor, monaco)
    attachLocalTypeHighlighting(editor, monaco, localClassNames)
  }

  return { handleBeforeMount, handleMount }
}
