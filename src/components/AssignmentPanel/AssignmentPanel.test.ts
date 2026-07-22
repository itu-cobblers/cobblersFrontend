import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import AssignmentPanel from './AssignmentPanel'
import type { AssignmentPanelProps } from './AssignmentPanel.types'

const baseProps: AssignmentPanelProps = {
  steps: [{ id: 0, title: 'Hello ITU', isDone: false, isActive: true }],
  onSelectStep: vi.fn(),
  title: 'Hello ITU',
  lesson: [
    { kind: 'text', text: 'Printing a message is the most basic thing.' },
    { kind: 'code', code: 'System.out.println("Hello World!");' },
  ],
  description: 'Print exactly: Hello ITU!',
  hint: 'System.out.println("Hello ITU!");',
}

describe('AssignmentPanel', () => {
  it('renders title, lesson blocks, task and hint', () => {
    render(createElement(AssignmentPanel, baseProps))
    expect(screen.getByRole('heading', { name: 'Hello ITU' })).toBeInTheDocument()
    expect(screen.getByText('Printing a message is the most basic thing.')).toBeInTheDocument()
    expect(screen.getByText('System.out.println("Hello World!");')).toBeInTheDocument()
    expect(screen.getByText('Your task')).toBeInTheDocument()
    expect(screen.getByText('Print exactly: Hello ITU!')).toBeInTheDocument()
    expect(screen.getByText('System.out.println("Hello ITU!");')).toBeInTheDocument()
  })

  it('shows the feedback banner only when feedback is present', () => {
    const { rerender } = render(createElement(AssignmentPanel, baseProps))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    rerender(
      createElement(AssignmentPanel, { ...baseProps, feedback: { tone: 'hint', message: 'Check the capitals.' } }),
    )
    expect(screen.getByRole('status')).toHaveTextContent('Check the capitals.')
  })

  it('renders a project brief as body text', () => {
    render(createElement(AssignmentPanel, { ...baseProps, lesson: undefined, body: 'Build a Tree®' }))
    expect(screen.getByText('Build a Tree®')).toBeInTheDocument()
  })
})
