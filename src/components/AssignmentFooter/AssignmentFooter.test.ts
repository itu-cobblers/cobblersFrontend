import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentFooter from './AssignmentFooter'

describe('AssignmentFooter', () => {
  it('renders Submit alone when no reveal action is offered', () => {
    const onSubmit = vi.fn()
    render(createElement(AssignmentFooter, { submitStatus: 'idle', onSubmit }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.queryByText('Show Answer')).not.toBeInTheDocument()
  })

  it('shows the reveal button, which disappears once the answer is visible', () => {
    const onToggleSolution = vi.fn()
    const { rerender } = render(
      createElement(AssignmentFooter, {
        submitStatus: 'idle',
        onSubmit: vi.fn(),
        canRevealAnswer: true,
        onToggleSolution,
      }),
    )
    fireEvent.click(screen.getByText('Show Answer'))
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
    expect(screen.queryByText('Show Answer')).not.toBeInTheDocument()
  })

  it('offers Back to Editor instead of Submit while viewing the reference answer', () => {
    const onExitView = vi.fn()
    render(
      createElement(AssignmentFooter, {
        submitStatus: 'idle',
        onSubmit: vi.fn(),
        canRevealAnswer: true,
        isSolutionVisible: true,
        onToggleSolution: vi.fn(),
        onExitView,
      }),
    )
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Back to Editor'))
    expect(onExitView).toHaveBeenCalledOnce()
  })

  it('shows the Submit button waiting state while a submission is in flight', () => {
    render(
      createElement(AssignmentFooter, {
        submitStatus: 'waiting',
        onSubmit: vi.fn(),
      }),
    )
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
  })
})
