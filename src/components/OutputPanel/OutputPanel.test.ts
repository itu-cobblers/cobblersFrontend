import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText('boom')).toHaveClass('text-berry')
    expect(screen.getByText('Runtime error')).toBeInTheDocument()
  })
})
