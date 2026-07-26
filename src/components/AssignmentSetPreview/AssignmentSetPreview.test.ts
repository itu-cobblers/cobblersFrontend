import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentSetPreview from './AssignmentSetPreview'

const groups = [
  {
    label: 'Day 1',
    items: [
      { id: 1, title: 'Hello ITU', kind: 'code' as const, description: 'Print hello.' },
      { id: 2, title: 'Variables', kind: 'code' as const, description: 'Declare a variable.' },
    ],
  },
]

describe('AssignmentSetPreview', () => {
  it('hides the Focus button when onFocusAssignment is omitted (read-only browse)', () => {
    render(createElement(AssignmentSetPreview, { groups }))
    expect(screen.queryByText('Focus')).not.toBeInTheDocument()
  })

  it('fires onFocusAssignment with the clicked assignment id, without toggling the details', () => {
    const onFocusAssignment = vi.fn()
    render(createElement(AssignmentSetPreview, { groups, onFocusAssignment }))
    fireEvent.click(screen.getAllByText('Focus')[0])
    expect(onFocusAssignment).toHaveBeenCalledWith(1)
  })

  it('shows a Live badge instead of Focus for the currently-focused assignment', () => {
    const onFocusAssignment = vi.fn()
    render(createElement(AssignmentSetPreview, { groups, onFocusAssignment, focusedAssignmentId: 2 }))
    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getAllByText('Focus')).toHaveLength(1)
  })
})
