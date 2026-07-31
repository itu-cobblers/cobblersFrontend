import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EntryPortal from './EntryPortal.tsx'
import { useEntryPortal, useNameCaret } from './EntryPortal.hooks.ts'

vi.mock('./EntryPortal.hooks.ts', () => ({
  useEntryPortal: vi.fn(),
  useNameCaret: vi.fn(),
}))

const baseProps = {
  onJoinSuccess: vi.fn(),
  onSoloSuccess: vi.fn(),
  onError: vi.fn(),
}

const defaultUseEntryPortalMock = {
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

const defaultUseNameCaretMock = {
  inputRef: { current: null },
  mirrorRef: { current: null },
  caretLeft: 0,
  isActive: false,
  handleCaretSync: vi.fn(),
}

describe('EntryPortal', () => {
  beforeEach(() => {
    vi.mocked(useEntryPortal).mockReturnValue(defaultUseEntryPortalMock)
    vi.mocked(useNameCaret).mockReturnValue(defaultUseNameCaretMock)
  })

  it('shows "Welcome to BootIT" for a first-time student', () => {
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByText('Welcome to BootIT')).toBeInTheDocument()
  })

  it('shows "Welcome to BootIT, {name}" for a returning student', () => {
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      isReturningStudent: true,
    })
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByText('Welcome to BootIT, Maria')).toBeInTheDocument()
  })

  it('disables the join button and shows a checking label while the today-latest lookup is in flight', () => {
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      todayLatestSessionCode: undefined,
    })
    render(createElement(EntryPortal, baseProps))
    const button = screen.getByRole('button', { name: 'Checking for a session…' })
    expect(button).toBeDisabled()
  })

  it('explains why when no session is active today, and offers a refresh button', () => {
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      todayLatestSessionCode: null,
    })
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByText('No current active session to join')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check again for a session' })).toBeEnabled()
  })

  it('fires onRefreshTodayLatestSession when the refresh button is clicked', () => {
    const onRefreshTodayLatestSession = vi.fn()
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      todayLatestSessionCode: null,
      onRefreshTodayLatestSession,
    })
    render(createElement(EntryPortal, baseProps))

    fireEvent.click(screen.getByRole('button', { name: 'Check again for a session' }))
    expect(onRefreshTodayLatestSession).toHaveBeenCalledOnce()
  })

  it('enables the join button with the code once a session is found, and fires onJoinToday', () => {
    const onJoinToday = vi.fn()
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      todayLatestSessionCode: 'ABCD',
      onJoinToday,
    })
    render(createElement(EntryPortal, baseProps))

    const button = screen.getByRole('button', { name: /Join current Session ABCD/ })
    expect(button).toBeEnabled()
    fireEvent.click(button)
    expect(onJoinToday).toHaveBeenCalledOnce()
  })

  it('keeps the join button disabled without a name, even when a session is found', () => {
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: '',
      todayLatestSessionCode: 'ABCD',
    })
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByRole('button', { name: /Join current Session ABCD/ })).toBeDisabled()
  })

  it('fires onStartSolo when a name is present', () => {
    const onStartSolo = vi.fn()
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      onStartSolo,
    })
    render(createElement(EntryPortal, baseProps))

    fireEvent.click(screen.getByRole('button', { name: 'Solo Practice' }))
    expect(onStartSolo).toHaveBeenCalledOnce()
  })

  it('disables solo practice until a name is entered', () => {
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByRole('button', { name: 'Solo Practice' })).toBeDisabled()
  })
})