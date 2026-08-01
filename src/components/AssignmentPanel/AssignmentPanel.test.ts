import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentPanel from './AssignmentPanel'
import type { AssignmentPanelProps } from './AssignmentPanel.types'

const baseProps: AssignmentPanelProps = {
  activeTab: 'description',
  onTabChange: vi.fn(),
  submissions: [],
  title: 'Hello ITU',
  lesson: [
    { kind: 'text', text: 'Printing a message is the most basic thing.' },
    { kind: 'code', code: 'System.out.println("Hello World!");' },
  ],
  description: 'Print exactly: Hello ITU!',
  hint: 'System.out.println("Hello ITU!");',
}

describe('AssignmentPanel', () => {
  it('renders title, lesson blocks and task, with the hint folded by default', () => {
    render(createElement(AssignmentPanel, baseProps))
    expect(screen.getByRole('heading', { name: 'Hello ITU' })).toBeInTheDocument()
    expect(screen.getByText('Printing a message is the most basic thing.')).toBeInTheDocument()
    expect(screen.getByText('System.out.println("Hello World!");')).toBeInTheDocument()
    expect(screen.getByText('Your task')).toBeInTheDocument()
    expect(screen.getByText('Print exactly: Hello ITU!')).toBeInTheDocument()
    expect(screen.queryByText('System.out.println("Hello ITU!");')).not.toBeInTheDocument()
  })

  it('expands the hint on click, and re-folds when the hint changes', () => {
    const { rerender } = render(createElement(AssignmentPanel, baseProps))
    fireEvent.click(screen.getByText('💡 Hint'))
    expect(screen.getByText('System.out.println("Hello ITU!");')).toBeInTheDocument()
    rerender(createElement(AssignmentPanel, { ...baseProps, hint: 'System.out.println("Bye!");' }))
    expect(screen.queryByText('System.out.println("Bye!");')).not.toBeInTheDocument()
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

  it('fires onTabChange when Submissions is clicked', () => {
    const onTabChange = vi.fn()
    render(createElement(AssignmentPanel, { ...baseProps, onTabChange }))
    fireEvent.click(screen.getByText('Description'))
    expect(onTabChange).toHaveBeenCalledWith('description')
  })

  it('shows an empty state on the Submissions tab with no attempts', () => {
    render(createElement(AssignmentPanel, { ...baseProps, activeTab: 'submissions' }))
    expect(screen.getByText('No submissions yet.')).toBeInTheDocument()
  })

  it('lists submissions with their outcome on the Submissions tab', () => {
    render(
      createElement(AssignmentPanel, {
        ...baseProps,
        activeTab: 'submissions',
        submissions: [{ subId: 's1', assignmentId: 0, sessionId: null, passed: true, submittedAt: '2026-07-24T14:30:00Z' }],
      }),
    )
    expect(screen.getByText('Accepted')).toBeInTheDocument()
  })
})
