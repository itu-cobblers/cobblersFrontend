import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Toolbar from './Toolbar'

const baseProps = {
  subtitle: '· Hygge Café ·',
  isRunning: false,
  isSubmitting: false,
  onToggleSidebar: vi.fn(),
  onRun: vi.fn(),
  onSubmit: vi.fn(),
}

describe('Toolbar', () => {
  it('renders brand, subtitle and language badge', () => {
    render(createElement(Toolbar, baseProps))
    expect(screen.getByText('bootIT')).toBeInTheDocument()
    expect(screen.getByText('· Hygge Café ·')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
  })

  it('fires run and submit handlers', () => {
    const onRun = vi.fn()
    const onSubmit = vi.fn()
    render(createElement(Toolbar, { ...baseProps, onRun, onSubmit }))
    fireEvent.click(screen.getByLabelText('Run code'))
    fireEvent.click(screen.getByText('Submit'))
    expect(onRun).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('disables actions while submitting', () => {
    render(createElement(Toolbar, { ...baseProps, isSubmitting: true }))
    expect(screen.getByText('Submitting…').closest('button')).toBeDisabled()
  })
})
