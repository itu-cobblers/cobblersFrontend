import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SubmitButton from './SubmitButton'

describe('SubmitButton', () => {
  it('shows the idle accessible name and fires onClick', () => {
    const onClick = vi.fn()
    render(createElement(SubmitButton, { status: 'idle', onClick }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled while waiting', () => {
    render(createElement(SubmitButton, { status: 'waiting', onClick: vi.fn() }))
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
  })

  it('supports a custom label override', () => {
    render(createElement(SubmitButton, { status: 'idle', onClick: vi.fn(), label: 'Send answer' }))
    expect(screen.getByRole('button', { name: 'Send answer' })).toBeInTheDocument()
  })
})
