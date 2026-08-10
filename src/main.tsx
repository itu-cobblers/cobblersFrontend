import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import './index.css'
import { ScreenSizeGate } from '@views/ScreenSizeGate'

loader.config({ monaco })

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ScreenSizeGate />
    </StrictMode>,
  )
}
