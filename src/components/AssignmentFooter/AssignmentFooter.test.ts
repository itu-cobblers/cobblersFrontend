import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentFooter from './AssignmentFooter'

describe('AssignmentFooter', () => {
  it('renders Submit alone when no reveal/mark actions are offered', () => {
    const onSubmit = vi.fn()
    render(createElement(AssignmentFooter, { submitStatus: 'idle', onSubmit }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.queryByText('Show reference answer')).not.toBeInTheDocument()
    expect(screen.queryByText('Marked as done')).not.toBeInTheDocument()
  })

  it('shows the reveal toggle after a submit, and toggles its label', () => {
    const onToggleSolution = vi.fn()
    const { rerender } = render(
      createElement(AssignmentFooter, {
        submitStatus: 'idle',
        onSubmit: vi.fn(),
        canRevealAnswer: true,
        onToggleSolution,
      }),
    )
    fireEvent.click(screen.getByText('Show reference answer'))
    expect(onToggleSolution).toHaveBeenCalledOnce()

    rerender(
      createElement(AssignmentFooter, {
        submitStatus: 'idle',
        onSubmit: vi.fn(),
        canRevealAnswer: true,
        isSolutionVisible: true,
        onToggleSolution,
      }),
    )
    expect(screen.getByText('Hide reference answer')).toBeInTheDocument()
  })

  it('binds mark-as-done to the Submit button while the reference answer is open', () => {
    const onMarkAsDone = vi.fn()
    render(
      createElement(AssignmentFooter, {
        submitStatus: 'idle',
        onSubmit: vi.fn(),
        canRevealAnswer: true,
        isSolutionVisible: true,
        onToggleSolution: vi.fn(),
        canMarkAsDone: true,
        onMarkAsDone,
      }),
    )
    expect(screen.queryByText('Marked as done')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onMarkAsDone).toHaveBeenCalledOnce()
  })

  it('shows the Submit button waiting state while mark-as-done is saving', () => {
    render(
      createElement(AssignmentFooter, {
        submitStatus: 'idle',
        onSubmit: vi.fn(),
        canMarkAsDone: true,
        isMarkingDone: true,
        onMarkAsDone: vi.fn(),
      }),
    )
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
  })
})
