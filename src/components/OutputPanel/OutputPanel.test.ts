import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import OutputPanel from './OutputPanel'
import { isErrorStatus, getStatusLabel } from './OutputPanel.utils'

describe('OutputPanel.utils', () => {
  it('flags error statuses', () => {
    expect(isErrorStatus('compile_error')).toBe(true)
    expect(isErrorStatus('success')).toBe(false)
    expect(isErrorStatus(null)).toBe(false)
  })

  it('labels statuses', () => {
    expect(getStatusLabel('runtime_error')).toBe('Runtime error')
    expect(getStatusLabel(null)).toBe('')
  })
})

describe('OutputPanel', () => {
  it('shows the placeholder when there is no output', () => {
    render(createElement(OutputPanel, { output: '', status: null }))
    expect(screen.getByText('Press Run to see your output…')).toBeInTheDocument()
  })

  it('colors the content on error', () => {
    render(createElement(OutputPanel, { output: 'boom', status: 'runtime_error' }))
    expect(screen.getByText('boom')).toHaveClass('text-term-err')
    expect(screen.getByText('Runtime error')).toBeInTheDocument()
  })

  it('hides the footer when omitted', () => {
    render(createElement(OutputPanel, { output: '', status: null }))
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
  })

  it('fires footer.onSubmit when Submit is clicked', () => {
    const onSubmit = vi.fn()
    render(
      createElement(OutputPanel, {
        output: '',
        status: null,
        footer: { submitStatus: 'idle', onSubmit },
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('shows the well-done state once the last submission passed', () => {
    render(
      createElement(OutputPanel, {
        output: '',
        status: null,
        footer: { submitStatus: 'success', onSubmit: vi.fn() },
      }),
    )
    expect(screen.getByRole('button', { name: 'Well Done' })).toBeInTheDocument()
  })

  it('shows the shared reveal toggle when canRevealAnswer is set', () => {
    const onToggleSolution = vi.fn()
    render(
      createElement(OutputPanel, {
        output: '',
        status: null,
        footer: {
          submitStatus: 'idle',
          onSubmit: vi.fn(),
          canRevealAnswer: true,
          onToggleSolution,
        },
      }),
    )
    fireEvent.click(screen.getByText('Show reference answer'))
    expect(onToggleSolution).toHaveBeenCalledOnce()
  })
})
