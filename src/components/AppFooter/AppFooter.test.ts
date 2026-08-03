import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import AppFooter from './AppFooter'

describe('AppFooter', () => {
  it('shows the university address', () => {
    render(createElement(AppFooter))
    expect(screen.getByText(/Rued Langgaards Vej 7/)).toBeInTheDocument()
  })

  // Uppercased in CSS, so the accessible text stays in normal case.
  it('names the university in sentence case for assistive tech', () => {
    render(createElement(AppFooter))
    expect(screen.getByText('IT University of Copenhagen')).toBeInTheDocument()
  })
})
