import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders its label and fires onClick', () => {
    const handleClick = vi.fn()
    render(createElement(Button, { onClick: handleClick, children: 'Run' }))
    fireEvent.click(screen.getByText('Run'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled and shows a spinner while loading', () => {
    const handleClick = vi.fn()
    const { container } = render(
      createElement(Button, { isLoading: true, onClick: handleClick, children: 'Submit' }),
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(container.querySelector('.animate-spin')).not.toBeNull()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies ghost variant classes', () => {
    render(createElement(Button, { variant: 'ghost', children: 'Cancel' }))
    expect(screen.getByRole('button')).toHaveClass('text-foam')
  })
})
