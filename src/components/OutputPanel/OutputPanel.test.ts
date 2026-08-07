import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import OutputPanel from './OutputPanel'
import { isErrorStatus, getStatusLabel, hasFeedback } from './OutputPanel.utils'

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

  it('treats null, undefined, and empty arrays as no feedback', () => {
    expect(hasFeedback(null)).toBe(false)
    expect(hasFeedback(undefined)).toBe(false)
    expect(hasFeedback([])).toBe(false)
  })

  it('recognizes a non-empty feedback array', () => {
    expect(hasFeedback(['check your || condition'])).toBe(true)
  })
})

describe('OutputPanel', () => {
  const base = { output: 'Not allowed', status: null, placeHolder: 'Press Run…' }

  it('lists each feedback message under a "What to fix" heading', () => {
    render(createElement(OutputPanel, {
      ...base,
      feedback: ['check your || condition', 'print the exact sentence'],
    }))
    expect(screen.getByText('What to fix')).toBeInTheDocument()
    expect(screen.getByText('check your || condition')).toBeInTheDocument()
    expect(screen.getByText('print the exact sentence')).toBeInTheDocument()
  })

  it('omits the section when feedback is absent, null, or empty', () => {
    render(createElement(OutputPanel, { ...base }))
    expect(screen.queryByText('What to fix')).not.toBeInTheDocument()

    render(createElement(OutputPanel, { ...base, feedback: null }))
    expect(screen.queryAllByText('What to fix')).toHaveLength(0)

    render(createElement(OutputPanel, { ...base, feedback: [] }))
    expect(screen.queryAllByText('What to fix')).toHaveLength(0)
  })
})
