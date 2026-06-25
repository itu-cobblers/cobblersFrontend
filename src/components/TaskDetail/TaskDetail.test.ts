import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import TaskDetail from './TaskDetail'

describe('TaskDetail', () => {
  it('renders title and description', () => {
    render(createElement(TaskDetail, { title: 'FizzBuzz', description: 'Print 1–100.' }))
    expect(screen.getByRole('heading', { name: 'FizzBuzz' })).toBeInTheDocument()
    expect(screen.getByText('Print 1–100.')).toBeInTheDocument()
  })

  it('omits the hint block when no hint is given', () => {
    render(createElement(TaskDetail, { title: 'FizzBuzz', description: 'Print 1–100.' }))
    expect(screen.queryByText(/Hint:/)).toBeNull()
  })

  it('renders the hint when provided', () => {
    render(
      createElement(TaskDetail, { title: 'Name shop', description: 'Print a name.', hint: 'println' }),
    )
    expect(screen.getByText('println')).toBeInTheDocument()
  })
})
