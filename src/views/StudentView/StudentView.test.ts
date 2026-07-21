import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Monaco can't run in jsdom.
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }: { value: string }) =>
    createElement('textarea', { 'data-testid': 'editor', defaultValue: value }),
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
    ],
  }),
  fetchStudentAssignmentSet: vi.fn().mockResolvedValue({
    assignmentSetId: 'all-assignments-for-solo-2026',
    displayTitle: 'BootIT — All Assignments (Solo) 2026',
    assignments: [
      {
        id: 1,
        kind: 'code',
        title: 'Hello, World!',
        description: 'Make the program print exactly: Hello World!',
        starter: 'public class Main {}',
      },
    ],
  }),
}))

vi.mock('@lib/sessionApi', () => ({
  getSession: vi.fn().mockResolvedValue({ code: 'ABCD1234', assignmentSetId: 'set-1' }),
}))

vi.mock('@lib/sessionHub', () => ({
  joinSession: vi.fn().mockResolvedValue(undefined),
}))

const { default: StudentView } = await import('./StudentView')

describe('StudentView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the entry screen first, not the IDE', () => {
    render(createElement(StudentView))
    expect(screen.getByText('Welcome to bootIT')).toBeInTheDocument()
    expect(screen.queryByTestId('editor')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Assignments' })).not.toBeInTheDocument()
  })

  it('reveals the workspace chrome after starting solo practice', async () => {
    render(createElement(StudentView))
    fireEvent.change(screen.getByPlaceholderText('e.g. Maria'), { target: { value: 'Maria' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solo practice' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start solo practice' }))

    expect(await screen.findByRole('heading', { name: 'Assignments' })).toBeInTheDocument()
    expect(screen.getByText('Terminal')).toBeInTheDocument()
    expect(screen.getByTestId('editor')).toBeInTheDocument()
  })

  it('resumes a joined room from a persisted session after refresh', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join', code: 'ABCD1234' }))

    render(createElement(StudentView))

    expect(await screen.findByRole('heading', { name: 'Assignments' })).toBeInTheDocument()
    expect(screen.getByText('Room: ABCD1234')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument()
  })

  it('resumes solo practice from a persisted session after refresh', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'solo' }))

    render(createElement(StudentView))

    expect(await screen.findByRole('heading', { name: 'Assignments' })).toBeInTheDocument()
    expect(screen.getByText('Solo practice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exit' })).toBeInTheDocument()
  })

  it('leaving the session clears storage and returns to the entry screen', async () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'solo' }))
    render(createElement(StudentView))
    await screen.findByRole('heading', { name: 'Assignments' })

    fireEvent.click(screen.getByRole('button', { name: 'Exit' }))

    expect(screen.getByText('Welcome to bootIT')).toBeInTheDocument()
    expect(localStorage.getItem('bootit.studentSession')).toBeNull()
  })
})
