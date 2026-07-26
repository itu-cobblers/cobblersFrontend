import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import WelcomeBackBanner from './WelcomeBackBanner'

describe('WelcomeBackBanner', () => {
  it('shows the suggested session and fires onJoin', () => {
    const onJoin = vi.fn()
    render(
      createElement(WelcomeBackBanner, {
        displayName: 'Maria',
        code: 'WXYZ',
        assignmentSetDisplayTitle: 'BootIT Day 2 — 2026',
        isJoining: false,
        onJoin,
        onDismiss: vi.fn(),
      }),
    )
    expect(screen.getByText('Welcome back, Maria!')).toBeInTheDocument()
    expect(screen.getByText('BootIT Day 2 — 2026', { exact: false })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Join today’s session' }))
    expect(onJoin).toHaveBeenCalledOnce()
  })

  it('fires onDismiss from the "Not now" action and the close button', () => {
    const onDismiss = vi.fn()
    render(
      createElement(WelcomeBackBanner, {
        displayName: '',
        code: 'WXYZ',
        assignmentSetDisplayTitle: 'BootIT Day 2 — 2026',
        isJoining: false,
        onJoin: vi.fn(),
        onDismiss,
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(2)
  })
})
