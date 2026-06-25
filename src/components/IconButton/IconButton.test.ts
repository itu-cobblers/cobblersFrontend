import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import IconButton from './IconButton'

describe('IconButton', () => {
  it('exposes its label and fires onClick', () => {
    const handleClick = vi.fn()
    render(createElement(IconButton, { label: 'Run code', onClick: handleClick, children: 'icon' }))
    fireEvent.click(screen.getByLabelText('Run code'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('shows a spinner instead of children while loading', () => {
    const { container } = render(
      createElement(IconButton, { label: 'Run code', isLoading: true, children: 'icon' }),
    )
    expect(container.querySelector('.animate-spin')).not.toBeNull()
    expect(screen.queryByText('icon')).toBeNull()
  })
})
