import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'

vi.mock('@/api/assignmentSetApi.ts', () => ({
  fetchAssignmentSets: vi.fn().mockResolvedValue([{ assignmentSetId: 'set-1', displayTitle: 'Day 1' }]),
  fetchAssignmentSet: vi.fn().mockResolvedValue({ assignmentSetId: 'set-1', displayTitle: 'Day 1', assignments: [] }),
}))

vi.mock('@/api/sessionApi.ts', () => ({
  createSession: vi.fn().mockResolvedValue({ code: 'ABCD1234' }),
  getSession: vi.fn().mockResolvedValue({ code: 'WXYZ5678', assignmentSetId: 'set-1' }),
  startTimer: vi.fn().mockResolvedValue({ endsAt: '2026-07-21T12:00:00.000Z' }),
  endSession: vi.fn().mockResolvedValue(undefined),
  fetchSessionAttendance: vi.fn().mockResolvedValue([]),
  fetchSessionSubmissions: vi.fn().mockResolvedValue([]),
}))

interface ObserveSessionCallbacks {
  onRoster?: (roster: { studentId: string; displayName: string }[]) => void
  onHandsUpdated?: (studentIds: string[]) => void
}
let capturedObserveCallbacks: ObserveSessionCallbacks | null = null

vi.mock('@/api/sessionHub.ts', () => ({
  observeSession: vi.fn((_code: string, callbacks: ObserveSessionCallbacks) => {
    capturedObserveCallbacks = callbacks
    return Promise.resolve(undefined)
  }),
  focusAssignment: vi.fn().mockResolvedValue(undefined),
  lowerHand: vi.fn().mockResolvedValue(undefined),
}))

const { default: TeacherDashboard } = await import('./TeacherDashboard')
const { lowerHand } = await import('@/api/sessionHub.ts')

describe('TeacherDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    capturedObserveCallbacks = null
    vi.mocked(lowerHand).mockClear()
  })

  it('shows the Browse screen when there is no persisted session', async () => {
    render(createElement(TeacherDashboard))
    expect(await screen.findByRole('heading', { name: 'Classroom' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'End session' })).not.toBeInTheDocument()
  })

  it('creating a session persists it and shows an End session button', async () => {
    render(createElement(TeacherDashboard))
    await screen.findByRole('option', { name: 'Day 1' })

    fireEvent.click(screen.getByRole('button', { name: 'Create session' }))

    expect(await screen.findByRole('button', { name: 'End session' })).toBeInTheDocument()
    expect(localStorage.getItem('bootit.teacherSession')).toEqual(JSON.stringify({ code: 'ABCD1234', timerEndsAt: null }))
  })

  it('resumes a persisted session on mount', async () => {
    localStorage.setItem('bootit.teacherSession', JSON.stringify({ code: 'WXYZ5678', timerEndsAt: null }))

    render(createElement(TeacherDashboard))

    expect(await screen.findByRole('button', { name: 'End session' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Classroom' })).not.toBeInTheDocument()
  })

  it('ending a session clears storage and returns to Browse', async () => {
    render(createElement(TeacherDashboard))
    await screen.findByRole('option', { name: 'Day 1' })
    fireEvent.click(screen.getByRole('button', { name: 'Create session' }))
    await screen.findByRole('button', { name: 'End session' })

    fireEvent.click(screen.getByRole('button', { name: 'End session' }))

    expect(await screen.findByRole('heading', { name: 'Classroom' })).toBeInTheDocument()
    expect(localStorage.getItem('bootit.teacherSession')).toBeNull()
  })

  // Raise Hand, teacher side: a student with a raised hand bubbles to the top
  // of the roster, oldest-raised first, with a hand icon the teacher can click.
  it('bubbles a raised hand to the top of the roster, ordered oldest-first, and lowers it on click', async () => {
    render(createElement(TeacherDashboard))
    await screen.findByRole('option', { name: 'Day 1' })
    fireEvent.click(screen.getByRole('button', { name: 'Create session' }))
    await screen.findByRole('button', { name: 'End session' })

    capturedObserveCallbacks?.onRoster?.([
      { studentId: 'student-maria', displayName: 'Maria' },
      { studentId: 'student-jonas', displayName: 'Jonas' },
    ])
    await screen.findByText('Maria')

    const roster = screen.getByText('Students').closest('aside')
    if (!roster) throw new Error('roster aside not found')

    // Nobody's hand is up yet.
    expect(roster.querySelectorAll('li')[0]).toHaveTextContent('Maria')
    expect(screen.queryByRole('button', { name: 'Lower hand' })).not.toBeInTheDocument()

    // Jonas raises his hand — he bubbles above Maria despite joining after her.
    capturedObserveCallbacks?.onHandsUpdated?.(['student-jonas'])
    await screen.findByRole('button', { name: 'Lower hand' })

    const rows = roster.querySelectorAll('li')
    expect(rows[0]).toHaveTextContent('Jonas')
    expect(rows[1]).toHaveTextContent('Maria')
    expect(within(rows[0] as HTMLElement).getByRole('button', { name: 'Lower hand' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Lower hand' }))

    expect(lowerHand).toHaveBeenCalledWith('ABCD1234', 'student-jonas')
  })

  it('reorders once the second-raised hand also goes up, keeping raise order', async () => {
    render(createElement(TeacherDashboard))
    await screen.findByRole('option', { name: 'Day 1' })
    fireEvent.click(screen.getByRole('button', { name: 'Create session' }))
    await screen.findByRole('button', { name: 'End session' })

    capturedObserveCallbacks?.onRoster?.([
      { studentId: 'student-maria', displayName: 'Maria' },
      { studentId: 'student-jonas', displayName: 'Jonas' },
    ])
    await screen.findByText('Maria')

    // Maria raises first, then Jonas — the broadcast queue is oldest-first.
    capturedObserveCallbacks?.onHandsUpdated?.(['student-maria', 'student-jonas'])
    await screen.findAllByRole('button', { name: 'Lower hand' })

    const roster = screen.getByText('Students').closest('aside')
    if (!roster) throw new Error('roster aside not found')
    const rows = roster.querySelectorAll('li')
    expect(rows[0]).toHaveTextContent('Maria')
    expect(rows[1]).toHaveTextContent('Jonas')
  })
})
