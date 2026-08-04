import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders an icon-only badge with no label', () => {
    const { container } = render(createElement(StatusBadge, { status: 'passed' }))
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.textContent).toBe('')
  })

  it('renders the label text alongside the icon when given one', () => {
    render(createElement(StatusBadge, { status: 'passed', label: 'Passed' }))
    expect(screen.getByText('Passed')).toBeInTheDocument()
  })

  it('renders untried with no icon', () => {
    const { container } = render(createElement(StatusBadge, { status: 'untried' }))
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})
