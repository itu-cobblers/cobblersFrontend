import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProjectPanel from './ProjectPanel'
import type { ProjectPanelProps } from './ProjectPanel.types'

const baseProps: ProjectPanelProps = {
  files: [],
  output: '',
  status: null,
  isRunning: false,
  onFilesChange: vi.fn(),
  onRun: vi.fn(),
}

describe('ProjectPanel', () => {
  it('hides Show answer when omitted — project is always available, but only once the caller passes it', () => {
    render(createElement(ProjectPanel, baseProps))
    expect(screen.queryByRole('button', { name: 'Show answer' })).not.toBeInTheDocument()
  })

  it('shows and fires Show answer (via the embedded OutputPanel) when given', () => {
    const onClick = vi.fn()
    render(createElement(ProjectPanel, { ...baseProps, showAnswer: { onClick } }))
    fireEvent.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
