import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render } from '@testing-library/react'
import Icon from './Icon'

describe('Icon', () => {
  it('renders the menu icon as three lines', () => {
    const { container } = render(createElement(Icon, { name: 'menu' }))
    expect(container.querySelectorAll('line')).toHaveLength(3)
  })

  it('renders the play icon as a polygon', () => {
    const { container } = render(createElement(Icon, { name: 'play' }))
    expect(container.querySelector('polygon')).not.toBeNull()
  })
})
