import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renders its label', () => {
    render(createElement(Badge, { tone: 'lang', children: 'Java' }))
    expect(screen.getByText('Java')).toBeInTheDocument()
  })

  it('applies tone-specific classes', () => {
    render(createElement(Badge, { tone: 'lang', children: 'Java' }))
    expect(screen.getByText('Java')).toHaveClass('text-caramel')
  })
})
