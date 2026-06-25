import type { BeforeMount, OnMount } from '@monaco-editor/react'
import { registerJavaCompletions } from '@lib/javaCompletions'
import { attachValidator } from '@lib/javaValidator'

/**
 * Stateless Monaco setup: register Java completions before mount, attach the
 * heuristic validator on mount. Editor configuration, not business logic.
 */
export function useCodeEditorSetup(): { handleBeforeMount: BeforeMount; handleMount: OnMount } {
  const handleBeforeMount: BeforeMount = (monaco) => {
    registerJavaCompletions(monaco)
  }

  const handleMount: OnMount = (editor, monaco) => {
    attachValidator(editor, monaco)
  }

  return { handleBeforeMount, handleMount }
}
