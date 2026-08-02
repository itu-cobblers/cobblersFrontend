import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EntryPortal from './EntryPortal.tsx'
import { useEntryPortal } from './EntryPortal.hooks.ts'

vi.mock('./EntryPortal.hooks.ts', () => ({
  useEntryPortal: vi.fn(),
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

describe('EntryPortal', () => {
  beforeEach(() => {
    vi.mocked(useEntryPortal).mockReturnValue(defaultUseEntryPortalMock)
  })

  it('shows the BootCode title and the joining instructions', () => {
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByRole('heading', { name: 'BootCode' })).toBeInTheDocument()
    expect(screen.getByText(/refresh this page when your teacher has made a classroom/)).toBeInTheDocument()
  })

  it('prompts for a nickname in the name field', () => {
    render(createElement(EntryPortal, baseProps))
    expect(screen.getByRole('textbox', { name: 'Your name' })).toHaveAttribute(
      'placeholder',
      'Type your nickname here',
    )
  })

  it('joins the class when Enter is pressed in the name field', () => {
    const onJoinToday = vi.fn()
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      todayLatestSessionCode: 'P4FN',
      onJoinToday,
    })
    render(createElement(EntryPortal, baseProps))
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Your name' }), { key: 'Enter' })
    expect(onJoinToday).toHaveBeenCalledOnce()
  })

  it('does nothing on Enter when there is no session to join, leaving solo practice a deliberate choice', () => {
    const onJoinToday = vi.fn()
    const onStartSolo = vi.fn()
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: 'Maria',
      todayLatestSessionCode: null,
      onJoinToday,
      onStartSolo,
    })
    render(createElement(EntryPortal, baseProps))
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Your name' }), { key: 'Enter' })
    expect(onJoinToday).not.toHaveBeenCalled()
    expect(onStartSolo).not.toHaveBeenCalled()
  })

  it('does not join on Enter before a name has been typed', () => {
    const onJoinToday = vi.fn()
    vi.mocked(useEntryPortal).mockReturnValue({
      ...defaultUseEntryPortalMock,
      name: '   ',
      todayLatestSessionCode: 'P4FN',
      onJoinToday,
    })
    render(createElement(EntryPortal, baseProps))
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Your name' }), { key: 'Enter' })
    expect(onJoinToday).not.toHaveBeenCalled()
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