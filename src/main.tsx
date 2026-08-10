import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import './index.css'
import { applyTheme, readThemePreference, resolveTheme } from '@lib/theme'
import { StudentView } from '@views/StudentView'
import { TeacherGate } from '@views/TeacherGate'

loader.config({ monaco })

// Before React mounts, or the first paint is light and then snaps dark.
applyTheme(resolveTheme(readThemePreference()))

const isTeacherPath = window.location.pathname.startsWith('/teacher')
const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {isTeacherPath ? <TeacherGate /> : <StudentView />}
    </StrictMode>,
  )
}
