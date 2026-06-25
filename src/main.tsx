import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import './index.css'
import { StudentView } from '@views/StudentView'
import { TeacherGate } from '@views/TeacherGate'

loader.config({ monaco })

const isTeacherPath = window.location.pathname.startsWith('/teacher')
const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>{isTeacherPath ? <TeacherGate /> : <StudentView />}</StrictMode>,
  )
}
