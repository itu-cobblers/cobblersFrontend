import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import OutputPanel from './OutputPanel'
import { isErrorStatus, getStatusLabel, getSubmitButtonStatus } from './OutputPanel.utils'

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

  it('derives the submit button status', () => {
    expect(getSubmitButtonStatus({ isSubmitting: true, onSubmit: vi.fn() })).toBe('waiting')
    expect(getSubmitButtonStatus({ isSubmitting: false, onSubmit: vi.fn(), lastResultPassed: true })).toBe('success')
    expect(getSubmitButtonStatus({ isSubmitting: false, onSubmit: vi.fn(), lastResultPassed: false })).toBe('error')
    expect(getSubmitButtonStatus({ isSubmitting: false, onSubmit: vi.fn() })).toBe('idle')
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

  it('hides the Submit button when submit is omitted', () => {
    render(createElement(OutputPanel, { output: '', status: null }))
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
  })

  it('fires submit.onSubmit when Submit is clicked', () => {
    const onSubmit = vi.fn()
    render(createElement(OutputPanel, { output: '', status: null, submit: { isSubmitting: false, onSubmit } }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('shows the well-done state once the last submission passed', () => {
    render(
      createElement(OutputPanel, {
        output: '',
        status: null,
        submit: { isSubmitting: false, onSubmit: vi.fn(), lastResultPassed: true },
      }),
    )
    expect(screen.getByRole('button', { name: 'Well Done' })).toBeInTheDocument()
  })

  it('hides Show answer when omitted, shows and fires it when given', () => {
    const onClick = vi.fn()
    render(createElement(OutputPanel, { output: '', status: null, showAnswer: { onClick } }))
    fireEvent.click(screen.getByText('Show answer'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
