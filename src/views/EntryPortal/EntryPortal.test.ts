import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EntryPortal from './EntryPortal.tsx'

const baseProps = {
  name: '',
  isReturningStudent: false,
  todayLatestSessionCode: null as string | null | undefined,
  isJoining: false,
  isStartingSolo: false,
  onNameChange: vi.fn(),
  onJoinToday: vi.fn(),
  onStartSolo: vi.fn(),
  onRefreshTodayLatestSession: vi.fn(),
}

describe('EntryPortal', () => {
  it('shows "Welcome to BootIT" for a first-time student', () => {
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByText('Welcome to BootIT')).toBeInTheDocument()
  })

  it('shows "Welcome to BootIT, {name}" for a returning student', () => {
    render(createElement(EntryPortal, { ...baseProps, name: 'Maria', isReturningStudent: true }))
    expect(screen.getByText('Welcome to BootIT, Maria')).toBeInTheDocument()
  })

  it('disables the join button and shows a checking label while the today-latest lookup is in flight', () => {
    render(createElement(EntryPortal, { ...baseProps, name: 'Maria', todayLatestSessionCode: undefined }))
    const button = screen.getByRole('button', { name: 'Checking for a session…' })
    expect(button).toBeDisabled()
  })

  it('explains why when no session is active today, and offers a refresh button', () => {
    render(createElement(EntryPortal, { ...baseProps, name: 'Maria', todayLatestSessionCode: null }))
    expect(screen.getByText('No current active session to join')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check again for a session' })).toBeEnabled()
  })

  it('fires onRefreshTodayLatestSession when the refresh button is clicked', () => {
    const onRefreshTodayLatestSession = vi.fn()
    render(
      createElement(EntryPortal, { ...baseProps, name: 'Maria', todayLatestSessionCode: null, onRefreshTodayLatestSession }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Check again for a session' }))
    expect(onRefreshTodayLatestSession).toHaveBeenCalledOnce()
  })

  it('enables the join button with the code once a session is found, and fires onJoinToday', () => {
    const onJoinToday = vi.fn()
    render(createElement(EntryPortal, { ...baseProps, name: 'Maria', todayLatestSessionCode: 'ABCD', onJoinToday }))
    const button = screen.getByRole('button', { name: /Join current Session ABCD/ })
    expect(button).toBeEnabled()
    fireEvent.click(button)
    expect(onJoinToday).toHaveBeenCalledOnce()
  })

  it('keeps the join button disabled without a name, even when a session is found', () => {
    render(createElement(EntryPortal, { ...baseProps, name: '', todayLatestSessionCode: 'ABCD' }))
    expect(screen.getByRole('button', { name: /Join current Session ABCD/ })).toBeDisabled()
  })

  it('fires onStartSolo when a name is present', () => {
    const onStartSolo = vi.fn()
    render(createElement(EntryPortal, { ...baseProps, name: 'Maria', onStartSolo }))
    fireEvent.click(screen.getByRole('button', { name: 'Solo Practice' }))
    expect(onStartSolo).toHaveBeenCalledOnce()
  })

  it('disables solo practice until a name is entered', () => {
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByRole('button', { name: 'Solo Practice' })).toBeDisabled()
  })
})
