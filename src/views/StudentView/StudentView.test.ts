import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Monaco can't run in jsdom.
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }: { value: string }) =>
    createElement('textarea', { 'data-testid': 'editor', value, readOnly: true }),
}))

// The assignment set now comes from the backend; stub the seam so the solo flow
// works without a running API.
vi.mock('@/api/assignmentSetApi.ts', () => ({
  SOLO_ASSIGNMENT_SET_ID: 'all-assignments-for-solo-2026',
  fetchAssignmentSets: vi.fn(),
  fetchAssignmentSet: vi.fn().mockResolvedValue({
    assignmentSetId: 'set-1',
    displayTitle: 'Room Assignment Set',
    assignments: [
      {
        id: 1,
        kind: 'code',
        title: 'Hello, World!',
        description: 'Make the program print exactly: Hello World!',
        starter: 'public class Main {}',
      },
      {
        id: 2,
        kind: 'code',
        title: 'Variables',
        description: 'Declare a variable.',
        starter: 'public class Main {}',
      },
    ],
  }),
  fetchSoloAssignmentSet: vi.fn().mockResolvedValue({
    assignmentSetId: 'all-assignments-for-solo-2026',
    displayTitle: 'BootIT — All Assignments (Solo) 2026',
    assignments: [
      {
        id: 1,
        kind: 'code',
        title: 'Person class',
        description: 'Create a Person class.',
        starterFiles: [
          { name: 'Main.java', content: 'public class Main {}' },
          { name: 'Person.java', content: 'public class Person {}' },
        ],
        entryClass: 'Main',
      },
    ],
  }),
}))

vi.mock('@/api/sessionApi.ts', () => ({
  getSession: vi.fn().mockResolvedValue({ code: 'ABCD1234', assignmentSetId: 'set-1' }),
  fetchTodayLatestSession: vi.fn().mockResolvedValue(null),
}))

vi.mock('@/api/submissionApi.ts', () => ({
  fetchSubmissionHistory: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/api/studentApi.ts', () => ({
  upsertStudent: vi.fn().mockResolvedValue(undefined),
}))

interface JoinSessionCallbacks {
  onAssignmentFocused?: (id: number) => void
  onTimerStarted?: (timer: { endsAt: string }) => void
  onSessionEnded?: () => void
  onHandsUpdated?: (studentIds: string[]) => void
}
let capturedJoinCallbacks: JoinSessionCallbacks | null = null
vi.mock('@/api/sessionHub.ts', () => ({
  joinSession: vi.fn((_args: unknown, callbacks: JoinSessionCallbacks) => {
    capturedJoinCallbacks = callbacks
    return Promise.resolve(undefined)
  }),
  leaveSession: vi.fn().mockResolvedValue(undefined),
  raiseHand: vi.fn().mockResolvedValue(undefined),
  lowerHand: vi.fn().mockResolvedValue(undefined),
}))

const { default: StudentView } = await import('./StudentView')
const { raiseHand, lowerHand } = await import('@/api/sessionHub.ts')

describe('StudentView', () => {
  beforeEach(() => {
    localStorage.clear()
    capturedJoinCallbacks = null
    vi.mocked(raiseHand).mockClear()
    vi.mocked(lowerHand).mockClear()
  })

  it('shows the entry screen first, not the IDE', () => {
    render(createElement(StudentView))
    expect(screen.getByRole('heading', { name: 'BootCode' })).toBeInTheDocument()
    expect(screen.queryByTestId('editor')).not.toBeInTheDocument()
    expect(screen.queryByText('Terminal')).not.toBeInTheDocument()
  })

  it('reveals the workspace chrome after starting solo practice', async () => {
    render(createElement(StudentView))
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Maria' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solo Practice' }))

    expect(await screen.findByText('Terminal')).toBeInTheDocument()
    expect(screen.getByText('Terminal')).toBeInTheDocument()
    expect(screen.getByTestId('editor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Main\.java/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Person\.java/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Person\.java/ }))
    expect(screen.getByTestId('editor')).toHaveValue('public class Person {}')
  })

  it('resumes a joined room from a persisted session after refresh', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join', code: 'ABCD1234' }))

    render(createElement(StudentView))

    expect(await screen.findByText('Terminal')).toBeInTheDocument()
    expect(screen.getByText('Room: ABCD1234')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument()
  })

  it('resumes solo practice from a persisted session after refresh', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'solo' }))

    render(createElement(StudentView))

    expect(await screen.findByText('Terminal')).toBeInTheDocument()
    expect(screen.getByText('Solo practice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exit' })).toBeInTheDocument()
  })

  it('shows a follow banner when the teacher moves to a different assignment, and follows on click', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join', code: 'ABCD1234' }))
    render(createElement(StudentView))
    await screen.findByText('Terminal')
    expect(screen.getByRole('heading', { name: 'Hello, World!' })).toBeInTheDocument()

    capturedJoinCallbacks?.onAssignmentFocused?.(2)

    expect(await screen.findByText('Follow →')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Follow →'))

    expect(screen.getByRole('heading', { name: 'Variables' })).toBeInTheDocument()
    expect(screen.queryByText('Follow →')).not.toBeInTheDocument()
  })

  it('bounces back to the entry screen when the teacher ends the session', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join', code: 'ABCD1234' }))
    render(createElement(StudentView))
    await screen.findByText('Terminal')

    capturedJoinCallbacks?.onSessionEnded?.()

    expect(await screen.findByRole('heading', { name: 'BootCode' })).toBeInTheDocument()
    expect(screen.getByText('This session has ended — ask your teacher for the new code.')).toBeInTheDocument()
    expect(localStorage.getItem('bootit.studentSession')).toBeNull()
  })

  it('leaving the session clears storage and returns to the entry screen', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'solo' }))
    render(createElement(StudentView))
    await screen.findByText('Terminal')

    fireEvent.click(screen.getByRole('button', { name: 'Exit' }))

    expect(screen.getByRole('heading', { name: 'BootCode' })).toBeInTheDocument()
    expect(localStorage.getItem('bootit.studentSession')).toBeNull()
  })

  // Raise Hand, student side.
  it('does not render a Raise Hand button in solo practice — there is no teacher to notify', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'solo' }))
    render(createElement(StudentView))
    await screen.findByText('Terminal')

    expect(screen.queryByText('Raise Hand')).not.toBeInTheDocument()
  })

  it('raises the hand via the hub when Raise Hand is clicked in a room', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join', code: 'ABCD1234' }))
    render(createElement(StudentView))
    await screen.findByText('Terminal')
    const studentId = localStorage.getItem('bootit.studentId')

    fireEvent.click(screen.getByRole('button', { name: 'Raise Hand' }))

    expect(raiseHand).toHaveBeenCalledWith('ABCD1234', studentId)
  })

  it('shows "Hand Raised" once the hub echoes the broadcast back, and lowers it on the next click', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join', code: 'ABCD1234' }))
    render(createElement(StudentView))
    await screen.findByText('Terminal')
    const studentId = localStorage.getItem('bootit.studentId')

    fireEvent.click(screen.getByRole('button', { name: 'Raise Hand' }))
    // Simulate the room broadcast confirming the raise (own tab included).
    capturedJoinCallbacks?.onHandsUpdated?.([studentId as string])

    expect(await screen.findByRole('button', { name: 'Hand Raised' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hand Raised' }))

    expect(lowerHand).toHaveBeenCalledWith('ABCD1234', studentId)
  })
})
