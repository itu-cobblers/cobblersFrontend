import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner', () => {
  it('defaults to the solid variant', () => {
    const { container } = render(createElement(Spinner))
    expect(container.firstChild).toHaveClass('border-t-[#2a1c10]')
  })

  it('applies the accent variant classes', () => {
    const { container } = render(createElement(Spinner, { variant: 'accent' }))
    expect(container.firstChild).toHaveClass('border-t-caramel')
    expect(container.firstChild).toHaveClass('animate-spin')
  })
})
