import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import FeedbackBanner from './FeedbackBanner'

describe('FeedbackBanner', () => {
  it('renders the hint label and message', () => {
    render(createElement(FeedbackBanner, { tone: 'hint', message: 'Store it in a variable first.' }))
    expect(screen.getByText('Feedback from the check')).toBeInTheDocument()
    expect(screen.getByText('Store it in a variable first.')).toBeInTheDocument()
  })

  it('renders the success label with a default message', () => {
    render(createElement(FeedbackBanner, { tone: 'success' }))
    expect(screen.getByText('Check passed')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('your solution does exactly what the task asked')
  })
})
