import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import AppHeader from './AppHeader'

describe('AppHeader', () => {
  it('renders the ITU BootIT lockup as two boxes', () => {
    render(createElement(AppHeader))
    expect(screen.getByText('ITU')).toBeInTheDocument()
    expect(screen.getByText('BootIT')).toBeInTheDocument()
  })

  it('hides the decorative photo from assistive tech', () => {
    const { container } = render(createElement(AppHeader))
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes an empty nav landmark for the buttons still to come', () => {
    render(createElement(AppHeader))
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeEmptyDOMElement()
  })
})
