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
vi.mock('@lib/assignmentSetApi', () => ({
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
  fetchStudentAssignmentSet: vi.fn().mockResolvedValue({
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

vi.mock('@lib/sessionApi', () => ({
  getSession: vi.fn().mockResolvedValue({ code: 'ABCD1234', assignmentSetId: 'set-1' }),
  fetchTodayLatestSession: vi.fn().mockResolvedValue(null),
}))

vi.mock('@lib/submissionApi', () => ({
  fetchSubmissionHistory: vi.fn().mockResolvedValue([]),
}))

vi.mock('@lib/studentApi', () => ({
  upsertStudent: vi.fn().mockResolvedValue(undefined),
}))

interface JoinSessionCallbacks {
  onAssignmentFocused?: (id: number) => void
  onSessionEnded?: () => void
}
let capturedJoinCallbacks: JoinSessionCallbacks | null = null
vi.mock('@lib/sessionHub', () => ({
  joinSession: vi.fn((_args: unknown, callbacks: JoinSessionCallbacks) => {
    capturedJoinCallbacks = callbacks
    return Promise.resolve(undefined)
  }),
}))

const { default: StudentView } = await import('./StudentView')

describe('StudentView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the entry screen first, not the IDE', () => {
    render(createElement(StudentView))
    expect(screen.getByText('Welcome to BootIT')).toBeInTheDocument()
    expect(screen.queryByTestId('editor')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Assignments' })).not.toBeInTheDocument()
  })

  it('reveals the workspace chrome after starting solo practice', async () => {
    render(createElement(StudentView))
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Maria' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solo Practice' }))

    expect(await screen.findByRole('navigation', { name: 'Assignments' })).toBeInTheDocument()
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

    expect(await screen.findByRole('navigation', { name: 'Assignments' })).toBeInTheDocument()
    expect(screen.getByText('Room: ABCD1234')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument()
  })

  it('resumes solo practice from a persisted session after refresh', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'solo' }))

    render(createElement(StudentView))

    expect(await screen.findByRole('navigation', { name: 'Assignments' })).toBeInTheDocument()
    expect(screen.getByText('Solo practice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exit' })).toBeInTheDocument()
  })

  it('shows a follow banner when the teacher moves to a different assignment, and follows on click', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join', code: 'ABCD1234' }))
    render(createElement(StudentView))
    await screen.findByRole('navigation', { name: 'Assignments' })
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
    await screen.findByRole('navigation', { name: 'Assignments' })

    capturedJoinCallbacks?.onSessionEnded?.()

    expect(await screen.findByText('Welcome to BootIT')).toBeInTheDocument()
    expect(screen.getByText('This session has ended — ask your teacher for the new code.')).toBeInTheDocument()
    expect(localStorage.getItem('bootit.studentSession')).toBeNull()
  })

  it('leaving the session clears storage and returns to the entry screen', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'solo' }))
    render(createElement(StudentView))
    await screen.findByRole('navigation', { name: 'Assignments' })

    fireEvent.click(screen.getByRole('button', { name: 'Exit' }))

    expect(screen.getByText('Welcome to BootIT')).toBeInTheDocument()
    expect(localStorage.getItem('bootit.studentSession')).toBeNull()
  })
})
