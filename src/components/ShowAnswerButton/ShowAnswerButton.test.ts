import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ShowAnswerButton from './ShowAnswerButton'

describe('ShowAnswerButton', () => {
  it('fires onClick when pressed', () => {
    const onClick = vi.fn()
    render(createElement(ShowAnswerButton, { onClick }))
    fireEvent.click(screen.getByText('Show answer'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('can be disabled', () => {
    render(createElement(ShowAnswerButton, { onClick: vi.fn(), isDisabled: true }))
    expect(screen.getByText('Show answer').closest('button')).toBeDisabled()
  })
})
