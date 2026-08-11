import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import './index.css'
import { applyTheme, readThemePreference, resolveTheme } from '@lib/theme'
import { EDITOR_DARK_THEME, EDITOR_DARK_THEME_DATA } from '@components/CodeEditor/CodeEditor.constants'
import { ScreenSizeGate } from '@views/ScreenSizeGate'

loader.config({ monaco })

// Global and one-time, like loader.config. Must be registered before any editor
// is handed the name, or Monaco falls back to `vs` — the light theme.
monaco.editor.defineTheme(EDITOR_DARK_THEME, EDITOR_DARK_THEME_DATA)

// Before React mounts, or the first paint is light and then snaps dark.
applyTheme(resolveTheme(readThemePreference()))

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ScreenSizeGate />
    </StrictMode>,
  )
}
