import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import AppColophon from './AppColophon'

describe('AppColophon', () => {
  it('links to the project org', () => {
    render(createElement(AppColophon))
    expect(screen.getByRole('link', { name: 'github.com/itu-cobblers' })).toHaveAttribute(
      'href',
      'https://github.com/itu-cobblers',
    )
  })

  // Opening in a new tab without noreferrer lets the target reach window.opener.
  it('opens the org safely in a new tab', () => {
    render(createElement(AppColophon))
    const link = screen.getByRole('link', { name: 'github.com/itu-cobblers' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
