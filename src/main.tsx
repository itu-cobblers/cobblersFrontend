import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import './index.css'
import { applyTheme, readThemePreference, resolveTheme } from '@lib/theme'
import { ScreenSizeGate } from '@views/ScreenSizeGate'

loader.config({ monaco })

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
