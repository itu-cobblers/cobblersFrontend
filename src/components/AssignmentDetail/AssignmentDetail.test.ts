import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import AssignmentDetail from './AssignmentDetail'

describe('AssignmentDetail', () => {
  it('renders title and description', () => {
    render(createElement(AssignmentDetail, { title: 'FizzBuzz', description: 'Print 1–100.' }))
    expect(screen.getByRole('heading', { name: 'FizzBuzz' })).toBeInTheDocument()
    expect(screen.getByText('Print 1–100.')).toBeInTheDocument()
  })

  it('omits the hint block when no hint is given', () => {
    render(createElement(AssignmentDetail, { title: 'FizzBuzz', description: 'Print 1–100.' }))
    expect(screen.queryByText(/Hint:/)).toBeNull()
  })

  it('renders the hint when provided', () => {
    render(
      createElement(AssignmentDetail, { title: 'Name shop', description: 'Print a name.', hint: 'println' }),
    )
    expect(screen.getByText('println')).toBeInTheDocument()
  })
})
