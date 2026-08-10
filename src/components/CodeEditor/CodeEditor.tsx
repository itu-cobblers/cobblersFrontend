import { useEffect, useLayoutEffect, useRef } from 'react'
import classNames from 'classnames'
import Editor from '@monaco-editor/react'
import type { CodeEditorProps } from './CodeEditor.types'
import {
  CODE_EDITOR_CONTAINER_CLASS,
  CODE_EDITOR_SURFACE_CLASS,
  CODE_EDITOR_DIMMED_CLASS,
  EDITOR_OPTIONS,
  EDITOR_READ_ONLY_OPTIONS,
  EDITOR_THEME,
} from './CodeEditor.constants'
import { useCodeEditorSetup } from './CodeEditor.hooks'
import { useTheme } from '@hooks/useTheme'

/**
 * Monaco editor pane. Controlled: `value` + `onChange` are owned by the caller.
 * Editor setup lives in useCodeEditorSetup.
 *
 * Deliberately omits Monaco `path` (multi-model). Callers remount via React
 * `key` when switching files so models cannot leak across tabs/modes.
 *
 * Programmatic value sync is muted via a layout-phase flag: @monaco-editor/react
 * applies `value` in useEffect, which runs after useLayoutEffect, so the skip
 * arm is already true before ghost onChange can fire.
 */
export default function CodeEditor({ value, onChange, isReadOnly = false, localClassNames = [] }: CodeEditorProps) {
  const { handleBeforeMount, handleMount } = useCodeEditorSetup(localClassNames)
  const { theme } = useTheme()
  const options = isReadOnly ? { ...EDITOR_OPTIONS, ...EDITOR_READ_ONLY_OPTIONS } : EDITOR_OPTIONS
  const skipOnChangeRef = useRef(false)

  // Arm before Monaco's useEffect value-sync (child effects run after parent layout).
  useLayoutEffect(() => {
    skipOnChangeRef.current = true
  }, [value])

  // Disarm after paint so real keystrokes are accepted again.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      skipOnChangeRef.current = false
    })
    return () => cancelAnimationFrame(raf)
  }, [value])

  function handleChange(next: string | undefined) {
    if (skipOnChangeRef.current) return
    onChange(next ?? '')
  }

  return (
    <div className={CODE_EDITOR_CONTAINER_CLASS}>
      <div className={classNames(CODE_EDITOR_SURFACE_CLASS, { [CODE_EDITOR_DIMMED_CLASS]: isReadOnly })}>
        <Editor
          height="100%"
          language="java"
          value={value}
          onChange={handleChange}
          theme={EDITOR_THEME[theme]}
          beforeMount={handleBeforeMount}
          onMount={handleMount}
          options={options}
        />
      </div>
    </div>
  )
}
